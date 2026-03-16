import db from "../../config/db.js";

export const getUserProfileByUserId = async (userId) => {
  const [rows] = await db.query(
    "SELECT id, user_id, preferred_role, target_location FROM user_profile WHERE user_id = ? LIMIT 1",
    [userId]
  );

  return rows[0] || null;
};

export const createUserProfile = async ({
  userId,
  preferredRole,
  targetLocation,
}) => {
  const [result] = await db.query(
    "INSERT INTO user_profile (user_id, preferred_role, target_location, created_at, updated_at) VALUES (?, ?, ?, NOW(), NOW())",
    [userId, preferredRole, targetLocation]
  );

  return result.insertId;
};

export const updateUserProfile = async ({
  profileId,
  preferredRole,
  targetLocation,
}) => {
  const [result] = await db.query(
    "UPDATE user_profile SET preferred_role = ?, target_location = ?, updated_at = NOW() WHERE id = ?",
    [preferredRole, targetLocation, profileId]
  );

  return result.affectedRows;
};
