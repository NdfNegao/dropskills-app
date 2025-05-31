import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default function AdminDashboard() {
  const adminCookie = cookies().get("admin");
  if (!adminCookie || adminCookie.value !== "ok") {
    redirect("/admin/login");
  }
  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <div>
        <h1 className="text-3xl font-bold mb-4">Bienvenue sur le dashboard admin !</h1>
        <p>Tu as accès à toutes les fonctionnalités réservées.</p>
      </div>
    </div>
  );
} 