const core = require('@actions/core');
const github = require('@actions/github');
const simpleGit = require('simple-git');
const git = simpleGit();

// Helper function to fetch commits and check files for secrets
async function checkCommitsForSecrets(commitHash,previousCommitHash, patterns) {
  const diff = await git.diff([commitHash, previousCommitHash]);
  const regexPatterns = patterns.split(',').map(p => new RegExp(p, 'i'));

  let foundSecrets = [];

  regexPatterns.forEach(pattern => {
    if (diff && pattern.test(diff)) {
      foundSecrets.push(pattern.toString());
    }
  });

  return foundSecrets;
}

async function run() {
  try {
    const repo = core.getInput('repo');
    const token = core.getInput('token');
    const branch = core.getInput('branch');
    const patterns = core.getInput('patterns');

    const [owner, repoName] = repo.split('/');

    const octokit = github.getOctokit(token);

    // Fetch the latest commit from the repository
    const commits = await octokit.rest.repos.listCommits({
      owner,
      repo: repoName,
      sha: branch,
      per_page: 2,
    });

   
    const latestCommitHash = commits.data[0].sha;
    const previousCommitHash = commits.data[1].sha;
    core.info(`Latest commit hash: ${latestCommitHash}`);
    core.info(`Latest commit hash: ${previousCommitHash}`);

    // Check for secrets in the latest commit
    const secretsFound = await checkCommitsForSecrets(latestCommitHash, previousCommitHash, patterns);

    if (secretsFound.length > 0) {
      core.setFailed(`Found secrets: ${secretsFound.join(', ')}`);
    } else {
      core.info('No secrets found in the latest commit!');
    }

  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
