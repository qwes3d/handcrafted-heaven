"use client";

export default function PersonalInfoForm({ userData, canEdit, onChange }) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    onChange(name, value);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label className="block font-medium text-gray-700 mb-1">First Name</label>
        <input
          name="firstName"
          value={userData.firstName || ""}
          onChange={handleChange}
          disabled={!canEdit}
          className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-100"
        />
      </div>
      <div>
        <label className="block font-medium text-gray-700 mb-1">Last Name</label>
        <input
          name="lastName"
          value={userData.lastName || ""}
          onChange={handleChange}
          disabled={!canEdit}
          className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-100"
        />
      </div>
      <div className="md:col-span-2">
        <label className="block font-medium text-gray-700 mb-1">Email</label>
        <input
          name="email"
          type="email"
          value={userData.email || ""}
          onChange={handleChange}
          disabled={!canEdit}
          className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-100"
        />
      </div>
      <div className="md:col-span-2">
        <label className="block font-medium text-gray-700 mb-1">Phone</label>
        <input
          name="phone"
          value={userData.phone || ""}
          onChange={handleChange}
          disabled={!canEdit}
          className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-100"
        />
      </div>
    </div>
  );
}
