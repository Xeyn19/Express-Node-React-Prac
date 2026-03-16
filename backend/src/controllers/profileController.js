import {
  createUserProfile,
  getUserProfileByUserId,
  updateUserProfile,
} from "../models/userProfileModel.js";

export const getProfile = async (req, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized." });
    }

    const profile = await getUserProfileByUserId(userId);

    return res.status(200).json({
      message: "Profile fetched.",
      has_profile: Boolean(profile),
      profile: {
        preferred_role: profile?.preferred_role || "",
        target_location: profile?.target_location || "",
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: "Unable to fetch profile.",
      error: error.message,
    });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized." });
    }

    const { preferred_role, target_location } = req.body || {};
    const preferredRole = preferred_role?.trim() || null;
    const targetLocation = target_location?.trim() || null;

    const existingProfile = await getUserProfileByUserId(userId);

    if (existingProfile) {
      await updateUserProfile({
        profileId: existingProfile.id,
        preferredRole,
        targetLocation,
      });
    } else {
      await createUserProfile({
        userId,
        preferredRole,
        targetLocation,
      });
    }

    return res.status(200).json({
      message: "Profile updated.",
      has_profile: true,
      profile: {
        preferred_role: preferredRole || "",
        target_location: targetLocation || "",
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: "Unable to update profile.",
      error: error.message,
    });
  }
};
