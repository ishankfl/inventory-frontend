import { Bar, Line } from "react-chartjs-2";
import { FaTags, FaBuilding, FaBox, FaUsers, FaChartBar, FaUps } from "react-icons/fa";
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

// Register required components
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

  if (loading)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-primary-light to-background-secondary">
        <div className="animate-pulse">
          <div className="bg-white p-8 rounded-2xl shadow-2xl">
            <svg
              className="animate-spin h-16 w-16 text-primary mb-6 mx-auto"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
              ></path>
            </svg>
            <p className="text-xl font-semibold text-text text-center">Loading Dashboard...</p>
          </div>
        </div>
      </div>
    );

  if (errorMsg)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-danger-light to-background-secondary px-4">
        <div className="bg-white border border-danger text-danger-dark px-8 py-10 rounded-2xl text-center shadow-2xl max-w-md w-full">
          <div className="flex justify-center mb-4">
            <svg
              className="w-16 h-16 text-danger"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 9v2m0 4h.01M4.93 4.93l14.14 14.14M12 3v1m0 16v1m8.485-8.485l-1.414-1.414M3 12H2m1.515-3.515l1.414 1.414M16.95 7.05l1.414-1.414"
              />
            </svg>
          </div>
          <h3 className="text-xl font-bold mb-3">Something went wrong</h3>
          <p className="mb-6 text-text-secondary break-words">{errorMsg}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-danger text-white px-6 py-3 rounded-lg hover:bg-danger-dark transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-danger focus:ring-opacity-50 font-medium"
          >
            Refresh Page
          </button>
        </div>
      </div>
    );

  if (!data) return null;

  const inventoryData = {
    labels: data.topProductsByQty.map((item) => item.name),
    datasets: [
      {
        label: "Inventory Quantity",
        data: data.topProductsByQty.map((item) => item.totalStockQuantity),
        backgroundColor: "rgba(59, 130, 246, 0.8)",
        borderColor: "rgba(59, 130, 246, 1)",
        borderWidth: 2,
        borderRadius: 8,
        borderSkipped: false,
      },
    ],
  };

  const issuedData = {
    labels: data.topIssuedItems.map((item) => item.name),
    datasets: [
      {
        label: "Issued Quantity",
        data: data.topIssuedItems.map((item) => item.totalIssuedQuantity),
        backgroundColor: "rgba(16, 185, 129, 0.8)",
        borderColor: "rgba(16, 185, 129, 1)",
        borderWidth: 2,
        borderRadius: 8,
        borderSkipped: false,
      },
    ],
  };

  const dailyReceiptData = {
    labels: data.dailyTotalReceiptValue.map((d) =>
      new Date(d.date).toLocaleDateString()
    ),
    datasets: [
      {
        label: "Daily Total Receipt Value",
        data: data.dailyTotalReceiptValue.map((d) => d.totalPrice),
        fill: true,
        borderColor: "rgba(245, 158, 11, 1)",
        backgroundColor: "rgba(245, 158, 11, 0.1)",
        tension: 0.4,
        borderWidth: 3,
        pointBackgroundColor: "rgba(245, 158, 11, 1)",
        pointBorderColor: "#ffffff",
        pointBorderWidth: 2,
        pointRadius: 6,
        pointHoverRadius: 8,
      },
    ],
  };

  const getChartOptions = (title, yLabel = "Quantity") => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { 
        position: "top", 
        labels: { 
          usePointStyle: true, 
          padding: 20,
          font: { size: 12, weight: '600' },
          color: '#1e293b'
        } 
      },
      title: {
        display: true,
        text: title,
        font: { weight: "bold", size: 16 },
        padding: { bottom: 30 },
        color: '#1e293b'
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        borderColor: '#3b82f6',
        borderWidth: 1,
        cornerRadius: 8,
        callbacks: {
          label: (context) =>
            `${context.dataset.label}: ${context.parsed.y ?? context.parsed}`,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: { 
          display: true, 
          text: yLabel,
          color: '#64748b',
          font: { weight: '600' }
        },
        ticks: { 
          precision: 0,
          color: '#64748b'
        },
        grid: { 
          color: "rgba(148, 163, 184, 0.2)",
          borderDash: [5, 5]
        },
      },
      x: { 
        grid: { display: false },
        ticks: { color: '#64748b' }
      },
    },
  });

  const { cardCounts } = data;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background-secondary via-primary-light to-background-tertiary">
      <div className="px-6 md:px-12 lg:px-24 py-8">
        {/* Header Section */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-text mb-4 bg-gradient-to-r from-primary to-primary-dark bg-clip-text text-transparent">
            Dashboard Analytics
          </h1>
          <p className="text-text-secondary text-lg max-w-2xl mx-auto">
            Get insights into your inventory management system with real-time analytics and key performance indicators.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <StatCard
            icon={<FaUsers className="text-4xl" />}
            title="Users"
            value={cardCounts.users ?? 0}
            bgClass="bg-gradient-to-br from-primary to-primary-dark"
            iconBg="bg-white/20"
          />
          <StatCard
            icon={<FaBox className="text-4xl" />}
            title="Products"
            value={cardCounts.products ?? 0}
            bgClass="bg-gradient-to-br from-accent to-accent-dark"
            iconBg="bg-white/20"
          />
          <StatCard
            icon={<FaBuilding className="text-4xl" />}
            title="Departments"
            value={cardCounts.departments ?? 0}
            bgClass="bg-gradient-to-br from-success to-success-dark"
            iconBg="bg-white/20"
          />
          <StatCard
            icon={<FaTags className="text-4xl" />}
            title="Categories"
            value={cardCounts.categories ?? 0}
            bgClass="bg-gradient-to-br from-secondary to-secondary-dark"
            iconBg="bg-white/20"
          />
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <ChartCard 
            title="Top 10 Items by Inventory Quantity" 
            icon={<FaChartBar className="text-primary" />}
          >
            <Bar
              data={inventoryData}
              options={getChartOptions("Top 10 Items by Inventory Quantity")}
            />
          </ChartCard>

          <ChartCard 
            title="Top 10 Issued Products" 
            icon={<FaChartBar className="text-success" />}
          >
            <Bar
              data={issuedData}
              options={getChartOptions("Top 10 Issued Products")}
            />
          </ChartCard>
        </div>

        {/* Full Width Chart */}
        <div className="mb-8">
          <ChartCard 
            title="Daily Total Receipt Value" 
            icon={<FaUps className="text-accent" />}
            isFullWidth
          >
            <Line
              data={dailyReceiptData}
              options={getChartOptions("Daily Total Receipt Value", "Amount")}
            />
          </ChartCard>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ icon, title, value, bgClass, iconBg }) => (
  <div className={`${bgClass} text-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group`}>
    <div className="flex items-center justify-between mb-4">
      <div className={`${iconBg} p-3 rounded-xl group-hover:scale-110 transition-transform duration-300`}>
        {icon}
      </div>
      <div className="text-right">
        <h3 className="text-sm font-medium opacity-90 uppercase tracking-wide">{title}</h3>
        <span className="text-3xl font-bold block mt-1">{value}</span>
      </div>
    </div>
    <div className="w-full bg-white/20 h-1 rounded-full">
      <div className="bg-white h-1 rounded-full w-3/4 group-hover:w-full transition-all duration-500"></div>
    </div>
  </div>
);

const ChartCard = ({ title, children, icon, isFullWidth = false }) => (
  <div className={`bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 ${isFullWidth ? 'col-span-full' : ''} border border-border`}>
    <div className="flex items-center gap-3 mb-6">
      {icon}
      <h3 className="text-xl font-bold text-text">{title}</h3>
    </div>
    <div className="h-96">
      {children}
    </div>
  </div>
);

export default Dashboard;