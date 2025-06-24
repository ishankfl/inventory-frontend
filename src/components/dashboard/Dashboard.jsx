import LineChart from "../../components/dashboard/LineChart";
import "../../styles/dashboard.css";

const Dashboard = () => {
  return (
    <div className="dashboard-container">
      <div className="linechart">
        <LineChart />
      </div>
      <div className="linechart">
        <LineChart />
      </div>
      <div className="linechart">
        <LineChart />
      </div>
      <div className="linechart">
        <LineChart />
      </div>
    </div>
  );
};

export default Dashboard;
