import { useEffect, useState } from "react";
import LineChart from "./LineChart";
import { fetchTop10ItemsByQty, fetchTop10IssuedProduct } from '../../api/dashboard';
import { Bar } from 'react-chartjs-2';
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
  const [loading, setLoading] = useState(true);
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [quantityResponse, issuedResponse] = await Promise.all([
        fetchTop10ItemsByQty(),
        fetchTop10IssuedProduct()
      ]);
      setTop10ProductByQty(quantityResponse.data);
      setTopIssuedProduct(issuedResponse.data);
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
            size: windowSize.width < 640 ? 10 : 12
          }
        }
      },
      title: {
        display: true,
        text: title,
        font: {
          size: windowSize.width < 640 ? 14 : 16,
          weight: 'bold'
        },
        padding: {
          bottom: 20
        }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
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
          font: {
            size: windowSize.width < 640 ? 10 : 12
          }
        },
        ticks: {
          font: {
            size: windowSize.width < 640 ? 10 : 12
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
            size: windowSize.width < 640 ? 10 : 12
          }
        },
        ticks: {
          font: {
            size: windowSize.width < 640 ? 10 : 12
          },
          maxRotation: windowSize.width < 768 ? 45 : 0,
          minRotation: windowSize.width < 768 ? 45 : 0,
          callback: function(value) {
            const label = this.getLabelForValue(value);
            if (windowSize.width < 640 && label.length > 8) {
              return label.substring(0, 6) + '...';
            }
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
      backgroundColor: 'rgba(59, 130, 246, 0.7)', // blue-500
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
      backgroundColor: 'rgba(16, 185, 129, 0.7)', // green-500
      borderColor: 'rgba(16, 185, 129, 1)',
      borderWidth: 1,
      borderRadius: 4
    }]
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Dashboard Analytics</h1>
        
        {/* Bar Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Inventory Chart */}
          <div className="bg-white rounded-xl shadow-md p-4 md:p-6">
            <div className="h-64 md:h-80 lg:h-96">
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

        {/* Line Charts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-md p-4 md:p-6">
            <div className="h-64 md:h-80">
              <LineChart 
                title="Monthly Sales Trend" 
                color="rgba(245, 158, 11, 0.7)" // amber-500
              />
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-md p-4 md:p-6">
            <div className="h-64 md:h-80">
              <LineChart 
                title="Department Usage" 
                color="rgba(139, 92, 246, 0.7)" // purple-500
              />
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-md p-4 md:p-6 md:col-span-2 lg:col-span-1">
            <div className="h-64 md:h-80">
              <LineChart 
                title="Product Returns" 
                color="rgba(239, 68, 68, 0.7)" // red-500
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;