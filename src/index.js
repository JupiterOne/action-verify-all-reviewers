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
    let mergeCheck = true; 
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

    //Check to see if there are any reviewers left
    if (reviewers.length > 0)
    {
      core.setFailed(`${reviewers.length} reviewer(s) left to review.`);
      mergeCheck = false;
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
      var reviewedUserLogin = [];
      for(let i = 0; i < reviewComments.length; i++)
      {
        //check to see if the user is already in the array before pushing on stack
        if(! reviewedUserLogin.includes(reviewComments[i].user.login) )
        {
          //Go through the json to see if the user has approved the pull.
          do 
          {
            if(reviewComments[i].state === "APPROVED")
            {
              reviewedUserLogin.push(reviewComments[i].user.login);
            }
          }
          //Once the user has been found and added to the array, move on.
          while(! reviewedUserLogin.includes(reviewComments[i].user.login) )  
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
        mergeCheck = false;
      }
      
    }
    //If there are no reviewers, error out; there should be some
    else
    {
      core.setFailed(`No reviewers found.`);
      mergeCheck = false;
    }
    //#endregion

    //#region Check if automerge is turned on and if mergeCheck is still true
    if(mergeCheck && autoMerge)
    {

      //Merge branch
      await octokit.rest.pulls.merge({
        owner: owner,
        repo: repo,
        pull_number: pullNumber,
        commit_title: `All reviewers have verified.`,
        commit_message: `Approved by reviewers: ${reviewedUsers.toString()}`

      });
    }

    
  }
  catch (error) {
    core.setFailed(error.message);
  }
}

main();
