import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getDashboardStats } from "../store/slices/adminStatsSlice.js";
import StatsCard from "../components/dashboard/StatsCard.jsx";
import RecentOrders from "../components/dashboard/RecentOrders.jsx";
import RevenueChart from "../components/dashboard/RevenueChart.jsx";
import TopProducts from "../components/dashboard/TopProducts.jsx";
import { DollarSign, ShoppingBag, Users, Package } from "lucide-react";

const DashboardPage = () => {
  const dispatch = useDispatch();
  const { stats, isLoading } = useSelector((state) => state.adminStats);

  useEffect(() => {
    dispatch(getDashboardStats());
  }, [dispatch]);

  const statsData = [
    {
      title: "Total Revenue",
      value: `$${stats?.totalRevenue?.toFixed(2) || "0.00"}`,
      icon: DollarSign,
      color: "bg-blue-500",
    },
    {
      title: "Total Orders",
      value: stats?.totalOrders || 0,
      icon: ShoppingBag,
      color: "bg-green-500",
    },
    {
      title: "Total Products",
      value: stats?.totalProducts || 0,
      icon: Package,
      color: "bg-purple-500",
    },
    {
      title: "Total Users",
      value: stats?.totalUsers || 0,
      icon: Users,
      color: "bg-orange-500",
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-gray-500 mt-1">Overview of your store performance</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statsData.map((stat, index) => (
          <StatsCard key={index} {...stat} isLoading={isLoading} />
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <RevenueChart data={stats?.dailySales || []} isLoading={isLoading} />
        <TopProducts
          products={stats?.topProducts || []}
          isLoading={isLoading}
        />
      </div>

      {/* Recent Orders */}
      <RecentOrders orders={stats?.recentOrders || []} isLoading={isLoading} />
    </div>
  );
};

export default DashboardPage;
