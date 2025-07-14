import { createContext, useContext, useEffect, useState } from "react";
import { fetchDasahboardData } from "../api/dashboard";

const DashboardContext = createContext();

export const DashboardProvider = ({ children }) => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setErrorMsg(null);

      const response = await fetchDasahboardData();
      setDashboardData(response.data);

    } catch (error) {
      if (error.response?.status === 401) {
        setErrorMsg("You are unauthorized to view this dashboard.");
      } else {
        console.error("Dashboard fetch error:", error);
        setErrorMsg("Something went wrong while fetching the dashboard.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <DashboardContext.Provider value={{ dashboardData, loading, errorMsg }}>
      {children}
    </DashboardContext.Provider>
  );
};

export const useDashboard = () => useContext(DashboardContext);
