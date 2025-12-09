"use client";
import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import axios from "@/lib/axiosInstance";

import AvatarUploader from "@/ui/profile/AvatarUploader";
import PersonalInfoForm from "@/ui/profile/PersonalInfoForm";
import PasswordChangeForm from "@/ui/profile/PasswordChangeForm";
import ProfileActions from "@/ui/profile/ProfileActions";
import ProfileReadOnly from "@/ui/profile/ProfileReadOnly"; // ← ADD THIS

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [passwords, setPasswords] = useState({ current: "", new: "", confirm: "" });
  const [file, setFile] = useState(null);

  const canEdit = userData?.role !== "admin";

  useEffect(() => {
    if (status === "authenticated") loadUser();
    else if (status === "unauthenticated") router.push("/login");
  }, [status]);

  const loadUser = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/users/me");
      setUserData(res.data);
    } catch (err) {
      setError("Failed to load user data");
    } finally {
      setLoading(false);
    }
  };

  const handleFieldChange = (name, value) =>
    setUserData(prev => ({ ...prev, [name]: value }));

  const handlePasswordChange = (name, value) =>
    setPasswords(prev => ({ ...prev, [name]: value }));

  const handleFileSelect = (file) => setFile(file);

  const handleSave = async () => {
    setSaving(true);
    setError("");

    try {
      let avatarUrl = userData.profilePic || "";

      if (file) {
        const formData = new FormData();
        formData.append("image", file);
        const uploadRes = await axios.post("/profile/pic", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        avatarUrl = uploadRes.data.url;
      }

      await axios.put("/users/me", { ...userData, profilePic: avatarUrl });

      // handle password change
      if (passwords.current && passwords.new) {
        if (passwords.new !== passwords.confirm) {
          setError("New passwords do not match");
          setSaving(false);
          return;
        }
        await axios.put("/users/me/password", {
          currentPassword: passwords.current,
          newPassword: passwords.new,
        });
      }

      // success message
      alert("Profile updated successfully");

      // reset
      setPasswords({ current: "", new: "", confirm: "" });
      setFile(null);

      // 🚨 ROLE-BASED REDIRECT AFTER SAVE
    if (updatedUser.role === "seller") {
      router.push("/sellers/dashboard");
    } else {
      router.push("/");
    }
    } catch (err) {
      console.error(err);
      setError("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete your account? This cannot be undone.")) return;

    try {
      await axios.delete("/users/me");
      alert("Account deleted");
      signOut({ callbackUrl: "/" });
    } catch {
      alert("Failed to delete account");
    }
  };

  if (loading || status === "loading")
    return <p className="text-center mt-20 text-gray-500">Loading...</p>;

  if (!userData)
    return <p className="text-center mt-20 text-gray-500">No user data found</p>;

  return (
    <main className="max-w-5xl mx-auto px-4 py-10 space-y-8">
      <h1 className="text-3xl font-bold">My Profile</h1>

      {/* READ ONLY SECTION */}
      <ProfileReadOnly user={userData} />

      <div className="bg-white shadow-xl rounded-2xl p-8 space-y-8">
        {error && <p className="text-red-600 font-medium">{error}</p>}

        <div className="flex flex-col md:flex-row md:space-x-8 space-y-6 md:space-y-0">
          <AvatarUploader
            canEdit={canEdit}
            currentAvatar={userData.profilePic}
            onFileSelect={handleFileSelect}
          />

          <div className="flex-1">
            <PersonalInfoForm
              userData={userData}
              canEdit={canEdit}
              onChange={handleFieldChange}
            />
          </div>
        </div>

        {canEdit && (
          <PasswordChangeForm passwords={passwords} onChange={handlePasswordChange} />
        )}

        <ProfileActions
          canEdit={canEdit}
          saving={saving}
          onSave={handleSave}
          onDelete={handleDelete}
        />
      </div>
    </main>
  );
}
