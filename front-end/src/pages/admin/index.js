import { useAuth } from "@/context/AuthContext";

export default function AdminDashboard({ admin }) {
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4">Welcome, {admin.name}</h1>
        <p className="mb-6">This is the admin dashboard.</p>
        <button
          onClick={handleLogout}
          className="w-full bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition duration-200"
        >
          Logout
        </button>
      </div>
    </main>
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

    if (data.user?.role !== "admin") {
      return {
        redirect: {
          destination: "/auth/auth",
          permanent: false,
        },
      };
    }

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
