import {
  FaChartPie,
  FaClipboardList,
  FaMoneyBillWave,
  FaPenNib,
  FaRoute,
  FaUsers,
} from "react-icons/fa";

export const adminDashboardMenuItems = [
  { label: "Overview", href: "/admin", icon: FaChartPie },
  { label: "Bookings", href: "/admin/bookings", icon: FaClipboardList },
  { label: "Trips", href: "/admin/trips", icon: FaRoute },
  { label: "Editorial", href: "/admin/editorial", icon: FaPenNib },
  { label: "Users", href: "/admin/users", icon: FaUsers },
  { label: "Revenue", href: "/admin/revenue", icon: FaMoneyBillWave },
];

export const userDashboardMenuItems = [
  { key: "overview", label: "Overview", href: "/user-dashboard?tab=overview", icon: "\u2b21" },
  { key: "trips", label: "My Trips", href: "/user-dashboard?tab=trips", icon: "\ud83d\uddfa\ufe0f" },
  { key: "liked", label: "Liked Articles", href: "/user-dashboard?tab=liked", icon: "\u2665" },
  { key: "settings", label: "Settings", href: "/user-dashboard?tab=settings", icon: "\u2699" },
];
