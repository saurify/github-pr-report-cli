#!/usr/bin/env node
import { program } from 'commander';
import 'dotenv/config';
import dayjs from 'dayjs';
import { fetchPRsAndReviews } from './fetcher.js';
import { generateReport } from './aggregator.js';

program
  .requiredOption('--repo <url>', 'GitHub repo URL')
  .requiredOption('--from <date>', 'Start date (YYYY-MM-DD)')
  .requiredOption('--to <date>', 'End date (YYYY-MM-DD)');

program.parse();
const { repo, from, to } = program.opts();

const [owner, name] = repo.replace('https://github.com/', '').split('/');

(async () => {
  const start = dayjs(from);
  const end = dayjs(to);
  if (!start.isValid() || !end.isValid()) {
    console.error('Invalid date format. Use YYYY-MM-DD');
    process.exit(1);
  }

  const data = await fetchPRsAndReviews(owner, name, start, end);
  generateReport(data);
})();
