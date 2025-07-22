import React from "react";
import { Bar, Line } from "react-chartjs-2";
import { useDashboard } from "../../context/DashboardContext";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

import {
  FaTags,
  FaBuilding,
  FaBox,
  FaUsers,
  FaChartBar,
  FaUps,
} from "react-icons/fa";

// Register Chart.js modules
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const { dashboardData: data, loading, errorMsg } = useDashboard();

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="text-center">
          <div className="animate-spin text-primary mb-4">
            <svg
              className="h-10 w-10"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
              />
            </svg>
          </div>
          <p className="text-gray-600 text-lg font-medium">Loading Dashboard...</p>
        </div>
      </div>
    );
  }

  if (errorMsg) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="bg-white shadow-lg border border-red-300 p-6 rounded-lg text-center">
          <h2 className="text-lg font-bold text-red-600 mb-2">Error Loading Dashboard</h2>
          <p className="text-gray-600 mb-4">{errorMsg}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!data) return null;

  // Chart datasets
  const inventoryData = {
    labels: data.topProductsByQty?.map((item) => item.name),
    datasets: [
      {
        label: "Stock Quantity",
        data: data.topProductsByQty?.map((item) => item.totalStockQuantity),
        backgroundColor: "rgba(59, 130, 246, 0.8)",
        borderRadius: 6,
      },
    ],
  };

  const issuedData = {
    labels: data.topIssuedItems?.map((item) => item.name),
    datasets: [
      {
        label: "Issued Quantity",
        data: data.topIssuedItems?.map((item) => item.totalIssuedQuantity),
        backgroundColor: "rgba(16, 185, 129, 0.8)",
        borderRadius: 6,
      },
    ],
  };

  const dailyReceiptData = {
    labels: data.dailyTotalReceiptValue?.map((d) =>
      new Date(d.date).toLocaleDateString()
    ),
    datasets: [
      {
        label: "Daily Total Receipt",
        data: data.dailyTotalReceiptValue?.map((d) => d.totalPrice),
        fill: true,
        borderColor: "#f59e0b",
        backgroundColor: "rgba(245, 158, 11, 0.1)",
        tension: 0.4,
        borderWidth: 3,
        pointBackgroundColor: "#f59e0b",
        pointBorderColor: "#fff",
        pointBorderWidth: 2,
        pointRadius: 5,
      },
    ],
  };

  const chartOptions = (title = "", yLabel = "Qty") => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        labels: {
          color: "#1e293b",
          font: { size: 12 },
        },
      },
      title: {
        display: !!title,
        text: title,
        color: "#1e293b",
        font: { size: 16, weight: "bold" },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { color: "#64748b" },
        title: {
          display: true,
          text: yLabel,
          color: "#64748b",
        },
      },
      x: {
        ticks: { color: "#64748b" },
      },
    },
  });

  const { cardCounts } = data;

  return (
    <div className="min-h-screen p-6 sm:p-6 lg:p-10">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-primary">Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">Inventory Analytics Overview</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        <StatCard icon={<FaUsers />} label="Users" value={cardCounts?.users} />
        <StatCard icon={<FaBox />} label="Products" value={cardCounts?.products} />
        <StatCard icon={<FaBuilding />} label="Departments" value={cardCounts?.departments} />
        <StatCard icon={<FaTags />} label="Categories" value={cardCounts?.categories} />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <ChartCard title="Top 10 by Inventory">
          <Bar data={inventoryData} options={chartOptions("Top 10 Items by Quantity")} />
        </ChartCard>

        <ChartCard title="Top 10 Issued Products">
          <Bar data={issuedData} options={chartOptions("Top 10 Issued Items")} />
        </ChartCard>
      </div>

      <div className="mt-6">
        <ChartCard title="Daily Receipt Value (Last 30 Days)">
          <Line data={dailyReceiptData} options={chartOptions("Receipt Trend", "Amount")} />
        </ChartCard>
      </div>
    </div>
  );
};

const StatCard = ({ icon, label, value }) => (
  <div className="bg-white shadow rounded-lg p-4 flex items-center gap-4 lg:p-8 ">
    <div className="text-4xl text-primary ">{icon}</div>
    <div>
      <p className="text-gray-500 text-sm ">{label}</p>
      <p className="text-lg font-semibold text-gray-800">{value ?? 0}</p>
    </div>
  </div>
);

const ChartCard = ({ title, children }) => (
  <div className="bg-white shadow rounded-lg p-4">
    <h3 className="text-md font-semibold text-gray-700 mb-3">{title}</h3>
    <div className="h-80">{children}</div>
  </div>
);

export default Dashboard;
