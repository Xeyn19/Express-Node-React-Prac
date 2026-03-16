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

export const getJobApplicationsByUserId = async (
  userId,
  { status, search, sort } = {}
) => {
  let query =
    "SELECT id, company, position, status, DATE_FORMAT(date_applied, '%Y-%m-%d') AS date_applied, job_url, notes, resume_path, created_at FROM job_applications WHERE user_id = ?";
  const params = [userId];

  if (status) {
    query += " AND status = ?";
    params.push(status);
  }

  if (search) {
    query += " AND (company LIKE ? OR position LIKE ?)";
    const like = `%${search}%`;
    params.push(like, like);
  }

  const order = sort === "oldest" ? "ASC" : "DESC";
  query += ` ORDER BY date_applied ${order}, created_at ${order}`;

  const [rows] = await db.query(query, params);

  return rows;
};

export const getJobApplicationByIdForUser = async (userId, jobId) => {
  const [rows] = await db.query(
    "SELECT id, resume_path FROM job_applications WHERE id = ? AND user_id = ? LIMIT 1",
    [jobId, userId]
  );

  return rows[0] || null;
};

export const deleteJobApplicationById = async (userId, jobId) => {
  const [result] = await db.query(
    "DELETE FROM job_applications WHERE id = ? AND user_id = ?",
    [jobId, userId]
  );

  return result.affectedRows;
};

export const updateJobApplicationById = async ({
  userId,
  jobId,
  company,
  position,
  status,
  dateApplied,
  jobUrl,
  notes,
  resumePath,
}) => {
  const [result] = await db.query(
    "UPDATE job_applications SET company = ?, position = ?, status = ?, date_applied = ?, job_url = ?, notes = ?, resume_path = ? WHERE id = ? AND user_id = ?",
    [
      company,
      position,
      status,
      dateApplied,
      jobUrl,
      notes,
      resumePath,
      jobId,
      userId,
    ]
  );

  return result.affectedRows;
};
