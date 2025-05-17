import dayjs from 'dayjs';
import chalk from 'chalk';
import duration from 'dayjs/plugin/duration.js';

dayjs.extend(duration);

export function generateReport(pullRequests) {
  if (pullRequests.length === 0) {
    console.log(chalk.yellow('No merged PRs in the given timeframe.'));
    return;
  }

  const totalPRs = pullRequests.length;

  // Time to merge
  const mergeTimes = pullRequests.map(pr =>
    dayjs(pr.merged_at).diff(dayjs(pr.created_at), 'hours', true)
  );
  const avgTimeToMerge = average(mergeTimes);

  // Reviews and approvals
  let totalReviews = 0;
  let approvals = 0;
  const reviewerStats = {};

  pullRequests.forEach(pr => {
    const reviews = pr.reviews || [];

    reviews.forEach(review => {
      if (!review.user || !review.user.login) return;
      const user = review.user.login;
      if (!reviewerStats[user]) reviewerStats[user] = { approvals: 0, total: 0 };

      reviewerStats[user].total++;
      if (review.state === 'APPROVED') {
        reviewerStats[user].approvals++;
        approvals++;
      }
    });

    totalReviews += reviews.length;
  });

  const avgReviewsPerPR = totalReviews / totalPRs;

  const topReviewers = Object.entries(reviewerStats)
    .sort((a, b) => b[1].approvals - a[1].approvals)
    .slice(0, 5);

  // OUTPUT
  console.log(chalk.green.bold('\n📊 GitHub PR Report Summary'));
  console.log(`Total PRs merged: ${chalk.cyan(totalPRs)}`);
  console.log(`Average time to merge: ${chalk.cyan(avgTimeToMerge.toFixed(2))} hours`);
  console.log(`Average reviews per PR: ${chalk.cyan(avgReviewsPerPR.toFixed(2))}`);
  console.log(`Total approvals: ${chalk.cyan(approvals)}`);

  console.log(chalk.magenta('\nTop Reviewers:'));
  topReviewers.forEach(([user, stats]) => {
    console.log(`- ${user}: ${stats.approvals} approvals, ${stats.total} reviews`);
  });
}

function average(arr) {
  if (arr.length === 0) return 0;
  return arr.reduce((a, b) => a + b, 0) / arr.length;
}
