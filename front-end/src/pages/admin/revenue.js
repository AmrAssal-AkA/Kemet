import AdminLayout from "@/components/adminDashboard/AdminLayout";
import { useAuth } from "@/context/AuthContext";

export default function AdminRevenue({ admin }) {
  const { logout } = useAuth();

  return (
    <AdminLayout adminName={admin?.name} onLogout={logout}>
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-bold text-slate-900">Revenue</h1>
        <p className="mt-2 text-sm text-slate-600">
          Ready for backend integration: revenue metrics, transaction trends, and export tools.
        </p>
      </section>
    </AdminLayout>
  );
}

export async function getServerSideProps(context) {
  const cookie = context.req.headers.cookie || "";

  if (!cookie || !cookie.includes("x-auth-token")) {
    return {
      redirect: {
        destination: "/auth/auth",
        permanent: false,
      },
    };
  }

  try {
    const response = await fetch("http://localhost:8000/api/auth/refresh", {
      method: "POST",
      headers: {
        Cookie: cookie,
      },
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Session verification failed");
    }

    const data = await response.json();

    return {
      props: {
        admin: data.user,
      },
    };
  } catch (error) {
    console.error("Admin verification error:", error.message);
    return {
      redirect: {
        destination: "/auth/auth",
        permanent: false,
      },
    };
  }
}
