import Sidebar from "./sidebar";
import AdminNavBar from "./navbar";

export default function AdminLayout({ children, adminName, onLogout }) {
  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <div className="mx-auto flex min-h-screen w-full max-w-350">
        <Sidebar adminName={adminName} onLogout={onLogout} />
        <div className="flex min-h-screen min-w-0 flex-1 flex-col">
          <AdminNavBar />
          <main className="min-w-0 flex-1 p-3 sm:p-6">{children}</main>
        </div>
      </div>
    </div>
  );
}
