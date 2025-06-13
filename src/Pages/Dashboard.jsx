// src/pages/Dashboard.jsx - Fully Self-Contained Single File Version (with ₹ currency)

import React, { useEffect, useMemo, useRef, useCallback } from "react";
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import { Paper, CircularProgress, Box } from "@mui/material";
import {
    ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
} from 'recharts';
import { useNavigate } from "react-router-dom";


// ========================================================================
// 1. STYLES: All styles from 'Dashboard.scss' are now here as a JS object
// ========================================================================
const styles = {
    dashboardUser: {
        display: 'flex',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    },
    themeDark: {
        backgroundColor: '#161921',
        color: '#e0e0e0',
        minHeight: '100vh',
    },
    sidebar: {
        width: '240px',
        backgroundColor: '#1f232d',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        borderRight: '1px solid #333',
    },
    sidebarTitle: {
        fontSize: '1.5rem',
        fontWeight: 'bold',
        marginBottom: '30px',
        color: '#fff',
    },
    sidebarNav: {
        flexGrow: 1,
    },
    sidebarLink: {
        display: 'block',
        color: '#a0a8c2',
        textDecoration: 'none',
        padding: '12px 0',
        fontSize: '1rem',
    },
    logoutButton: {
        width: '100%',
        padding: '12px',
        fontSize: '1rem',
        backgroundColor: '#e53935',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
    },
    dashboardMainContent: {
        flex: 1,
        padding: '2rem',
    },
    dashboardContentHeader: {
        marginBottom: '2rem',
    },
    headerTitle: {
        fontSize: '2.5rem',
        fontWeight: 'bold',
        margin: '0 0 10px 0',
        color: '#fff',
    },
    headerSubtitle: {
        fontSize: '1.1rem',
        color: '#a0a8c2',
        margin: 0,
    },
    headerStats: {
        marginTop: '1rem',
        display: 'flex',
        gap: '2rem',
        color: '#a0a8c2',
    },
    dashboardGridCards: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '1.5rem',
    },
    dashboardCard: {
        backgroundColor: '#1f232d',
        padding: '25px',
        borderRadius: '10px',
        color: '#e0e0e0',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    },
    cardHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '1rem',
    },
    cardTitle: {
        margin: 0,
        fontSize: '1.1rem',
        fontWeight: '600',
    },
    dataSource: {
        fontSize: '0.8rem',
        color: '#a0a8c2',
    },
    cardBody: {
        flexGrow: 1,
        display: 'flex',
        flexDirection: 'column',
    },
    amount: {
        fontSize: '2.2rem',
        fontWeight: 'bold',
        margin: '0 0 5px 0',
        color: '#fff',
    },
    change: {
        fontSize: '0.9rem',
        margin: 0,
        color: '#00b929',
    },
    chartContainerLine: {
        flexGrow: 1,
        minHeight: '120px',
        marginTop: '1rem',
    },
    chartNoData: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        color: '#a0a8c2',
    },
    transactionItem: {
        display: 'flex',
        justifyContent: 'space-between',
        padding: '8px 0',
        borderTop: '1px solid #333',
    },
    customTooltip: {
        backgroundColor: 'rgba(31, 35, 45, 0.9)',
        border: '1px solid #444',
        padding: '10px',
        borderRadius: '5px',
        color: '#fff',
    },
};

const Sidebar = ({ setIsAuthenticated }) => {
    const navigate = useNavigate();
    const handleLogout = () => { localStorage.removeItem("authToken"); localStorage.removeItem("userData"); setIsAuthenticated(false); navigate("/login", { replace: true }); };
    return (
        <aside style={styles.sidebar}>
            <h1 style={styles.sidebarTitle}>My Dashboard</h1>
            <nav style={styles.sidebarNav}>
                <a href="#dashboard" style={styles.sidebarLink}>Dashboard</a>
                <a href="#profile" style={styles.sidebarLink}>Profile</a>
                <a href="#settings" style={styles.sidebarLink}>Settings</a>
            </nav>
            <button onClick={handleLogout} style={styles.logoutButton}>Logout</button>
        </aside>
    );
};

