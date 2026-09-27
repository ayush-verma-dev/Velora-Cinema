import { useEffect, useState } from "react";
import {
  FaRupeeSign,
  FaTicketAlt,
  FaFilm,
  FaUsers,
} from "react-icons/fa";
import API from "../services/api";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

function Dashboard() {
  const [stats, setStats] = useState({
    revenue: 0,
    bookings: 0,
    movies: 0,
    users: 0,
  });

  const [chartData, setChartData] = useState([]);
  const [recentBookings, setRecentBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  async function fetchStats() {
    try {
      const { data } = await API.get("/admin/dashboard");

      setStats(data.stats || {});
      setChartData(data.chartData || []);
      setRecentBookings(data.recentBookings || []);
    } catch (error) {
      console.error("Dashboard Error:", error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  }

  const cards = [
    {
      title: "Revenue",
      value: `₹${stats.revenue?.toLocaleString("en-IN") || 0}`,
      icon: <FaRupeeSign />,
    },
    {
      title: "Bookings",
      value: stats.bookings || 0,
      icon: <FaTicketAlt />,
    },
    {
      title: "Movies",
      value: stats.movies || 0,
      icon: <FaFilm />,
    },
    {
      title: "Users",
      value: stats.users || 0,
      icon: <FaUsers />,
    },
  ];

  if (loading) {
    return (
      <div className="flex h-[80vh] items-center justify-center text-white">
        <h2 className="text-2xl font-semibold">Loading Dashboard...</h2>
      </div>
    );
  }

  return (
    <div>
      {/* Heading */}
      <h1 className="mb-8 text-4xl font-bold">Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <div
            key={card.title}
            className="rounded-3xl border border-white/10 bg-[#151A26] p-6 shadow-lg transition hover:border-yellow-400/40 hover:shadow-yellow-400/5"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400">{card.title}</p>
                <h2 className="mt-2 text-3xl font-bold">{card.value}</h2>
              </div>

              <div className="rounded-2xl bg-yellow-400/10 p-4 text-2xl text-yellow-400">
                {card.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Revenue Chart */}
      <div className="mt-10 rounded-3xl border border-white/10 bg-[#151A26] p-8">
        <h2 className="mb-6 text-2xl font-bold">Revenue Overview</h2>

        <div className="h-72 rounded-2xl border border-dashed border-yellow-400/30 p-4">
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <XAxis dataKey="date" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip
                  contentStyle={{
                    background: "#111827",
                    border: "1px solid #FACC15",
                    borderRadius: "12px",
                    color: "white",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#FACC15"
                  strokeWidth={4}
                  dot={{ r: 5 }}
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex h-full items-center justify-center text-gray-500">
              No revenue data available yet.
            </div>
          )}
        </div>
      </div>

      {/* Recent Bookings */}
      <div className="mt-10 rounded-3xl border border-white/10 bg-[#151A26] p-8">
        <h2 className="mb-6 text-2xl font-bold">Recent Bookings</h2>

        {recentBookings.length === 0 ? (
          <div className="flex h-40 items-center justify-center rounded-2xl border border-dashed border-yellow-400/30 text-gray-500">
            No recent bookings found.
          </div>
        ) : (
          <div className="space-y-4">
            {recentBookings.map((booking) => (
              <div
                key={booking.id}
                className="flex flex-col justify-between gap-4 rounded-xl border border-white/10 bg-[#111827] p-5 transition hover:border-yellow-400/40 md:flex-row md:items-center"
              >
                <div>
                  <p className="text-lg font-semibold text-white">
                    {booking.movie}
                  </p>
                  <p className="mt-1 text-sm text-gray-400">
                    Seats: {booking.seats}
                  </p>
                </div>

                <div className="text-right">
                  <p className="font-semibold text-yellow-400">
                    {booking.id}
                  </p>
                  <p className="mt-1 text-xl font-bold text-white">
                    ₹{booking.amount}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;