import React from "react";
import "../assets/styles/Learn.scss";
import Header from "../Component/Header";
import Footer from "../Component/Footer";
import Seo from "../Component/Seo";
import { NavLink } from "react-router-dom";
import { FaChartLine, FaChartBar, FaShieldAlt, FaMoneyBillWave } from "react-icons/fa";

function Learn() {
    return (
        <div className="learn-container">
            <Seo 
                title="Learn Page"
                description="Expand your investment knowledge"
                page="Learn"
                keywords={["investment learning", "market trends", "financial growth", "wealth strategies"]} 
            />

            <Header />

            <div className="learn-layout">
                {/* Sidebar Navigation */}
                <br />
                <br />
                <aside className="sidebar">
                    <h2 className="sidebar-title">Learning Paths</h2>
                    <ul>
                        <li><NavLink to="/learn" activeClassName="active">Investment Learning</NavLink></li>
                        <li><NavLink to="/book" activeClassName="active">Books</NavLink></li>
                        <li><NavLink to="/short60" activeClassName="active">Short60</NavLink></li>
                        <li><NavLink to="/blog" activeClassName="active">Blog</NavLink></li>
                    </ul> 
                </aside>

                {/* Main Content */}
                <main className="main-content-learn">
                    <br />
                    <br />
                    <section className="learn-section" id="investment-learning">
                        <div className="hero">
                            <h1 className="main-heading-learn">Empower Yourself with Investment Knowledge</h1>
                            <h3>
                                TheCapitalTree is committed to educating investors on market trends, 
                                risk management, and wealth-building strategies.
                            </h3>
                        </div>

                        <h2>What You’ll Learn</h2>

                        <div className="learn-grid">
                            <div className="learn-card">
                                <FaChartLine size={60} color="#ffcc00" />
                                <h3>Investment Basics:</h3>
                                <p>Insights into emerging investment opportunities.</p>
                            </div>
                            <div className="learn-card">
                                <FaChartBar size={60} color="#ffcc00" />
                                <h3>Market Trends & Analysis:</h3>
                                <p>Smart strategies to secure and grow your financial future.</p>
                            </div>
                            <div className="learn-card">
                                <FaShieldAlt size={60} color="#ffcc00" />
                                <h3>Risk Management:</h3>
                                <p>Strategies to minimize risks and maximize returns.</p>
                            </div>
                            <div className="learn-card">
                                <FaMoneyBillWave size={60} color="#ffcc00" />
                                <h3>Wealth Growth Strategies:</h3>
                                <p>How to create sustainable long-term wealth.</p>
                            </div>
                        </div>

                        <p className="learnpara">
                            Stay ahead with our expert insights and <b>transform the way you invest!</b>
                        </p>
                    </section>
                </main>
            </div>

            <Footer />
        </div>
    );
}

export default Learn;
