# GitHub Secrets Scanner Action

This GitHub Action scans your code for secrets like API keys, passwords, and tokens to prevent sensitive data from being accidentally exposed.

## Inputs

### `repo` (required)
- **Description**: The GitHub repository to scan (e.g., `owner/repo`).
- **Example**: `Yash-srivastav16/github-secrets-scanner-action`.

### `token` (required)
- **Description**: GitHub authentication token for API access.
- **Example**: `${{ secrets.GITHUB_TOKEN }}`.

### `branch` (optional, default: `main`)
- **Description**: The branch to scan.
- **Example**: `main`.

### `patterns` (optional, default: `API_KEY,SECRET_KEY,TOKEN`)
- **Description**: Comma-separated list of regex patterns to detect secrets.
- **Example**: `API_KEY,SECRET_KEY,TOKEN`.

## Example Usage

### Simple Example (in GitHub Actions Workflow)

```yaml
name: Test GitHub Secrets Scanner Action
on:
  push:
    branches:
      - main
  pull_request:
    branches:
      - main

jobs:
  run-action:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout repository
        uses: actions/checkout@v3
        with:
            fetch-depth: 0  # Ensure full commit history is fetched for proper diff comparison

      - name: Install dependencies
        run: npm install
    
      - name: Run Secrets Scanner
        uses: Yash-srivastav16/github-secrets-scanner-action@v1
        with:
          token: ${{ secrets.GITHUB_TOKEN }}
          repo: 'Yash-srivastav16/github-secrets-scanner-action'
          branch: 'main'
          patterns: 'API_KEY,SECRET_KEY,TOKEN'
