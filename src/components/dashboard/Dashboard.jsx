import { Bar, Line } from "react-chartjs-2";
import { FaTags, FaBuilding, FaBox, FaUsers } from "react-icons/fa";
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
    <div className="h-screen flex flex-col items-center justify-center bg-white text-gray-700">
      {/* SVG Spinner */}
      <svg
        className="animate-spin h-12 w-12 text-blue-500 mb-4"
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

      {/* Loading Text */}
      <p className="text-lg font-medium">Loading, please wait...</p>
    </div>
  );


if (errorMsg)
  return (
    <div className="h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-5 rounded-lg text-center shadow-lg max-w-md w-full">
        {/* SVG Error Icon */}
        <div className="flex justify-center ">
          <svg
            className="w-12 h-12 text-red-500"
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

        {/* Error Message */}
        <p className="mb-4">{errorMsg}</p>

        {/* Refresh Button */}
        <button
          onClick={() => window.location.reload()}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition duration-200"
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
        backgroundColor: "rgba(59, 130, 246, 0.7)",
        borderColor: "rgba(59, 130, 246, 1)",
        borderWidth: 1,
        borderRadius: 4,
      },
    ],
  };

  const issuedData = {
    labels: data.topIssuedItems.map((item) => item.name),
    datasets: [
      {
        label: "Issued Quantity",
        data: data.topIssuedItems.map((item) => item.totalIssuedQuantity),
        backgroundColor: "rgba(16, 185, 129, 0.7)",
        borderColor: "rgba(16, 185, 129, 1)",
        borderWidth: 1,
        borderRadius: 4,
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
        fill: false,
        borderColor: "rgba(255, 99, 132, 0.7)",
        backgroundColor: "rgba(255, 99, 132, 0.5)",
        tension: 0.3,
      },
    ],
  };

  const getChartOptions = (title, yLabel = "Quantity") => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "top", labels: { usePointStyle: true, padding: 15 } },
      title: {
        display: true,
        text: title,
        font: { weight: "bold" },
        padding: { bottom: 20 },
      },
      tooltip: {
        callbacks: {
          label: (context) =>
            `${context.dataset.label}: ${
              context.parsed.y ?? context.parsed
            }`,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: { display: true, text: yLabel },
        ticks: { precision: 0 },
        grid: { color: "rgba(0, 0, 0, 0.05)" },
      },
      x: { grid: { display: false } },
    },
  });

  const { cardCounts } = data;

  return (
    <div className="px-24">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-8">
        Dashboard Analytics
      </h1>

      <div className="flex flex-wrap gap-12 items-center justify-center py-12">
        <StatCard
          icon={<FaUsers className="text-4xl mx-auto" />}
          title="Users"
          value={cardCounts.users ?? 0}
          bgClass="bg-primary"
        />
        <StatCard
          icon={<FaBox className="text-4xl mx-auto" />}
          title="Products"
          value={cardCounts.products ?? 0}
          bgClass="bg-accent"
        />
        <StatCard
          icon={<FaBuilding className="text-4xl mx-auto" />}
          title="Departments"
          value={cardCounts.departments ?? 0}
          bgClass="bg-success"
        />
        <StatCard
          icon={<FaTags className="text-4xl mx-auto" />}
          title="Categories"
          value={cardCounts.categories ?? 0}
          bgClass="bg-primary-dark"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        <ChartCard title="Top 10 Items by Inventory Quantity">
          <Bar
            data={inventoryData}
            options={getChartOptions("Top 10 Items by Inventory Quantity")}
          />
        </ChartCard>

        <ChartCard title="Top 10 Issued Products">
          <Bar
            data={issuedData}
            options={getChartOptions("Top 10 Issued Products")}
          />
        </ChartCard>
      </div>

      <div className="mt-6">
        <ChartCard title="Daily Total Receipt Value" yAxisLabel="Amount">
          <Line
            data={dailyReceiptData}
            options={getChartOptions("Daily Total Receipt Value", "Amount")}
          />
        </ChartCard>
      </div>
    </div>
  );
};

const StatCard = ({ icon, title, value, bgClass }) => (
  <div
    className={`${bgClass} text-white px-12 py-8 flex flex-col gap-4 custom-radius text-center w-[300px] rounded-lg`}
  >
    {icon}
    <h3 className="text-xl font-semibold">{title}</h3>
    <span className="text-3xl font-bold">{value}</span>
  </div>
);

const ChartCard = ({ title, children }) => (
  <div className="bg-white rounded-xl shadow-md p-4 md:p-6 h-96">
    <div className="h-full">{children}</div>
  </div>
);

export default Dashboard;
