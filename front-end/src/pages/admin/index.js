import AdminLayout from "@/components/adminDashboard/AdminLayout";
import { useAuth } from "@/context/AuthContext";

const statCards = [
  {
    title: "Total Bookings",
    value: "4,821",
    growth: "+8%",
    bars: ["h-4", "h-6", "h-5", "h-8", "h-10"],
    color: "bg-emerald-400",
  },
  {
    title: "Revenue",
    value: "$124.5k",
    growth: "+12%",
    bars: ["h-3", "h-5", "h-7", "h-6", "h-9"],
    color: "bg-amber-400",
  },
  {
    title: "Active Users",
    value: "18.2k",
    growth: "Last 30d",
    avatars: ["JC", "EG", "MR"],
  },
];

const trendBars = [5, 7, 6, 10, 12, 9, 13, 11, 8, 12];

const bookings = [
  {
    customer: "Julian Casablancas",
    destination: "Amalfi Coast, IT",
    date: "Oct 12, 2024",
    status: "Confirmed",
  },
  {
    customer: "Elena Gilbert",
    destination: "Kyoto Temples, JP",
    date: "Oct 14, 2024",
    status: "Pending",
  },
  {
    customer: "Mark Ronson",
    destination: "Serengeti Safari, TZ",
    date: "Oct 15, 2024",
    status: "Confirmed",
  },
];

const articles = [
  {
    title: "The Hidden Courtyards of Marrakech",
    reads: "14.2k views",
  },
  {
    title: "Vietnam’s Northern Highlands: A Journey",
    reads: "9.8k views",
  },
  {
    title: "Beyond Santorini: The Quiet Cyclades",
    reads: "22.1k views",
  },
];

function StatCard({ card }) {
  return (
    <article className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
            {card.title}
          </p>
          <p className="mt-2 text-4xl font-bold text-slate-900">{card.value}</p>
        </div>
        <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-600">
          {card.growth}
        </span>
      </div>

      {card.avatars ? (
        <div className="mt-6 flex items-center">
          <div className="flex -space-x-2">
            {card.avatars.map((avatar) => (
              <span
                key={avatar}
                className="grid h-8 w-8 place-items-center rounded-full border-2 border-white bg-slate-200 text-xs font-semibold text-slate-700"
              >
                {avatar}
              </span>
            ))}
          </div>
          <span className="ml-3 text-xs text-slate-500">+12%</span>
        </div>
      ) : (
        <div className="mt-6 flex items-end gap-2">
          {card.bars.map((height, index) => (
            <span
              key={`${card.title}-${index}`}
              className={`w-8 rounded-md ${height} ${card.color} opacity-${index === 4 ? "100" : "50"}`}
            />
          ))}
        </div>
      )}
    </article>
  );
}

function BookingStatus({ status }) {
  const isConfirmed = status === "Confirmed";

  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-semibold ${
        isConfirmed ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"
      }`}
    >
      {status}
    </span>
  );
}

export default function AdminDashboard() {
  const {user: admin ,logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <AdminLayout adminName={admin?.name} onLogout={handleLogout}>
      <section className="rounded-3xl bg-[#0b1d3a] p-8 text-white shadow-sm">
        <h1 className="text-4xl font-bold">Welcome back, {admin?.name || "Admin"}</h1>
        <p className="mt-3 max-w-2xl text-slate-200">
          Your platform saw a <span className="font-semibold text-amber-300">+14.2%</span>{" "}
          increase in global explorer engagement this week.
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <div className="rounded-2xl bg-white/10 px-5 py-3">
            <p className="text-xs uppercase tracking-[0.14em] text-slate-300">Live users</p>
            <p className="mt-1 text-3xl font-bold">1,284</p>
          </div>
          <div className="rounded-2xl bg-white/10 px-5 py-3">
            <p className="text-xs uppercase tracking-[0.14em] text-slate-300">Pending inquiries</p>
            <p className="mt-1 text-3xl font-bold">28</p>
          </div>
        </div>
      </section>

      <section className="mt-6 grid grid-cols-1 gap-4 xl:grid-cols-3">
        {statCards.map((card) => (
          <StatCard key={card.title} card={card} />
        ))}
      </section>

      <section className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Engagement Trends</h2>
            <p className="text-sm text-slate-500">Explorer activity across all channels</p>
          </div>
          <div className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-500">30d</div>
        </div>

        <div className="mt-8 flex h-60 items-end gap-3 overflow-hidden">
          {trendBars.map((value, index) => (
            <span
              key={`trend-${index}`}
              className="flex-1 rounded-t-full bg-gradient-to-t from-amber-200 to-amber-400"
              style={{ height: `${value * 7}%` }}
            />
          ))}
        </div>
      </section>

      <section className="mt-6 grid grid-cols-1 gap-4 xl:grid-cols-3">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm xl:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-xl font-bold text-slate-900">Recent Bookings</h3>
            <button type="button" className="text-sm font-semibold text-amber-600">
              View All
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px]">
              <thead>
                <tr className="border-b border-slate-100 text-left text-xs uppercase tracking-[0.14em] text-slate-400">
                  <th className="pb-3">Customer</th>
                  <th className="pb-3">Destination</th>
                  <th className="pb-3">Date</th>
                  <th className="pb-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((booking) => (
                  <tr key={`${booking.customer}-${booking.date}`} className="border-b border-slate-100">
                    <td className="py-4 pr-3 font-semibold text-slate-800">{booking.customer}</td>
                    <td className="py-4 pr-3 text-slate-600">{booking.destination}</td>
                    <td className="py-4 pr-3 text-slate-600">{booking.date}</td>
                    <td className="py-4">
                      <BookingStatus status={booking.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <aside className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-xl font-bold text-slate-900">Latest Articles</h3>
          <div className="mt-4 space-y-4">
            {articles.map((article) => (
              <article key={article.title} className="rounded-2xl bg-slate-50 p-3">
                <h4 className="text-sm font-semibold text-slate-800">{article.title}</h4>
                <p className="mt-1 text-xs text-slate-500">{article.reads}</p>
              </article>
            ))}
          </div>
        </aside>
      </section>

      <footer className="mt-6 rounded-3xl bg-[#0b1d3a] p-6 text-slate-300">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <div>
            <p className="text-lg font-bold text-white">The Radiant Explorer</p>
            <p className="mt-2 text-sm">Defining the next generation of luxury travel.</p>
          </div>
          <div>
            <p className="font-semibold text-amber-300">Platform</p>
            <p className="mt-2 text-sm">Analytics Engine</p>
            <p className="text-sm">Editorial Suite</p>
          </div>
          <div>
            <p className="font-semibold text-amber-300">Legal</p>
            <p className="mt-2 text-sm">Privacy Policy</p>
            <p className="text-sm">Terms of Service</p>
          </div>
          <div>
            <p className="font-semibold text-amber-300">Contact</p>
            <p className="mt-2 text-sm">concierge@radiantexplorer.com</p>
          </div>
        </div>
      </footer>
    </AdminLayout>
  );
}

export async function getServerSideProps(context) {
  const { req } = context;
  const cookie = req.headers.cookie || "";

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
        admin: data.user && data.user.role === "admin",
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
