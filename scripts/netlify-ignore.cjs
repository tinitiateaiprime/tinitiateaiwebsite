// Netlify ignore uses Node 18 without project dependencies: exit 0 skips a build.
// Only the explicitly requested staging branch is eligible, including for PRs.
process.exitCode = process.env.BRANCH === 'deploy/netlify-staging' ? 1 : 0;
