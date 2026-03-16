import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { authenticatedFetch } from "../lib/api";
import { toastError, toastSuccess } from "../lib/toast";

const Profile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState({
    preferred_role: "",
    target_location: "",
  });
  const [hasProfile, setHasProfile] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const fullName = user
    ? `${user.first_name || user.firstName || ""} ${user.last_name || user.lastName || ""}`.trim()
    : "";

  useEffect(() => {
    let isMounted = true;

    const loadProfile = async () => {
      try {
        setIsLoading(true);
        const response = await authenticatedFetch("/api/profile");
        const result = response.data || {};

        if (isMounted) {
          setProfile({
            preferred_role: result.profile?.preferred_role || "",
            target_location: result.profile?.target_location || "",
          });
          setHasProfile(Boolean(result.has_profile));
          setIsEditing(!result.has_profile);
        }
      } catch (fetchError) {
        const message =
          fetchError?.response?.data?.message ||
          fetchError.message ||
          "Unable to load profile.";
        toastError(message);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadProfile();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setProfile((previous) => ({ ...previous, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setIsSaving(true);
      const response = await authenticatedFetch("/api/profile", {
        method: "PUT",
        data: {
          preferred_role: profile.preferred_role.trim() || null,
          target_location: profile.target_location.trim() || null,
        },
      });
      const result = response.data || {};
      setProfile({
        preferred_role: result.profile?.preferred_role || "",
        target_location: result.profile?.target_location || "",
      });
      setHasProfile(true);
      setIsEditing(false);
      toastSuccess("Profile updated");
    } catch (saveError) {
      const message =
        saveError?.response?.data?.message ||
        saveError.message ||
        "Unable to update profile.";
      toastError(message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="page-title">Profile</h1>
        <p className="page-subtitle">
          Manage your account details and preferences.
        </p>
      </div>

      <div className="surface p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-secondary">Full name</p>
            <p className="text-lg font-semibold text-primary">
              {fullName || "Add your name"}
            </p>
          </div>
          <div>
            <p className="text-sm text-secondary">Email</p>
            <p className="text-lg font-semibold text-primary">
              {user?.email || "you@example.com"}
            </p>
          </div>
        </div>

        {isEditing ? (
          <form
            className="mt-6 grid gap-4 sm:grid-cols-2"
            onSubmit={handleSubmit}
          >
          <label className="flex flex-col gap-2 text-sm text-secondary">
              Preferred role
              <input
                type="text"
                name="preferred_role"
                value={profile.preferred_role}
                onChange={handleChange}
                className="input input-bordered w-full"
                placeholder="Frontend Engineer"
                disabled={isLoading}
              />
            </label>
          <label className="flex flex-col gap-2 text-sm text-secondary">
              Target location
              <input
                type="text"
                name="target_location"
                value={profile.target_location}
                onChange={handleChange}
                className="input input-bordered w-full"
                placeholder="Remote / Hybrid"
                disabled={isLoading}
              />
            </label>
            <div className="sm:col-span-2 flex justify-end gap-2">
              {hasProfile && (
                <button
                  type="button"
                  className="btn btn-ghost btn-sm"
                  onClick={() => setIsEditing(false)}
                  disabled={isSaving}
                >
                  Cancel
                </button>
              )}
              <button
                type="submit"
                className={`btn btn-primary btn-sm ${
                  isSaving ? "btn-disabled" : ""
                }`}
                disabled={isSaving || isLoading}
              >
                {isSaving ? "Saving..." : "Save Profile"}
              </button>
            </div>
          </form>
        ) : (
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="surface-2 p-4">
            <p className="text-sm text-secondary">Preferred role</p>
            <p className="text-base font-semibold text-primary">
              {profile.preferred_role || "Not set"}
            </p>
          </div>
          <div className="surface-2 p-4">
            <p className="text-sm text-secondary">Target location</p>
            <p className="text-base font-semibold text-primary">
              {profile.target_location || "Not set"}
            </p>
          </div>
            <div className="sm:col-span-2 flex justify-end">
              <button
                type="button"
                className="btn btn-outline btn-sm"
                onClick={() => setIsEditing(true)}
              >
                Edit Profile
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
