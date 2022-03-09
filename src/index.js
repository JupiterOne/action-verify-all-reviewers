const core = require('@actions/core');
const github = require('@actions/github');


const main = async () => {
  try {

    //#region Set script consts
    const autoMerge = core.getInput('auto_merge', {required: true});
    const owner = core.getInput('owner', { required: true });
    const repo = core.getInput('repo', { required: true });
    const token = core.getInput('token', { required: true });
    const pullNumber = core.getInput('pr_number', { required: true });
    const octokit = github.getOctokit(token);
    let shouldMerge = true; 
    //#endregion


    //#region Check for reviewers
    //Get the current pr request
    const { data: pullRequest } = await octokit.rest.pulls.get({
        owner: owner,
        repo: repo,
        pull_number: pullNumber
      });

    //Get a list of reviewers from the pr request
    const reviewers = pullRequest.requested_reviewers;

    //Check to see if reviewers have been added or any reviewers left to approve.
    //Once reviewers have approved everything, there is a second API that needs to
    //be called to check for an approval or just a comment.
    if (reviewers.length > 0)
    {
      core.setFailed(`${reviewers.length} reviewer(s) left to review.`);
      shouldMerge = false;
    }  
    //#endregion Check reviewers 


    //#region Check for reviews and approvals
    //Get a list of reviews
    const { data: reviewComments } = await octokit.rest.pulls.listReviews({
      owner: owner,
      repo: repo,
      pull_number: pullNumber
    });

    //If there are reviewer approvals, grab all the users.login and put into array
    if (reviewComments.length > 0)
    {
      const reviewedUserLogin = [];
      for (const reviewComment of reviewComments)
      {
        //check to see if the user is already in the array before pushing on stack
        if(! reviewedUserLogin.includes(reviewComment.user.login) )
        {
          //Go through the json to see if the user has approved the pull.
          do 
          {
            if(reviewComment.state === "APPROVED")
            {
              reviewedUserLogin.push(reviewComment.user.login);
            }
          }
          //Once the user has been found and added to the array, move on.
          while(! reviewedUserLogin.includes(reviewComment.user.login) )  
        }
      }

      //Check for at least 1 approver. If comments were made, but none approved, error out.
      if( reviewedUserLogin.length > 0 )
      {
        //Get a human readable user name if available
        var reviewedUsers = [];

        //Using for in instead of foreach due to chaining errors
        for (const userLogin of reviewedUserLogin)
        {

          const { data: reviewedUserName} = await octokit.rest.users.getByUsername({
            username: userLogin
            });
          
          if (reviewedUserName.name !== null )
          {
            reviewedUsers.push(reviewedUserName.name);
          }
          else
          {
            reviewedUsers.push(userLogin);
          }
        }
                  
        core.info(`Current Approver(s): ${reviewedUsers.toString()}`);

      }
      else
      {
        core.setFailed(`No approvals found.`);
        shouldMerge = false;
      }
      
    }
    //If there are no reviewers, error out; there should be some
    else
    {
      core.setFailed(`No reviewers found.`);
      shouldMerge = false;
    }
    //#endregion

    //#region Rerun any failed pull_request checks. These might happen during initial creation.

    //get a list of check runs
    const check_runs = (await octokit.rest.checks.listForRef({
        owner: owner,
        repo: repo,
        ref: pullRequest[0].sha
      })).data.check_runs;

      for (var check_run of check_runs) {
        if(check_run.app.slug == 'github-actions')
        {
          //Get the check run id
          const job = (await octokit.rest.actions.getJobForWorkflowRun({
                        owner: owner,
                        repo: repo,
                        job_id : check_run.id,
                      })).data;
        }

        // Get the actions run from the job
        const actions_run = (await octokit.rest.actions.getWorkflowRun({
                              owner: owner,
                              repo: repo,
                              run_id : job.run_id,
                            })).data;

        //Find the failed pull_request event and rerun it
        if(actions_run.event === "pull_request")
        {
          await octokit.request('POST /repos/{owner}/{repo}/actions/runs/{run_id}/rerun',
                                {
                                    owner: "electricgull",
                                    repo: "test-docs-repo",
                                    run_id: actions_run.id
                                });
        }

      }
    //#endregion
  }
  catch (error) {
    core.setFailed(error.message);
  }
}

main();
