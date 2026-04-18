import AdminLayout from "@/components/adminDashboard/AdminLayout";
import { useAuth } from "@/context/AuthContext";
import jwt from "jsonwebtoken";
import { parse } from "cookie";

export default function AdminRevenue({ admin }) {
  const { logout } = useAuth();

  return (
    <AdminLayout adminName={admin?.name} onLogout={logout}>
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-bold text-slate-900">Revenue</h1>
        <p className="mt-2 text-sm text-slate-600">
          Ready for backend integration: revenue metrics, transaction trends,
          and export tools.
        </p>
      </section>
    </AdminLayout>
  );
}

export async function getServerSideProps(context) {
  const { req } = context;
  const cookie = parse(req.headers.cookie || "");
  const token = cookie["x-auth-token"];

  if (!token) {
    return {
      redirect: {
        destination: "/auth/auth",
        permanent: false,
      },
    };
  }

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET);

    if (user.role !== "admin") {
      return {
        redirect: {
          destination: "/",
          permanent: false,
        },
      };
    }
    return {
      props: {
        admin: user,
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
