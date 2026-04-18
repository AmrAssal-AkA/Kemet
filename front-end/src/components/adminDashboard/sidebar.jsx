import Link from "next/link";
import { useRouter } from "next/router";
import {
  FaChartPie,
  FaClipboardList,
  FaMapMarkedAlt,
  FaPenNib,
  FaUsers,
  FaMoneyBillWave,
  FaQuestionCircle,
  FaSignOutAlt,
  FaArrowUp,
} from "react-icons/fa";

const menuItems = [
  { label: "Overview", href: "/admin", icon: FaChartPie },
  { label: "Bookings", href: "/admin/bookings", icon: FaClipboardList },
  { label: "Destinations", href: "/admin/destinations", icon: FaMapMarkedAlt },
  { label: "Editorial", href: "/admin/editorial", icon: FaPenNib },
  { label: "Users", href: "/admin/users", icon: FaUsers },
  { label: "Revenue", href: "/admin/revenue", icon: FaMoneyBillWave },
];

function SidebarItem({ item, isActive }) {
  const Icon = item.icon;

  return (
    <Link
      href={item.href}
      className={`flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition ${
        isActive
          ? "bg-amber-50 text-amber-700"
          : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
      }`}
    >
      <Icon className="text-sm" />
      <span>{item.label}</span>
    </Link>
  );
}

export default function Sidebar({ adminName = "Admin User", onLogout }) {
  const router = useRouter();

  return (
    <aside className="hidden w-72 shrink-0 border-r border-slate-200 bg-white p-6 lg:flex lg:flex-col">
      <div>
        <div className="mb-8 flex items-center gap-3">
          <div className="grid h-9 w-9 place-items-center rounded-full bg-amber-400 font-bold text-slate-900">
            K
          </div>
          <div>
            <p className="text-sm text-slate-400">The</p>
            <p className="text-base font-bold text-slate-900">Kemet Admin</p>
          </div>
        </div>

        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
          Main Menu
        </p>
        <nav className="space-y-1">
          {menuItems.map((item) => {
            const isActive = router.pathname === item.href;
            return <SidebarItem key={item.label} item={item} isActive={isActive} />;
          })}
        </nav>
      </div>

      <div className="mt-auto">
        <div className="rounded-2xl border border-slate-200 p-4">
          <p className="text-xs uppercase tracking-[0.12em] text-slate-400">Admin</p>
          <p className="mt-1 text-sm font-semibold text-slate-900">{adminName}</p>
          <p className="text-xs text-slate-500">Manage the Kemet platform</p>
        </div>

       

        <div className="mt-4 space-y-1">
          <button
            type="button"
            className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
          >
            <FaQuestionCircle />
            Help Center
          </button>
          <button
            type="button"
            onClick={onLogout}
            className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm text-rose-600 transition hover:bg-rose-50"
          >
            <FaSignOutAlt />
            Log out
          </button>
        </div>
      </div>
    </aside>
  );
}
