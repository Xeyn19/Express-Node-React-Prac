import db from "../../config/db.js";

export const createJobApplication = async ({
  userId,
  company,
  position,
  status,
  dateApplied,
  jobUrl,
  notes,
  resumePath,
}) => {
  const [result] = await db.query(
    "INSERT INTO job_applications (user_id, company, position, status, date_applied, job_url, notes, resume_path, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())",
    [
      userId,
      company,
      position,
      status,
      dateApplied,
      jobUrl,
      notes,
      resumePath,
    ]
  );

  return result.insertId;
};

export const getJobApplicationsByUserId = async (userId) => {
  const [rows] = await db.query(
    "SELECT id, company, position, status, date_applied, job_url, notes, resume_path, created_at FROM job_applications WHERE user_id = ? ORDER BY date_applied DESC, created_at DESC",
    [userId]
  );

  return rows;
};

export const deleteJobApplicationById = async (userId, jobId) => {
  const [result] = await db.query(
    "DELETE FROM job_applications WHERE id = ? AND user_id = ?",
    [jobId, userId]
  );

  return result.affectedRows;
};
