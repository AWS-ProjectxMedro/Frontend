import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../assets/styles/Dashboard.scss";
import Sidebar from "../Component/dashboard/Sidebar";
import axios from "axios";

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";

import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const Dashboard = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [investmentStats, setInvestmentStats] = useState([]);
  const [myInvestments, setMyInvestments] = useState([]);
  const [chartData, setChartData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const baseUrl = process.env.REACT_APP_API_BASE_URL;

  useEffect(() => {
    const authToken = localStorage.getItem("authToken");
    if (!authToken) {
      setIsAuthenticated(false);
      navigate("/login");
    } else {
      setIsAuthenticated(true);
    }
  }, [navigate]);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await axios.get(`${baseUrl}/api/market/weekly/AAPL`);
        const data = response.data;

        setInvestmentStats(data.investmentStats || []);
        setMyInvestments(data.myInvestments || []);

        setChartData({
          labels: data.chart?.labels || [],
          datasets: [
            {
              label: "Trending Stocks",
              data: data.chart?.data || [],
              backgroundColor: "#4858C2",
            },
          ],
        });

        setLoading(false);
      } catch (err) {
        console.error("API error:", err);
        setError("Failed to fetch dashboard data.");
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="dashboard-user">
      <Sidebar setIsAuthenticated={setIsAuthenticated} />

      <div className="dashboard__main">
        <main>
          <h2 className="investment-heading">Investments</h2>
          <section className="dashboard__section investments">
            {investmentStats.map((stat, index) => (
              <div key={index} className="dashboard__investment-data">
                <div>{stat.label}</div>
                <div className="stat-value">{stat.value}</div>
                {stat.note && <div className="stat-note">{stat.note}</div>}
              </div>
            ))}
          </section>

          <section className="dashboard__section charts">
            <div className="dashboard__chart">
              <h3>Yearly Total Investment</h3>
              <div className="dashboard__chart-placeholder">
                <Bar data={chartData} options={{ responsive: true, maintainAspectRatio: false }} />
              </div>
            </div>
            <div className="dashboard__chart">
              <h3>Yearly Total Revenue</h3>
              <div className="dashboard__chart-placeholder">
                <Bar data={chartData} options={{ responsive: true, maintainAspectRatio: false }} />
              </div>
            </div>
          </section>

          <section className="heading-section">
            <h2 className="investment-heading">My Investments</h2>
            <h2 className="investment-heading">Trending Stocks</h2>
          </section>

          <div className="my-investment-chart">
            <section className="dashboard__section my-investments">
              {myInvestments.map((investment, index) => (
                <div key={index} className="dashboard__investment-item">
                  <div className="investment-name">{investment.name}</div>
                  <div className="investment-value">{investment.value}</div>
                  <div
                    className={`investment-roi ${
                      investment.roi.includes("+") ? "positive" : ""
                    }`}
                  >
                    ROI: {investment.roi}
                  </div>
                </div>
              ))}
            </section>

            <section className="dashboard__section-trending-stock">
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Investment Name</TableCell>
                      <TableCell>Price per</TableCell>
                      <TableCell>Return On</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {myInvestments.map((inv, i) => (
                      <TableRow key={i}>
                        <TableCell>{inv.name}</TableCell>
                        <TableCell>{inv.value}</TableCell>
                        <TableCell>{inv.roi}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
