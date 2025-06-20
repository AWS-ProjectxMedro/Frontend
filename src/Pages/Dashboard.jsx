import React, { useEffect, useMemo, useRef, useCallback } from "react";
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import { CircularProgress, Box } from "@mui/material";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { useNavigate } from "react-router-dom";
import Sidebar from "../Component/dashboard/Sidebar"; // Make sure path to Sidebar.jsx is correct

// Import the single, unified SCSS file
import '../assets/styles/Dashboard.scss'; 

// Helper functions (no changes needed)
const initializeFirebaseMessaging = async () => { console.log("Mock Firebase Messaging Initialized."); return Promise.resolve("mock-firebase-token-12345"); };
const api = axios.create({ baseURL: process.env.REACT_APP_API_BASE_URL, headers: { 'Content-Type': 'application/json' }});
api.interceptors.request.use((config) => { const token = localStorage.getItem('authToken'); if (token) { config.headers['Authorization'] = `Bearer ${token}`; } return config; }, (error) => Promise.reject(error));
const optimizedQueryConfig = { staleTime: 300000, cacheTime: 600000, refetchOnWindowFocus: false, refetchOnMount: false, retry: 1, retryDelay: 1000 };
const fetchTotalInvestment = async () => { try { const res = await api.get('/api/users/total-investment'); return res.data; } catch (e) { console.error('Error fetching total investment:', e); return { totalInvestment: 0 }; }};
const fetchTotalProfit = async () => { try { const res = await api.get('/api/users/total-profit-loss'); return res.data; } catch (e) { console.error('Error fetching total profit:', e); return { totalProfitOrLoss: 0 }; }};
const fetchMonthlyInvestmentData = async () => { try { const res = await api.get('/api/users/monthly-investment-data'); return res.data; } catch (e) { console.error('Error fetching monthly investment data:', e); return { monthlyData: [] }; }};
const fetchYearlyProfitData = async () => { try { const res = await api.get('/api/users/yearly-profit-data'); return res.data; } catch (e) { console.error('Error fetching yearly profit data:', e); return { yearlyData: [] }; }};
const fetchRecentTransactions = async () => { try { const res = await api.get('/api/users/recent-transactions'); return res.data; } catch (e) { console.error('Error fetching recent transactions:', e); return { transactions: [] }; }};
const generateRepresentativeChartData = (total, labels, dataKey, labelKey) => { if (!total) { return labels.map(label => ({ [labelKey]: label, [dataKey]: 0 })); } const points = labels.length === 6 ? [0.05, 0.15, 0.1, 0.25, 0.2, 0.25] : [0.2, 0.4, 0.4]; return labels.map((label, index) => ({ [labelKey]: label, [dataKey]: Math.round(points[index % points.length] * total) })); };
const processMonthlyData = (apiData, fallback) => { if (apiData?.monthlyData?.length > 0) return apiData.monthlyData.map(item => ({ name: item.month, investment: item.amount })); return generateRepresentativeChartData(apiData?.totalInvestment || fallback, ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'], 'investment', 'name'); };
const processYearlyData = (apiData, fallback) => { if (apiData?.yearlyData?.length > 0) return apiData.yearlyData.map(item => ({ year: item.year, profit: item.profit })); return generateRepresentativeChartData(apiData?.totalProfit || fallback, ["2022", "2023", "2024"], 'profit', 'year'); };
const parseJwt = (token) => { try { return JSON.parse(atob(token.split('.')[1])); } catch (e) { return null; }};
const useJWTAuth = () => { const [authState, setAuthState] = React.useState({ isAuthenticated: false, currentUser: null, loading: true }); React.useEffect(() => { try { const token = localStorage.getItem("authToken"), data = localStorage.getItem("userData"); if (token && data) { const payload = parseJwt(token); if (payload && payload.exp * 1000 > Date.now()) { setAuthState({ isAuthenticated: true, currentUser: JSON.parse(data), loading: false }); return; } } setAuthState({ isAuthenticated: false, currentUser: null, loading: false }); } catch (e) { setAuthState({ isAuthenticated: false, currentUser: null, loading: false }); } }, []); return authState; };

// Reusable Components with ClassNames
const CustomTooltip = React.memo(({ active, payload, label }) => {
    if (active && payload?.length) {
        const formatCurrency = (v) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(v || 0);
        return (<div className="custom-tooltip"><p>{label}</p><p>{`${payload[0].name}: ${formatCurrency(payload[0].value)}`}</p></div>);
    }
    return null;
});
CustomTooltip.displayName = 'CustomTooltip';

const MemoizedLineChart = React.memo(({ data, dataKey, stroke, name, yAxisFormatter }) => {
    if (!data || data.length === 0) return <div className="chart-no-data"><p>No data available</p></div>;
    return (
        <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey={name === 'investment' ? 'name' : 'year'} axisLine={false} tickLine={false} tick={{ fill: '#a0a8c2', fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tickFormatter={yAxisFormatter} tick={{ fill: '#a0a8c2', fontSize: 12 }} />
                <Tooltip content={<CustomTooltip />} cursor={{ stroke: `rgba(${stroke === '#8a7cff' ? '138, 124, 255' : '0, 185, 41'}, 0.3)`, strokeWidth: 2 }} />
                <Line type="monotone" dataKey={dataKey} stroke={stroke} strokeWidth={3} dot={{ r: 4, strokeWidth: 2, fill: '#fff' }} activeDot={{ r: 8, stroke: stroke, fill: '#fff' }} />
            </LineChart>
        </ResponsiveContainer>
    );
});
MemoizedLineChart.displayName = 'MemoizedLineChart';

const Dashboard = ({ setIsAuthenticated }) => {
    const { currentUser, isAuthenticated, loading } = useJWTAuth();
    const navigate = useNavigate();
    const hasRedirected = useRef(false);

    const formatCurrency = useCallback((v) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(v || 0), []);
    const yAxisFormatter = useCallback((v) => `₹${Math.round(v / 1000)}k`, []);

    useEffect(() => { if (isAuthenticated && currentUser) { initializeFirebaseMessaging(); } }, [isAuthenticated, currentUser]);

    const { data: totalInvestmentData, isLoading: isLoadingInvestment } = useQuery({ queryKey: ['totalInvestment', currentUser?.id], queryFn: fetchTotalInvestment, enabled: !!currentUser, ...optimizedQueryConfig });
    const { data: totalProfitData, isLoading: isLoadingProfit } = useQuery({ queryKey: ['totalProfit', currentUser?.id], queryFn: fetchTotalProfit, enabled: !!currentUser, ...optimizedQueryConfig });
    const { data: monthlyInvestmentData } = useQuery({ queryKey: ['monthlyInvestment', currentUser?.id], queryFn: fetchMonthlyInvestmentData, enabled: !!currentUser, ...optimizedQueryConfig });
    const { data: yearlyProfitData } = useQuery({ queryKey: ['yearlyProfit', currentUser?.id], queryFn: fetchYearlyProfitData, enabled: !!currentUser, ...optimizedQueryConfig });
    const { data: recentTransactionsData, isLoading: isLoadingTransactions } = useQuery({ queryKey: ['recentTransactions', currentUser?.id], queryFn: fetchRecentTransactions, enabled: !!currentUser, ...optimizedQueryConfig });

    const investmentChartData = useMemo(() => processMonthlyData(monthlyInvestmentData, totalInvestmentData?.totalInvestment), [monthlyInvestmentData, totalInvestmentData]);
    const profitChartData = useMemo(() => processYearlyData(yearlyProfitData, totalProfitData?.totalProfitOrLoss), [yearlyProfitData, totalProfitData]);
    const recentTransactionCount = useMemo(() => recentTransactionsData?.transactions?.length || 0, [recentTransactionsData]);

    const handleLogout = () => {
        localStorage.removeItem("authToken");
        localStorage.removeItem("userData");
        setIsAuthenticated(false);
        navigate("/login", { replace: true });
    };
    
    useEffect(() => { if (!loading && !isAuthenticated && !hasRedirected.current) { hasRedirected.current = true; navigate("/login", { replace: true }); } }, [isAuthenticated, loading, navigate]);

    if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#161921' }}><CircularProgress /></Box>;
    if (!isAuthenticated || !currentUser) return null;

    return (
        // The Sidebar component will add its own class to this wrapper for mobile view
        <div className="dashboard-layout"> 
            <Sidebar onLogout={handleLogout} />
            <main className="dashboard-main-content">
                <header className="dashboard-content-header">
                    <h1 className="header-title">Dashboard</h1>
                    <p className="header-subtitle">Welcome back, {currentUser?.displayName || "User"}!</p>
                    <div className="header-stats">
                        <span>Recent Transactions: {recentTransactionCount}</span>
                    </div>
                </header>
                
                <div className="dashboard-grid-cards">
                    <article className="dashboard-card">
                        <div className="card-header">
                            <h3 className="card-title">Total Investment</h3>
                            <span>Monthly Breakdown</span>
                        </div>
                        <div className="card-body">
                            <p className="amount">{isLoadingInvestment ? "..." : formatCurrency(totalInvestmentData?.totalInvestment)}</p>
                            <p className="change">Total capital deployed</p>
                            <div className="chart-container-line">
                                <MemoizedLineChart data={investmentChartData} dataKey="investment" stroke="#8a7cff" name="investment" yAxisFormatter={yAxisFormatter} />
                            </div>
                        </div>
                    </article>

                    <article className="dashboard-card">
                         <div className="card-header">
                            <h3 className="card-title">Total Profit</h3>
                            <span>Yearly Breakdown</span>
                        </div>
                        <div className="card-body">
                            <p className="amount">{isLoadingProfit ? "..." : formatCurrency(totalProfitData?.totalProfitOrLoss)}</p>
                            <p className="change">Represents your total earnings</p>
                            <div className="chart-container-line">
                                <MemoizedLineChart data={profitChartData} dataKey="profit" stroke="#00b929" name="profit" yAxisFormatter={yAxisFormatter} />
                            </div>
                        </div>
                    </article>
                    
                    <article className="dashboard-card">
                        <div className="card-header"><h3 className="card-title">Recent Activity</h3></div>
                        <div className="card-body">
                            <p className="amount">{recentTransactionCount}</p>
                            <p className="change">Recent transactions</p>
                            <div className="transaction-list">
                                {isLoadingTransactions ? <p>Loading...</p> : (
                                    recentTransactionsData?.transactions?.length > 0 
                                    ? recentTransactionsData.transactions.slice(0, 4).map((t, i) => (
                                        <div key={t.id || i} className="transaction-item">
                                            <span>{t.type}</span>
                                            <span>{formatCurrency(t.amount)}</span>
                                        </div>
                                    ))
                                    : <p>No recent transactions</p>
                                )}
                            </div>
                        </div>
                    </article>
                </div>
            </main>
        </div>
    );
};

export default Dashboard;
