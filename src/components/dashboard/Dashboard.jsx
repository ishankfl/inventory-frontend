import { useEffect, useState } from "react";
import LineChart from "./LineChart";
import { fetchTop10ItemsByQty, fetchTop10IssuedProduct, fetchCountForCard } from '../../api/dashboard';
import { Bar } from 'react-chartjs-2';
import { FaTags, FaBuilding, FaBox, FaUsers } from "react-icons/fa";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Dashboard = () => {
  const [top10Items, setTop10ProductByQty] = useState([]);
  const [topIssuedItems, setTopIssuedProduct] = useState([]);
  const [cardCount, setCardCount] = useState([]);
  const [loading, setLoading] = useState(true);



  const fetchData = async () => {
    try {
      setLoading(true);
      const [quantityResponse, issuedResponse, countResponse] = await Promise.all([
        fetchTop10ItemsByQty(),
        fetchTop10IssuedProduct(),
        fetchCountForCard()

      ]);
      console.log(countResponse.data)
      setTop10ProductByQty(quantityResponse.data);
      setTopIssuedProduct(issuedResponse.data);
      setCardCount(countResponse.data);

    } catch (e) {
      console.error("Error fetching data:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Common chart options
  const getChartOptions = (title) => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          usePointStyle: true,
          padding: 15,
          font: {
          }
        }
      },
      title: {
        display: true,
        text: title,
        font: {
          weight: 'bold'
        },
        padding: {
          bottom: 20
        }
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            return `${context.dataset.label}: ${context.raw}`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Quantity',

        },
        ticks: {
          font: {
          },
          precision: 0
        },
        grid: {
          display: true,
          color: 'rgba(0, 0, 0, 0.05)'
        }
      },
      x: {
        title: {
          display: true,
          text: 'Products',
          font: {
          }
        },
        ticks: {
          font: {
          },

          callback: function (value) {
            const label = this.getLabelForValue(value);

            return label;
          }
        },
        grid: {
          display: false
        }
      }
    }
  });

  // Inventory by quantity chart data
  const inventoryData = {
    labels: top10Items.map(item => item.name),
    datasets: [{
      label: 'Inventory Quantity',
      data: top10Items.map(item => item.quantity),
      backgroundColor: 'rgba(59, 130, 246, 0.7)',
      borderColor: 'rgba(59, 130, 246, 1)',
      borderWidth: 1,
      borderRadius: 4
    }]
  };

  // Issued products chart data
  const issuedData = {
    labels: topIssuedItems.map(item => item.name),
    datasets: [{
      label: 'Issued Quantity',
      data: topIssuedItems.map(item => item.quantity),
      backgroundColor: 'rgba(16, 185, 129, 0.7)', 
      borderColor: 'rgba(16, 185, 129, 1)',
      borderWidth: 1,
      borderRadius: 4
    }]
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 no-scrollbar">
      <div className="max-w-[80%] mx-auto space-y-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Dashboard Analytics</h1>
        <div className="flex flex-wrap gap-12 items-center justify-center py-12">
          <div className="bg-primary text-white px-12 py-8 flex flex-col gap-4 custom-radius text-center w-[300px]">
            <FaUsers className="text-4xl mx-auto" />
            <h3 className="text-xl font-semibold">Users</h3>
            <span className="text-3xl font-bold">{cardCount.users}</span>
          </div>

          <div className="bg-accent text-white px-12 py-8 flex flex-col gap-4 rounded-[60px_70px_40px_140px] custom-radius text-center w-[300px]">
            <FaBox className="text-4xl mx-auto" />
            <h3 className="text-xl font-semibold">Products</h3>
            <span className="text-3xl font-bold">{cardCount.products}</span>
          </div>

          <div className="bg-success text-white px-12 py-8 flex flex-col gap-4 rounded-[60px_70px_40px_140px] custom-radius text-center w-[300px]">
            <FaBuilding className="text-4xl mx-auto" />
            <h3 className="text-xl font-semibold">Departments</h3>
            <span className="text-3xl font-bold">{cardCount.departments}</span>
          </div>

          <div className="bg-primary-dark text-white px-12 py-8 flex flex-col gap-4 rounded-[60px_70px_40px_140px] custom-radius text-center w-[300px]">
            <FaTags className="text-4xl mx-auto" />
            <h3 className="text-xl font-semibold">Categories</h3>
            <span className="text-3xl font-bold">{cardCount.categories}</span>
          </div>
        </div>


        {/* Bar Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Inventory Chart */}
          <div className="bg-white rounded-xl shadow-md p-4 md:p-6">
            <div className=" md:h-80 lg:h-96">
              {loading ? (
                <div className="flex items-center justify-center h-full">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                </div>
              ) : top10Items.length > 0 ? (
                <Bar
                  data={inventoryData}
                  options={getChartOptions('Top 10 Items by Inventory Quantity')}
                />
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500">
                  No inventory data available
                </div>
              )}
            </div>
          </div>

          {/* Issued Products Chart */}
          <div className="bg-white rounded-xl shadow-md p-4 md:p-6">
            <div className="h-64 md:h-80 lg:h-96">
              {loading ? (
                <div className="flex items-center justify-center h-full">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-500"></div>
                </div>
              ) : topIssuedItems.length > 0 ? (
                <Bar
                  data={issuedData}
                  options={getChartOptions('Top 10 Issued Products')}
                />
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500">
                  No issued products data available
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;