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
      toastSuccess("Profile updated.");
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
    <div className="space-y-6 lg:space-y-8">
      <div className="page-header">
        <div>
          <h1 className="page-title">Profile</h1>
          <p className="page-subtitle">
            Keep your account details and job search preferences updated so the
            app reflects how you are applying right now.
          </p>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(280px,0.8fr)_minmax(0,1.2fr)]">
        <section className="surface p-5 sm:p-6">
          <h2 className="section-heading">Account Snapshot</h2>
          <div className="mt-5 info-grid">
            <div className="info-card">
              <p className="info-label">Full name</p>
              <p className="info-value">{fullName || "Add your name"}</p>
            </div>
            <div className="info-card">
              <p className="info-label">Email</p>
              <p className="info-value break-all">
                {user?.email || "you@example.com"}
              </p>
            </div>
          </div>
        </section>

        <section className="surface p-5 sm:p-6 lg:p-7">
          <div className="page-header gap-4">
            <div>
              <h2 className="section-heading">Search Preferences</h2>
              <p className="page-subtitle mt-2">
                Save the role and location details you want to optimize around.
              </p>
            </div>
            {!isEditing && (
              <button
                type="button"
                className="btn btn-outline btn-sm"
                onClick={() => setIsEditing(true)}
              >
                Edit Profile
              </button>
            )}
          </div>

          {isLoading ? (
            <div className="mt-6 flex items-center gap-2 text-sm text-secondary">
              <span className="loading loading-spinner loading-sm" />
              Loading profile...
            </div>
          ) : isEditing ? (
            <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
              <div className="grid gap-4 sm:grid-cols-2">
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
              </div>

              <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                {hasProfile && (
                  <button
                    type="button"
                    className="btn btn-ghost"
                    onClick={() => setIsEditing(false)}
                    disabled={isSaving}
                  >
                    Cancel
                  </button>
                )}
                <button
                  type="submit"
                  className={`btn btn-primary ${isSaving ? "btn-disabled" : ""}`}
                  disabled={isSaving || isLoading}
                >
                  {isSaving ? "Saving..." : "Save Profile"}
                </button>
              </div>
            </form>
          ) : (
            <div className="mt-6 info-grid sm:grid-cols-2">
              <div className="info-card">
                <p className="info-label">Preferred role</p>
                <p className="info-value">
                  {profile.preferred_role || "Not set"}
                </p>
              </div>
              <div className="info-card">
                <p className="info-label">Target location</p>
                <p className="info-value">
                  {profile.target_location || "Not set"}
                </p>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default Profile;
