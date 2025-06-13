// src/pages/Dashboard.jsx - Fixed Version with JWT Auth Only

import React, { useEffect, useMemo, useRef, useCallback, Suspense } from "react";
import api from '../api/axiosConfig';
import { useQuery } from "@tanstack/react-query";
import "../assets/styles/Dashboard.scss";
import Sidebar from "../Component/dashboard/Sidebar";
import { Paper, CircularProgress, Box } from "@mui/material";
import {
    ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
} from 'recharts';
import { useNavigate } from "react-router-dom";
// Firebase messaging only (not auth)
import { initializeFirebaseMessaging } from "../config/firebase";

// PERFORMANCE OPTIMIZATION: Optimized query configuration
const optimizedQueryConfig = {
    staleTime: 5 * 60 * 1000, // 5 minutes - data considered fresh
    cacheTime: 10 * 60 * 1000, // 10 minutes - keep in cache
    refetchOnWindowFocus: false, // Don't refetch on window focus
    refetchOnMount: false, // Don't refetch on component mount if data exists
    retry: 1, // Reduce retry attempts to prevent delays
    retryDelay: 1000, // 1 second delay between retries
};

// PERFORMANCE OPTIMIZATION: Memoized chart component
const MemoizedLineChart = React.memo(({ data, dataKey, stroke, name, yAxisFormatter }) => {
    if (!data || data.length === 0) {
        return (
            <div className="chart-no-data">
                <p>No data available</p>
            </div>
        );
    }

    return (
        <ResponsiveContainer width="100%" height="100%">
            <LineChart 
                data={data} 
                margin={{ top: 20, right: 20, left: -10, bottom: 5 }}
            >
                <CartesianGrid 
                    strokeDasharray="3 3" 
                    stroke="rgba(255, 255, 255, 0.08)" 
                    vertical={false} 
                />
                <XAxis 
                    dataKey={name === 'investment' ? 'name' : 'year'}
                    tick={{ fill: '#a0a8c2' }} 
                    axisLine={false} 
                    tickLine={false} 
                />
                <YAxis 
                    tick={{ fill: '#a0a8c2' }} 
                    axisLine={false} 
                    tickLine={false} 
                    tickFormatter={yAxisFormatter} 
                />
                <Tooltip 
                    content={<CustomTooltip />} 
                    cursor={{ stroke: `rgba(${stroke === '#8a7cff' ? '138, 124, 255' : '0, 185, 41'}, 0.3)`, strokeWidth: 2 }} 
                />
                <Line 
                    type="monotone" 
                    dataKey={dataKey} 
                    stroke={stroke} 
                    strokeWidth={3} 
                    dot={{ r: 4, strokeWidth: 2, fill: '#fff' }} 
                    activeDot={{ r: 8, stroke: stroke, fill: '#fff' }}
                />
            </LineChart>
        </ResponsiveContainer>
    );
});
MemoizedLineChart.displayName = 'MemoizedLineChart';

// PERFORMANCE OPTIMIZATION: Memoized dashboard card component
const DashboardCard = React.memo(({ 
    title, 
    amount, 
    isLoading, 
    error, 
    chart, 
    className,
    dataSource,
    changeText 
}) => (
    <Paper component="article" className={`dashboard-card ${className || ''}`}>
        <div className="card-header">
            <h3>{title}</h3>
            {dataSource && <span className="data-source">{dataSource}</span>}
        </div>
        <div className="card-body">
            <p className="amount">
                {isLoading ? "Loading..." : error ? "Error loading data" : amount || '$0.00'}
            </p>
            {changeText && <p className="change positive">{changeText}</p>}
            {chart && (
                <div className="chart-container-line">
                    {chart}
                </div>
            )}
        </div>
    </Paper>
));
DashboardCard.displayName = 'DashboardCard';

// ENHANCED API FETCHING FUNCTIONS with better error handling
const fetchTotalInvestment = async () => {
    try {
        const response = await api.get('/api/users/total-investment');
        return response.data;
    } catch (error) {
        console.error('Error fetching total investment:', error);
        // Return default structure instead of throwing
        return { totalInvestment: 0 };
    }
};

const fetchTotalProfit = async () => {
    try {
        const response = await api.get('/api/users/total-profit-loss');
        return response.data;
    } catch (error) {
        console.error('Error fetching total profit:', error);
        return { totalProfitOrLoss: 0 };
    }
};

