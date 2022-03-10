# GitHub Action: Verify All Reviewers 

Currently, there is not an option within GitHub’s "Branch Protection Rules" to ensure that all reviewers have approved a pull request. This action is a mechanism for enforcing this review behavior, and optionally merging the PR automatically when all reviewers have approved.

## Development

### Prerequisites

1. Install [Node.js](https://nodejs.org/) using the [installer](https://nodejs.org/en/download/) 
2. Install [`yarn`](https://yarnpkg.com/getting-started/install) or [`npm`](https://github.com/npm/cli#installation) to install dependencies.
3. Install dependencies with `yarn install`.
4. Install the build tool: `npm i -g @vercel/ncc`

### Build
yarn build 

### Changelog
 The history of this integration's development can be viewed at [CHANGELOG.md](CHANGELOG.md).


 ### Usage

 #### Installation
1. Copy [`verify_all_reviewers.yml`](https://github.com/JupiterOne/action-verify-all-reviewers/blob/main/.github/workflows/verify_all_reviewers.yml) and [`check_for_reviewers.yml`](https://github.com/JupiterOne/action-verify-all-reviewers/blob/main/.github/workflows/check_for_reviewers.yml) to the .github/workflows folder in your repo.



#### GitHub Configuration
Set automerge
1. Go to "settings" -> "General"
2. Select "Allow auto-merge"

Set the branch policies
1. Go to "settings" -> "branches" 
2. Either edit a current policy or create a new policy
3. Configure the following policy settings
    1. "Branch name pattern"
        1. Enter a branch name
    2. "Protect matching branches"
        1. Select "Require a pull request before merging"
        2. Select "Require approvals"
            1. Select "1"
        3. Select "Require status checks to pass before merging"
            1. Search for and select "Verify All Reviewers" and "Check for Reviewers"
    3. Click "Save changes"