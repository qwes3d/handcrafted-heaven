// app/admin/page.jsx
import { auth } from "@/lib/authconfig";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function AdminPage() {
  const session = await auth();
  if (!session || session.user.role !== "admin") {
    redirect("/admin/login");
  }


  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>

      <div className="mb-4">
        <Link href="/admin/adminproduct">
          <button className="bg-blue-600 text-white px-4 py-2 rounded">
            Admin Products
          </button>
        </Link>
      </div>

      <div className="mb-4">
        <Link href="/admin/adminseller">
          <button className="bg-green-600 text-white px-4 py-2 rounded">
            Admin Sellers
          </button>
        </Link>
      </div>
    </div>
  );
}