const initializeFirebaseMessaging = async () => { console.log("Mock Firebase Messaging Initialized."); return Promise.resolve("mock-firebase-token-12345"); };

const api = axios.create({ baseURL: process.env.REACT_APP_API_BASE_URL, headers: { 'Content-Type': 'application/json' }});
api.interceptors.request.use((config) => { const token = localStorage.getItem('authToken'); if (token) { config.headers['Authorization'] = `Bearer ${token}`; } return config; }, (error) => Promise.reject(error));

const optimizedQueryConfig = { staleTime: 300000, cacheTime: 600000, refetchOnWindowFocus: false, refetchOnMount: false, retry: 1, retryDelay: 1000 };

const MemoizedLineChart = React.memo(({ data, dataKey, stroke, name, yAxisFormatter }) => {
    if (!data || data.length === 0) return <div style={styles.chartNoData}><p>No data available</p></div>;
    return (
        <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 20, right: 20, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.08)" vertical={false} />
                <XAxis dataKey={name === 'investment' ? 'name' : 'year'} tick={{ fill: '#a0a8c2' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#a0a8c2' }} axisLine={false} tickLine={false} tickFormatter={yAxisFormatter} />
                <Tooltip content={<CustomTooltip />} cursor={{ stroke: `rgba(${stroke === '#8a7cff' ? '138, 124, 255' : '0, 185, 41'}, 0.3)`, strokeWidth: 2 }} />
                <Line type="monotone" dataKey={dataKey} stroke={stroke} strokeWidth={3} dot={{ r: 4, strokeWidth: 2, fill: '#fff' }} activeDot={{ r: 8, stroke: stroke, fill: '#fff' }} />
            </LineChart>
        </ResponsiveContainer>
    );
});
MemoizedLineChart.displayName = 'MemoizedLineChart';

const DashboardCard = React.memo(({ title, amount, isLoading, error, chart, cardStyle, dataSource, changeText }) => (
    <Paper component="article" style={{...styles.dashboardCard, ...cardStyle}}>
        <div style={styles.cardHeader}>
            <h3 style={styles.cardTitle}>{title}</h3>
            {dataSource && <span style={styles.dataSource}>{dataSource}</span>}
        </div>
        <div style={styles.cardBody}>
            {/* UPDATED: Fallback text is now '₹0' */}
            <p style={styles.amount}>{isLoading ? "Loading..." : error ? "Error" : amount || '₹0'}</p>
            {changeText && <p style={styles.change}>{changeText}</p>}
            {chart && <div style={styles.chartContainerLine}>{chart}</div>}
        </div>
    </Paper>
));
DashboardCard.displayName = 'DashboardCard';

const fetchTotalInvestment = async () => { try { const res = await api.get('/api/users/total-investment'); return res.data; } catch (e) { console.error('Error fetching total investment:', e); return { totalInvestment: 0 }; }};
const fetchTotalProfit = async () => { try { const res = await api.get('/api/users/total-profit-loss'); return res.data; } catch (e) { console.error('Error fetching total profit:', e); return { totalProfitOrLoss: 0 }; }};
const fetchMonthlyInvestmentData = async () => { try { const res = await api.get('/api/users/monthly-investment-data'); return res.data; } catch (e) { console.error('Error fetching monthly investment data:', e); return { monthlyData: [] }; }};
const fetchYearlyProfitData = async () => { try { const res = await api.get('/api/users/yearly-profit-data'); return res.data; } catch (e) { console.error('Error fetching yearly profit data:', e); return { yearlyData: [] }; }};
const fetchPortfolioPerformance = async () => { try { const res = await api.get('/api/users/portfolio-performance'); return res.data; } catch (e) { console.error('Error fetching portfolio performance:', e); return { performance: 0, trend: 'Stable' }; }};
const fetchRecentTransactions = async () => { try { const res = await api.get('/api/users/recent-transactions'); return res.data; } catch (e) { console.error('Error fetching recent transactions:', e); return { transactions: [] }; }};

const generateRepresentativeChartData = (total, labels, dataKey, labelKey) => { if (!total) { return labels.map(label => ({ [labelKey]: label, [dataKey]: 0 })); } const points = labels.length === 6 ? [0.05, 0.15, 0.1, 0.25, 0.2, 0.25] : [0.2, 0.4, 0.4]; return labels.map((label, index) => ({ [labelKey]: label, [dataKey]: Math.round(points[index % points.length] * total) })); };
const processMonthlyData = (apiData, fallback) => { if (apiData?.monthlyData?.length > 0) return apiData.monthlyData.map(item => ({ name: item.month, investment: item.amount })); return generateRepresentativeChartData(apiData?.totalInvestment || fallback, ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'], 'investment', 'name'); };
const processYearlyData = (apiData, fallback) => { if (apiData?.yearlyData?.length > 0) return apiData.yearlyData.map(item => ({ year: item.year, profit: item.profit })); return generateRepresentativeChartData(apiData?.totalProfit || fallback, ["2022", "2023", "2024"], 'profit', 'year'); };

const parseJwt = (token) => { try { return JSON.parse(atob(token.split('.')[1])); } catch (e) { return null; }};
const useJWTAuth = () => { const [authState, setAuthState] = React.useState({ isAuthenticated: false, currentUser: null, loading: true }); React.useEffect(() => { try { const token = localStorage.getItem("authToken"), data = localStorage.getItem("userData"); if (token && data) { const payload = parseJwt(token); if (payload && payload.exp * 1000 > Date.now()) { setAuthState({ isAuthenticated: true, currentUser: JSON.parse(data), loading: false }); return; } } setAuthState({ isAuthenticated: false, currentUser: null, loading: false }); } catch (e) { setAuthState({ isAuthenticated: false, currentUser: null, loading: false }); } }, []); return authState; };

const CustomTooltip = React.memo(({ active, payload, label }) => {
    if (active && payload?.length) {
        // UPDATED: Formatter now uses INR for the tooltip
        const formatCurrency = (v) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(v || 0);
        return (<div style={styles.customTooltip}><p>{label}</p><p>{`${payload[0].name}: ${formatCurrency(payload[0].value)}`}</p></div>);
    }
    return null;
});
CustomTooltip.displayName = 'CustomTooltip';

const Dashboard = ({ setIsAuthenticated }) => {
    const { currentUser, isAuthenticated, loading } = useJWTAuth();
    const navigate = useNavigate();
    const hasRedirected = useRef(false);
    const messagingInitialized = useRef(false);

    // UPDATED: Currency formatter now uses INR (Indian Rupee)
    const formatCurrency = useCallback((v) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(v || 0), []);
    // UPDATED: Y-axis formatter now uses ₹
    const yAxisFormatter = useCallback((v) => `₹${Math.round(v / 1000)}k`, []);

    useEffect(() => { if (isAuthenticated && currentUser && !messagingInitialized.current) { messagingInitialized.current = true; initializeFirebaseMessaging(); } }, [isAuthenticated, currentUser]);

    const { data: totalInvestmentData, isLoading: isLoadingInvestment, error: investmentError } = useQuery({ queryKey: ['totalInvestment', currentUser?.id], queryFn: fetchTotalInvestment, enabled: !!currentUser, ...optimizedQueryConfig });
    const { data: totalProfitData, isLoading: isLoadingProfit, error: profitError } = useQuery({ queryKey: ['totalProfit', currentUser?.id], queryFn: fetchTotalProfit, enabled: !!currentUser, ...optimizedQueryConfig });
    const { data: monthlyInvestmentData, isLoading: isLoadingMonthlyInvestment } = useQuery({ queryKey: ['monthlyInvestment', currentUser?.id], queryFn: fetchMonthlyInvestmentData, enabled: !!currentUser, ...optimizedQueryConfig });
    const { data: yearlyProfitData, isLoading: isLoadingYearlyProfit } = useQuery({ queryKey: ['yearlyProfit', currentUser?.id], queryFn: fetchYearlyProfitData, enabled: !!currentUser, ...optimizedQueryConfig });
    const { data: portfolioPerformanceData, isLoading: isLoadingPortfolio } = useQuery({ queryKey: ['portfolioPerformance', currentUser?.id], queryFn: fetchPortfolioPerformance, enabled: !!currentUser, ...optimizedQueryConfig });
    const { data: recentTransactionsData, isLoading: isLoadingTransactions } = useQuery({ queryKey: ['recentTransactions', currentUser?.id], queryFn: fetchRecentTransactions, enabled: !!currentUser, ...optimizedQueryConfig });

    const investmentChartData = useMemo(() => processMonthlyData(monthlyInvestmentData, totalInvestmentData?.totalInvestment), [monthlyInvestmentData, totalInvestmentData]);
    const profitChartData = useMemo(() => processYearlyData(yearlyProfitData, totalProfitData?.totalProfitOrLoss), [yearlyProfitData, totalProfitData]);
    const totalPortfolioValue = useMemo(() => (totalInvestmentData?.totalInvestment || 0) + (totalProfitData?.totalProfitOrLoss || 0), [totalInvestmentData, totalProfitData]);
    const recentTransactionCount = useMemo(() => recentTransactionsData?.transactions?.length || 0, [recentTransactionsData]);

    const investmentChart = useMemo(() => <MemoizedLineChart data={investmentChartData} dataKey="investment" stroke="#8a7cff" name="investment" yAxisFormatter={yAxisFormatter} />, [investmentChartData, yAxisFormatter]);
    const profitChart = useMemo(() => <MemoizedLineChart data={profitChartData} dataKey="profit" stroke="#00b929" name="profit" yAxisFormatter={yAxisFormatter} />, [profitChartData, yAxisFormatter]);

    useEffect(() => { if (!loading && !isAuthenticated && !hasRedirected.current) { hasRedirected.current = true; navigate("/login", { replace: true }); } }, [isAuthenticated, loading, navigate]);

    if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#161921' }}><CircularProgress /></Box>;
    if (!isAuthenticated || !currentUser) return null;

    return (
        <div style={{...styles.dashboardUser, ...styles.themeDark}}>
            <Sidebar setIsAuthenticated={setIsAuthenticated} />
            <main style={styles.dashboardMainContent}>
                <header style={styles.dashboardContentHeader}>
                    <h2 style={styles.headerTitle}>Dashboard</h2>
                    <p style={styles.headerSubtitle}>Welcome back, {currentUser?.displayName || currentUser?.name || "User"}!</p>
                    <div style={styles.headerStats}>
                        <span>Portfolio Value: {formatCurrency(totalPortfolioValue)}</span>
                        <span>Recent Transactions: {recentTransactionCount}</span>
                    </div>
                </header>
                <div style={styles.dashboardGridCards}>
                    <DashboardCard title="Total Investment" amount={formatCurrency(totalInvestmentData?.totalInvestment)} isLoading={isLoadingInvestment} error={investmentError} chart={investmentChart} dataSource={isLoadingMonthlyInvestment ? "Loading..." : "Monthly Breakdown"} />
                    <DashboardCard title="Total Profit" amount={formatCurrency(totalProfitData?.totalProfitOrLoss)} isLoading={isLoadingProfit} error={profitError} chart={profitChart} dataSource={isLoadingYearlyProfit ? "Loading..." : "Yearly Breakdown"} changeText="Represents your total earnings." />
                    
                    <Paper component="article" style={styles.dashboardCard}>
                        <div style={styles.cardHeader}><h3 style={styles.cardTitle}>Recent Activity</h3></div>
                        <div style={styles.cardBody}>
                            <p style={styles.amount}>{recentTransactionCount}</p>
                            <p style={styles.change}>Recent transactions</p>
                            {isLoadingTransactions ? <p>Loading...</p> : (recentTransactionsData?.transactions?.slice(0, 3).map((t, i) => (<div key={t.id || i} style={styles.transactionItem}><span>{t.type}</span><span>{formatCurrency(t.amount)}</span></div>)))}
                        </div>
                    </Paper>
                </div>
            </main>
        </div>
    );
};

export default Dashboard;