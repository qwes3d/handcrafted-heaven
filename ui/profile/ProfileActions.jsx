"use client";

export default function ProfileActions({ canEdit, saving, onSave, onDelete }) {
  if (!canEdit) return <p className="text-gray-500 mt-2">Admin users cannot edit or delete their accounts here.</p>;

  return (
    <div className="flex gap-4 mt-4">
      <button
        onClick={onSave}
        disabled={saving}
        className="bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700 transition disabled:opacity-50"
      >
        {saving ? "Saving…" : "Update Profile"}
      </button>
      <button
        onClick={onDelete}
        className="bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700 transition"
      >
        Delete Account
      </button>
    </div>
  );
}
