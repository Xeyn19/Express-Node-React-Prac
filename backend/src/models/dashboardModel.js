import db from "../../config/db.js";

const STATUSES = ["Applied", "Interview", "Offer", "Rejected"];

export const getDashboardStatsForUser = async (userId) => {
  const [[totalRow]] = await db.query(
    "SELECT COUNT(*) AS total FROM job_applications WHERE user_id = ?",
    [userId]
  );

  const [statusRows] = await db.query(
    "SELECT status, COUNT(*) AS count FROM job_applications WHERE user_id = ? GROUP BY status",
    [userId]
  );

  const [recentJobs] = await db.query(
    "SELECT id, company, position, status, date_applied FROM job_applications WHERE user_id = ? ORDER BY date_applied DESC, created_at DESC LIMIT 5",
    [userId]
  );

  const byStatus = STATUSES.reduce((acc, status) => {
    acc[status] = 0;
    return acc;
  }, {});

  for (const row of statusRows) {
    if (row.status && Object.hasOwn(byStatus, row.status)) {
      byStatus[row.status] = Number(row.count) || 0;
    }
  }

  const total = Number(totalRow?.total) || 0;
  const offers = byStatus.Offer || 0;
  const successRate = total ? Math.round((offers / total) * 100) : 0;

  return {
    total,
    byStatus,
    recentJobs,
    successRate,
  };
};
