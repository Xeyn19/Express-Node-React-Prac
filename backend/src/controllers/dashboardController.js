import { getDashboardStatsForUser } from "../models/dashboardModel.js";

export const getDashboardStats = async (req, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized." });
    }

    const stats = await getDashboardStatsForUser(userId);

    return res.status(200).json({
      message: "Dashboard stats fetched.",
      ...stats,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Unable to fetch dashboard stats.",
      error: error.message,
    });
  }
};
