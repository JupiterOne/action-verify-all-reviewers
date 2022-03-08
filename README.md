# GitHub Action: Verify All Reviewers 

Currently, there is not an option within GitHub’s "Branch Protection Rules" to ensure that all reviewers have approved a pull request. As part of treating meetings as code, we require all attendees to sign off (approve) meeting notes. The approval will 1) confirm their presence at the meeting and 2) represent a blessing of the final meeting notes being submitted.   

## Development

### Prerequisites

1. Install [Node.js](https://nodejs.org/) using the [installer](https://nodejs.org/en/download/) 
2. Install [`yarn`](https://yarnpkg.com/getting-started/install) or [`npm`](https://github.com/npm/cli#installation) to install dependencies.
3. Install dependencies with `yarn install`.
4. Install the build tool: `npm i -g @vercel/ncc`

### Build
yarn build 

### Installation
Copy the .github/workflows/verify_all_approvers.yml to the .github/workflows folder in your repo. 
Edit verify_all_approvers.yml and set the auto_merge variable. If set to true, the pr will merge when all reviewers have approved the pull request.

### Changelog
 The history of this integration's development can be viewed at [CHANGELOG.md](CHANGELOG.md).