const fetchMonthlyInvestmentData = async () => {
    try {
        const response = await api.get('/api/users/monthly-investment-data');
        return response.data;
    } catch (error) {
        console.error('Error fetching monthly investment data:', error);
        return { monthlyData: [] };
    }
};

const fetchYearlyProfitData = async () => {
    try {
        const response = await api.get('/api/users/yearly-profit-data');
        return response.data;
    } catch (error) {
        console.error('Error fetching yearly profit data:', error);
        return { yearlyData: [] };
    }
};

const fetchPortfolioPerformance = async () => {
    try {
        const response = await api.get('/api/users/portfolio-performance');
        return response.data;
    } catch (error) {
        console.error('Error fetching portfolio performance:', error);
        return { performance: 0, trend: 'Stable' };
    }
};

const fetchRecentTransactions = async () => {
    try {
        const response = await api.get('/api/users/recent-transactions');
        return response.data;
    } catch (error) {
        console.error('Error fetching recent transactions:', error);
        return { transactions: [] };
    }
};

// PERFORMANCE OPTIMIZATION: Helper functions (moved outside component to avoid recreating)
const generateRepresentativeChartData = (totalAmount, labels, dataKey, labelKey) => {
    if (!totalAmount || totalAmount === 0) {
        return labels.map(label => ({ [labelKey]: label, [dataKey]: 0 }));
    }
    
    const points = labels.length === 6 ? [0.05, 0.15, 0.1, 0.25, 0.2, 0.25] : [0.2, 0.4, 0.4];
    
    return labels.map((label, index) => ({
        [labelKey]: label,
        [dataKey]: Math.round(points[index % points.length] * totalAmount)
    }));
};

const processMonthlyData = (apiData, fallbackTotal) => {
    // Early return for empty data
    if (!apiData && !fallbackTotal) {
        return [];
    }
    
    if (apiData?.monthlyData && Array.isArray(apiData.monthlyData) && apiData.monthlyData.length > 0) {
        return apiData.monthlyData.map(item => ({
            name: item.month || item.name,
            investment: item.amount || item.investment || 0
        }));
    }
    
    if (apiData?.totalInvestment) {
        return generateRepresentativeChartData(
            apiData.totalInvestment, 
            ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'], 
            'investment', 
            'name'
        );
    }
    
    return generateRepresentativeChartData(
        fallbackTotal || 0, 
        ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'], 
        'investment', 
        'name'
    );
};

const processYearlyData = (apiData, fallbackTotal) => {
    if (!apiData && !fallbackTotal) {
        return [];
    }
    
    if (apiData?.yearlyData && Array.isArray(apiData.yearlyData) && apiData.yearlyData.length > 0) {
        return apiData.yearlyData.map(item => ({
            year: item.year || item.name,
            profit: item.profit || item.amount || 0
        }));
    }
    
    if (apiData?.totalProfit) {
        return generateRepresentativeChartData(
            apiData.totalProfit, 
            ["2022", "2023", "2024"], 
            'profit', 
            'year'
        );
    }
    
    return generateRepresentativeChartData(
        fallbackTotal || 0, 
        ["2022", "2023", "2024"], 
        'profit', 
        'year'
    );
};

// JWT Token parsing utility
const parseJwt = (token) => {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
            atob(base64)
                .split('')
                .map(function(c) {
                    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
                })
                .join('')
        );
        return JSON.parse(jsonPayload);
    } catch (error) {
        console.error('JWT parse error:', error);
        return null;
    }
};

// Check if user is authenticated using localStorage
const useJWTAuth = () => {
    const [authState, setAuthState] = React.useState({
        isAuthenticated: false,
        currentUser: null,
        loading: true
    });

    React.useEffect(() => {
        const checkAuth = () => {
            try {
                const token = localStorage.getItem("authToken");
                const userData = localStorage.getItem("userData");
                
                if (token && userData) {
                    const tokenPayload = parseJwt(token);
                    const currentTime = Date.now() / 1000;
                    
                    if (tokenPayload && tokenPayload.exp && tokenPayload.exp > currentTime) {
                        const user = JSON.parse(userData);
                        setAuthState({
                            isAuthenticated: true,
                            currentUser: user,
                            loading: false
                        });
                        return;
                    }
                }
                
                // No valid auth found
                setAuthState({
                    isAuthenticated: false,
                    currentUser: null,
                    loading: false
                });
            } catch (error) {
                console.error('Auth check error:', error);
                setAuthState({
                    isAuthenticated: false,
                    currentUser: null,
                    loading: false
                });
            }
        };

        checkAuth();
    }, []);

    return authState;
};

