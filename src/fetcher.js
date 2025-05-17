import axios from 'axios';
import dayjs from 'dayjs';
import { logInfo, logError } from './utils.js';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter.js';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore.js';

dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

const GITHUB_API = 'https://api.github.com';
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
console.log('Loaded token:', process.env.GITHUB_TOKEN?.slice(0, 5));

const headers = GITHUB_TOKEN
    ? { Authorization: `Bearer ${GITHUB_TOKEN}` }
    : {};

const perPage = 100;

/**
 * Fetch merged PRs in the date range
 */
export async function fetchPRsAndReviews(owner, repo, fromDate, toDate) {
    logInfo(`Fetching PRs from ${fromDate.format('YYYY-MM-DD')} to ${toDate.format('YYYY-MM-DD')}...`);
    let page = 1;
    let results = [];
    
    while (true) {
        const url = `${GITHUB_API}/repos/${owner}/${repo}/pulls?state=closed&sort=updated&direction=desc&per_page=${perPage}&page=${page}`;
        const res = await axios.get(url, { headers });

        const prs = res.data.filter(pr =>
            pr.merged_at &&
            dayjs(pr.merged_at).isSameOrAfter(fromDate) &&
            dayjs(pr.merged_at).isSameOrBefore(toDate)
        );
        // console.log((prs));

        results.push(...prs);

        if (res.data.length < perPage) break;
        page++;
    }


    logInfo(`Found ${results.length} merged PRs.`);

    // Fetch reviews for each PR
    const enriched = [];
    for (const pr of results) {
        const reviews = await fetchReviews(owner, repo, pr.number);
        enriched.push({ ...pr, reviews });
    }

    return enriched;
}

/**
 * Fetch all reviews for a PR
 */
async function fetchReviews(owner, repo, prNumber) {
    const url = `${GITHUB_API}/repos/${owner}/${repo}/pulls/${prNumber}/reviews`;
    try {
        const res = await axios.get(url, { headers });
        return res.data;
    } catch (err) {
        logError(`Failed to fetch reviews for PR #${prNumber}`);
        return [];
    }
}
