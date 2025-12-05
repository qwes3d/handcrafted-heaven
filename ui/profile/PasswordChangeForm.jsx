"use client";

export default function PasswordChangeForm({ passwords, onChange }) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    onChange(name, value);
  };

  return (
    <div className="space-y-2 mt-4">
      <h2 className="text-lg font-semibold text-gray-700">Change Password</h2>
      <input
        type="password"
        name="current"
        placeholder="Current Password"
        value={passwords.current}
        onChange={handleChange}
        className="w-full border px-3 py-2 rounded text-base font-semibold text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />
      <input
        type="password"
        name="new"
        placeholder="New Password"
        value={passwords.new}
        onChange={handleChange}
        className="w-full border px-3 py-2 rounded text-base font-semibold text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />
      <input
        type="password"
        name="confirm"
        placeholder="Confirm New Password"
        value={passwords.confirm}
        onChange={handleChange}
        className="w-full border px-3 py-2 rounded text-base font-semibold text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />
    </div>
  );
}
