# GitHub PR Report Tool

## Overview

This is a CLI tool to fetch merged pull requests and their reviews from a specified GitHub repository within a user-defined date range. It generates a report summarizing PR activity over that timeframe. The tool uses the GitHub REST API and requires a personal access token for authentication.

---

## Features

- Fetch merged PRs within a date range
- Retrieve reviews for each PR
- Supports pagination to handle large repositories
- Filters PRs based on merge date accurately
- Outputs structured data for further analysis or reporting

---

## Tech Stack & Versions

- **Node.js**: v18 or higher (tested on v23.11.1)
- **dayjs**: v1.11.7 (with `isSameOrAfter` and `isSameOrBefore` plugins)
- **axios**: v1.4.0
- **commander**: v11.0.0
- **dotenv**: v16.1.4

---

## Prerequisites

- A GitHub personal access token (PAT) with **`repo`** scope to access private repositories or **public repo** access for public repositories.
- Node.js installed on your machine (recommend using Node Version Manager - `nvm`).

---

## Installation & Setup

1. **Clone the repository**

```bash
git clone https://github.com/saurify/github-pr-report-cli.git
cd github-pr-report-cli
```

2. **Install dependencies**

```bash
npm install
```


3. **Set up your GitHub token**

Set up your GitHub token in a .env file in your root directory

```bash
GITHUB_TOKEN=your_personal_access_token_here
```

---

## Usage

Run the CLI with the required options:

```bash
node src/cli.js --repo https://github.com/owner/repo --from 2025-01-01 --to 2025-05-21
```

## Options

- `--repo` - (required) GitHub repository URL (e.g., https://github.com/facebook/react)

- `--from` - (required) Start date (format: YYYY-MM-DD)

- `--to` - (required) End date (format: YYYY-MM-DD)

---

## Example

```bash
node src/cli.js --repo https://github.com/facebook/react --from 2024-01-01 --to 2024-04-01
```
Output: Summary of merged PRs and their reviews within the given date range.

---

## Important Notes

- Ensure your GitHub token has appropriate scopes for the repositories you want to query.
- The tool paginates results to handle large repos but may take time if the repository has many PRs.
- Date comparisons are inclusive of the from and to dates.
- This tool is designed as a reporting utility and not for continuous real-time monitoring.

---

## Troubleshooting

- **No PRs returned in date range** \
Double-check your date formats and repository URL. Also, verify the token permissions.

---

## License

MIT License © 2025 Saurabh Singh
