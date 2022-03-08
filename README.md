# GitHub Action: Verify All Reviewers 

Currently, there is not an option within GitHub’s "Branch Protection Rules" to ensure that all reviewers have approved a pull request. As part of treating meetings as code, we require all attendees to sign off (approve) meeting notes. The approval will 1) confirm their presence at the meeting and 2) represent a blessing of the final meeting notes being submitted.   

## Development

### Prerequisites

1. Install [Node.js](https://nodejs.org/) using the [installer](https://nodejs.org/en/download/) or a version manager such as [nvm](https://github.com/nvm-sh/nvm) or [fnm](https://github.com/Schniz/fnm).
2. Install [`yarn`](https://yarnpkg.com/getting-started/install) or [`npm`](https://github.com/npm/cli#installation) to install dependencies.
3. Install dependencies with `yarn install`.
4. Install the build tool: `npm i -g @vercel/ncc`

#### Build
ncc build src/index.js -o dist 

### Changelog
 The history of this integration's development can be viewed at [CHANGELOG.md](CHANGELOG.md).