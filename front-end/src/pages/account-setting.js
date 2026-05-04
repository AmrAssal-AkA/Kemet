import { useAuth } from "@/context/AuthContext";

export default function AccountSettingPage() {
  const { user } = useAuth();

  return (
    <main className="min-h-screen bg-[#f8fafc] px-4 py-10">
      <section className="mx-auto max-w-3xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <h1 className="text-2xl font-bold text-slate-900">Account Setting</h1>
        <p className="mt-2 text-sm text-slate-600">
          Manage your profile information and account preferences.
        </p>

        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="rounded-xl bg-slate-50 p-4">
            <p className="text-xs uppercase tracking-[0.12em] text-slate-500">Name</p>
            <p className="mt-1 font-semibold text-slate-900">{user?.name || "Not available"}</p>
          </div>
          <div className="rounded-xl bg-slate-50 p-4">
            <p className="text-xs uppercase tracking-[0.12em] text-slate-500">Email</p>
            <p className="mt-1 font-semibold text-slate-900">{user?.email || "Not available"}</p>
          </div>
          <div className="rounded-xl bg-slate-50 p-4 sm:col-span-2">
            <p className="text-xs uppercase tracking-[0.12em] text-slate-500">Role</p>
            <p className="mt-1 font-semibold text-slate-900">{user?.role || "Not available"}</p>
          </div>
        </div>
      </section>
    </main>
  );
}
