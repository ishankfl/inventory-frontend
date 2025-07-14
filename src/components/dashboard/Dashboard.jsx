import { useEffect, useState } from "react";
import axios from "axios";
import { Bar, Line } from 'react-chartjs-2';
import { FaTags, FaBuilding, FaBox, FaUsers } from "react-icons/fa";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { fetchDasahboardData } from "../../api/dashboard";

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend);

const Dashboard = () => {
  const [data, setData] = useState(null); // will hold entire DashboardDataDto
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);

  const fetchDashboardOverview = async () => {
    try {
      setLoading(true);
      setErrorMsg(null);
      const response = await fetchDasahboardData();
      setData(response.data);

    } catch (error) {
      if (error.response?.status === 401) {
        setErrorMsg("You are unable to perform this action.");
      } else {
        console.error("Error fetching dashboard data:", error);
        setErrorMsg("An unexpected error occurred while loading the dashboard.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardOverview();
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );

  if (errorMsg) return (
    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mt-4 text-center">
      {errorMsg}
    </div>
  );

  if (!data) return null; // no data

  // Prepare chart data
  const inventoryData = {
    labels: data.topProductsByQty.map(item => item.name),
    datasets: [{
      label: 'Inventory Quantity',
      data: data.topProductsByQty.map(item => item.totalStockQuantity),
      backgroundColor: 'rgba(59, 130, 246, 0.7)',
      borderColor: 'rgba(59, 130, 246, 1)',
      borderWidth: 1,
      borderRadius: 4,
    }],
  };

  const issuedData = {
    labels: data.topIssuedItems.map(item => item.name),
    datasets: [{
      label: 'Issued Quantity',
      data: data.topIssuedItems.map(item => item.totalIssuedQuantity),
      backgroundColor: 'rgba(16, 185, 129, 0.7)',
      borderColor: 'rgba(16, 185, 129, 1)',
      borderWidth: 1,
      borderRadius: 4,
    }],
  };

  const dailyReceiptData = {
    labels: data.dailyTotalReceiptValue.map(d => new Date(d.date).toLocaleDateString()),
    datasets: [{
      label: 'Daily Total Receipt Value',
      data: data.dailyTotalReceiptValue.map(d => d.totalPrice),
      fill: false,
      borderColor: 'rgba(255, 99, 132, 0.7)',
      backgroundColor: 'rgba(255, 99, 132, 0.5)',
      tension: 0.3,
    }],
  };

  const getChartOptions = (title, yLabel = 'Quantity') => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: { usePointStyle: true, padding: 15 },
      },
      title: {
        display: true,
        text: title,
        font: { weight: 'bold' },
        padding: { bottom: 20 },
      },
      tooltip: {
        callbacks: {
          label: context => `${context.dataset.label}: ${context.parsed.y ?? context.parsed}`,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: { display: true, text: yLabel },
        ticks: { precision: 0 },
        grid: { color: 'rgba(0, 0, 0, 0.05)' },
      },
      x: {
        grid: { display: false },
      },
    },
  });

  const { cardCounts } = data;

  return (
    <div className="px-24">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-8">Dashboard Analytics</h1>

      <div className="flex flex-wrap gap-12 items-center justify-center py-12">
        <StatCard icon={<FaUsers className="text-4xl mx-auto" />} title="Users" value={cardCounts.users ?? 0} bgClass="bg-primary" />
        <StatCard icon={<FaBox className="text-4xl mx-auto" />} title="Products" value={cardCounts.products ?? 0} bgClass="bg-accent" />
        <StatCard icon={<FaBuilding className="text-4xl mx-auto" />} title="Departments" value={cardCounts.departments ?? 0} bgClass="bg-success" />
        <StatCard icon={<FaTags className="text-4xl mx-auto" />} title="Categories" value={cardCounts.categories ?? 0} bgClass="bg-primary-dark" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 px-0">
        <ChartCard title="Top 10 Items by Inventory Quantity">
          <Bar data={inventoryData} options={getChartOptions('Top 10 Items by Inventory Quantity')} />
        </ChartCard>

        <ChartCard title="Top 10 Issued Products">
          <Bar data={issuedData} options={getChartOptions('Top 10 Issued Products')} />
        </ChartCard>

      
      </div>
      <br />
      <br />
      <div>
          <ChartCard title="Daily Total Receipt Value" yAxisLabel="Amount">
          <Line data={dailyReceiptData} options={getChartOptions('Daily Total Receipt Value', 'Amount')} />
        </ChartCard>
      </div>
    </div>
  );
};

// Reusable stat card component
const StatCard = ({ icon, title, value, bgClass }) => (
  <div className={`${bgClass} text-white px-12 py-8 flex flex-col gap-4 custom-radius text-center w-[300px] rounded-lg`}>
    {icon}
    <h3 className="text-xl font-semibold">{title}</h3>
    <span className="text-3xl font-bold">{value}</span>
  </div>
);

// Reusable chart card container
const ChartCard = ({ title, children, yAxisLabel }) => (
  <div className="bg-white rounded-xl shadow-md p-4 md:p-6 h-96">
    <div className="h-full">
      {children}
    </div>
  </div>
);

export default Dashboard;
