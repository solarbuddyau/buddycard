# buddycard
BuddyCard development repository

## Raisely CLI Cheatsheet (copied from https://github.com/raisely/cli README):
### Getting Started
Install the CLI globally: `npm install @raisely/cli -g`

### Commands
 - `raisely init` - [_DO NOT USE IN THIS REPO_] start a new Raisely project, authenticate and sync your campaigns
 - `raisely update` - update local copies of styles and components from the API
 - `raisely create [name]` - create a new custom component, optionally add the component name to the command (otherwise you will be asked for one)
 - `raisely start` - starts watching for and uploading changes to styles and components
 - `raisely deploy` - deploy your local code to Raisely _USE WITH CAUTION_
 - `raisely local` - work locally on a Raisely campaign without syncing changes up

### CI/CD Usage
Raisely CLI supports usage in a CI/CD environment for auto-deployment of styles and components. In this scenario you would use the CLI to deploy local code, and overwrite what is on a Raisely campaign or account.

Raisely CLI supports the following environment variables:

 - `RAISELY_TOKEN` – your API secret key
 - `RAISELY_CAMPAIGNS` - a comma-separated list of campaign uuids to sync (so you can be selective)
Note: All components are always synced, when they're present in the directory your syncing

With these environment variables set, run: `raisely deploy`. This will sync your local directory to the remote Raisely account, overwriting the styles and components on the destination campaign.