// PERFORMANCE OPTIMIZATION: Memoized tooltip component
const CustomTooltip = React.memo(({ active, payload, label }) => {
    if (active && payload && payload.length) {
        const formatCurrency = (value) => {
            if (!value && value !== 0) return '$0.00';
            return new Intl.NumberFormat('en-US', { 
                style: 'currency', 
                currency: 'USD',
                minimumFractionDigits: 0,
                maximumFractionDigits: 0
            }).format(value);
        };

        return (
            <div className="custom-recharts-tooltip">
                <p className="label">{`${label}`}</p>
                <p className="value">{`${payload[0].name}: ${formatCurrency(payload[0].value)}`}</p>
            </div>
        );
    }
    return null;
});
CustomTooltip.displayName = 'CustomTooltip';

// MAIN DASHBOARD COMPONENT
const Dashboard = ({ setIsAuthenticated }) => {
    const { currentUser, isAuthenticated, loading } = useJWTAuth();
    const navigate = useNavigate();
    const hasRedirected = useRef(false);
    const messagingInitialized = useRef(false);

    // PERFORMANCE OPTIMIZATION: Memoized formatter functions
    const formatCurrency = useCallback((value) => {
        if (!value && value !== 0) return '$0.00';
        return new Intl.NumberFormat('en-US', { 
            style: 'currency', 
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(value);
    }, []);

    const yAxisFormatter = useCallback((value) => `$${Math.round(value / 1000)}k`, []);

    // Initialize Firebase Messaging for authenticated users
    useEffect(() => {
        if (isAuthenticated && currentUser && !messagingInitialized.current) {
            messagingInitialized.current = true;
            initializeFirebaseMessaging()
                .then((token) => {
                    if (token) {
                        console.log('Firebase messaging initialized successfully');
                    }
                })
                .catch((error) => {
                    console.error('Failed to initialize Firebase messaging:', error);
                });
        }
    }, [isAuthenticated, currentUser]);

    // OPTIMIZED API QUERIES with performance config
    const { 
        data: totalInvestmentData, 
        isLoading: isLoadingInvestment,
        error: investmentError 
    } = useQuery({
        queryKey: ['totalInvestment', currentUser?.id],
        queryFn: fetchTotalInvestment,
        enabled: !!currentUser && isAuthenticated,
        ...optimizedQueryConfig,
    });

    const { 
        data: totalProfitData, 
        isLoading: isLoadingProfit,
        error: profitError 
    } = useQuery({
        queryKey: ['totalProfit', currentUser?.id],
        queryFn: fetchTotalProfit,
        enabled: !!currentUser && isAuthenticated,
        ...optimizedQueryConfig,
    });

    const { 
        data: monthlyInvestmentData, 
        isLoading: isLoadingMonthlyInvestment 
    } = useQuery({
        queryKey: ['monthlyInvestment', currentUser?.id],
        queryFn: fetchMonthlyInvestmentData,
        enabled: !!currentUser && isAuthenticated,
        ...optimizedQueryConfig,
    });

    const { 
        data: yearlyProfitData, 
        isLoading: isLoadingYearlyProfit 
    } = useQuery({
        queryKey: ['yearlyProfit', currentUser?.id],
        queryFn: fetchYearlyProfitData,
        enabled: !!currentUser && isAuthenticated,
        ...optimizedQueryConfig,
    });

    const { 
        data: portfolioPerformanceData, 
        isLoading: isLoadingPortfolio 
    } = useQuery({
        queryKey: ['portfolioPerformance', currentUser?.id],
        queryFn: fetchPortfolioPerformance,
        enabled: !!currentUser && isAuthenticated,
        ...optimizedQueryConfig,
    });

    const { 
        data: recentTransactionsData, 
        isLoading: isLoadingTransactions 
    } = useQuery({
        queryKey: ['recentTransactions', currentUser?.id],
        queryFn: fetchRecentTransactions,
        enabled: !!currentUser && isAuthenticated,
        ...optimizedQueryConfig,
    });

    // PERFORMANCE OPTIMIZATION: Optimized chart data processing
    const investmentChartData = useMemo(() => {
        return processMonthlyData(
            monthlyInvestmentData, 
            totalInvestmentData?.totalInvestment
        );
    }, [monthlyInvestmentData, totalInvestmentData?.totalInvestment]);

    const profitChartData = useMemo(() => {
        return processYearlyData(
            yearlyProfitData, 
            totalProfitData?.totalProfitOrLoss
        );
    }, [yearlyProfitData, totalProfitData?.totalProfitOrLoss]);

    // PERFORMANCE OPTIMIZATION: Memoized calculations
    const totalPortfolioValue = useMemo(() => {
        const investment = totalInvestmentData?.totalInvestment || 0;
        const profit = totalProfitData?.totalProfitOrLoss || 0;
        return investment + profit;
    }, [totalInvestmentData, totalProfitData]);

    const recentTransactionCount = useMemo(() => 
        recentTransactionsData?.transactions?.length || 0, 
        [recentTransactionsData]
    );

    // PERFORMANCE OPTIMIZATION: Memoized chart components
    const investmentChart = useMemo(() => (
        <MemoizedLineChart
            data={investmentChartData}
            dataKey="investment"
            stroke="#8a7cff"
            name="investment"
            yAxisFormatter={yAxisFormatter}
        />
    ), [investmentChartData, yAxisFormatter]);

    const profitChart = useMemo(() => (
        <MemoizedLineChart
            data={profitChartData}
            dataKey="profit"
            stroke="#00b929"
            name="profit"
            yAxisFormatter={yAxisFormatter}
        />
    ), [profitChartData, yAxisFormatter]);

    // Authentication check with redirect prevention
    useEffect(() => {
        if (!loading && !isAuthenticated && !hasRedirected.current) {
            hasRedirected.current = true;
            navigate("/login", { replace: true });
        }
    }, [isAuthenticated, loading, navigate]);

    // Show loading spinner while auth is being checked
    if (loading) {
        return (
            <Box sx={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                height: '100vh', 
                backgroundColor: '#161921' 
            }}>
                <CircularProgress />
            </Box>
        );
    }

    // Early return for unauthenticated users
    if (!isAuthenticated || !currentUser) {
        return null;
    }

    return (
        <div className="dashboard-user theme-dark">
            <Sidebar setIsAuthenticated={setIsAuthenticated} />
            <div className="dashboard__main-content">
                <header className="dashboard-content__header">
                    <div>
                        <h2>Dashboard</h2>
                        <p>Welcome back, {currentUser?.displayName || currentUser?.name || currentUser?.email || "User"}!</p>
                        <div className="header-stats">
                            <span>Portfolio Value: {formatCurrency(totalPortfolioValue)}</span>
                            <span>Recent Transactions: {recentTransactionCount}</span>
                        </div>
                    </div>
                </header>
                <div className="dashboard-grid-cards">
                    {/* Optimized Dashboard Cards */}
                    <DashboardCard
                        title="Total Investment"
                        amount={formatCurrency(totalInvestmentData?.totalInvestment)}
                        isLoading={isLoadingInvestment}
                        error={investmentError}
                        chart={investmentChart}
                        className="card-total-investment"
                        dataSource={isLoadingMonthlyInvestment ? "Loading..." : "Monthly Breakdown"}
                    />

                    <DashboardCard
                        title="Total Profit"
                        amount={formatCurrency(totalProfitData?.totalProfitOrLoss)}
                        isLoading={isLoadingProfit}
                        error={profitError}
                        chart={profitChart}
                        className="card-total-profit"
                        dataSource={isLoadingYearlyProfit ? "Loading..." : "Yearly Breakdown"}
                        changeText="Represents your total earnings."
                    />

                    {/* Portfolio Performance Card */}
                    <DashboardCard
                        title="Portfolio Performance"
                        amount={`${portfolioPerformanceData?.performance || 0}%`}
                        isLoading={isLoadingPortfolio}
                        error={null}
                        className="card-portfolio-performance"
                        changeText={portfolioPerformanceData?.trend || "Stable performance"}
                    />

                    {/* Recent Activity Card */}
                    <Paper component="article" className="dashboard-card card-recent-activity">
                        <div className="card-header">
                            <h3>Recent Activity</h3>
                        </div>
                        <div className="card-body">
                            <p className="amount">{recentTransactionCount}</p>
                            <p className="change">Recent transactions</p>
                            {isLoadingTransactions ? (
                                <p>Loading transactions...</p>
                            ) : (
                                recentTransactionsData?.transactions?.slice(0, 3).map((transaction, index) => (
                                    <div key={transaction.id || index} className="transaction-item">
                                        <span>{transaction.type}</span>
                                        <span>{formatCurrency(transaction.amount)}</span>
                                    </div>
                                ))
                            )}
                        </div>
                    </Paper>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;