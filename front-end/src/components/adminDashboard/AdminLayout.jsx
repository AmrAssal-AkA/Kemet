import Sidebar from "./sidebar";
import AdminNavBar from "./navbar";

export default function AdminLayout({ children, adminName, onLogout }) {
  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <div className="mx-auto flex max-w-350">
        <Sidebar adminName={adminName} onLogout={onLogout} />
        <div className="flex min-h-screen flex-1 flex-col">
          <AdminNavBar />
          <main className="flex-1 p-4 sm:p-6">{children}</main>
        </div>
      </div>
    </div>
  );
}
