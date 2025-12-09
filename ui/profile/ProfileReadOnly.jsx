export default function ProfileReadOnly({ user }) {
  return (
    <div className="bg-gray-600 rounded-xl p-6 shadow-sm">
      <h2 className="text-xl font-semibold mb-4">Profile Overview</h2>
      <p><strong>Name:</strong> {user.firstName} {user.lastName}</p>
      <p><strong>Email:</strong> {user.email}</p>
      <p><strong>Phone:</strong> {user.phone}</p>
      <p><strong>Role:</strong> {user.role}</p>
      <p><strong>Bio:</strong> {user.bio || "N/A"}</p>
      <p><strong>Address:</strong> {user.address || "N/A"}</p>
      <p><strong>Business Name:</strong> {user.businessName || "N/A"}</p>
    </div>
  );
}
