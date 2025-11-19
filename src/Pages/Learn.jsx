import React from "react";
import "../assets/styles/Learn.scss";
import Header from "../Component/Header";
import Footer from "../Component/Footer";
import Seo from "../Component/Seo";
import { Link } from "react-router-dom";

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

            <main className="learn-main">
                {/* Hero Section */}
                <section className="learn-hero-section">
                    <h1 className="hero-heading">
                        Empower Yourself with <span className="hero-heading-accent">Investment Knowledge</span>
                    </h1>
                    <p className="hero-description">
                        TheCapitalTree is committed to educating investors on market trends, risk management, and wealth-building strategies.
                    </p>
                </section>

                {/* What You'll Learn Section */}
                <section className="learn-content-section">
                    <h2 className="learn-title">
                        <span>What</span>
                        <span>You'll</span>
                        <span>Learn</span>
                    </h2>
                    <div className="learn-cards-grid">
                        <Link to="/blog" className="learn-card-item">
                            <span className="card-number">01</span>
                            <h3 className="card-title">Market Trends & Analysis:</h3>
                            <p className="card-description">Smart strategies to secure and grow your financial future.</p>
                        </Link>
                        
                        <Link to="/book" className="learn-card-item">
                            <span className="card-number">02</span>
                            <h3 className="card-title">Market Trends & Analysis:</h3>
                            <p className="card-description">Smart strategies to secure and grow your financial future.</p>
                        </Link>
                        
                        <Link to="/learn" className="learn-card-item">
                            <span className="card-number">03</span>
                            <h3 className="card-title">Market Trends & Analysis:</h3>
                            <p className="card-description">Smart strategies to secure and grow your financial future.</p>
                        </Link>
                        
                        <Link to="/blog" className="learn-card-item">
                            <span className="card-number">04</span>
                            <h3 className="card-title">Market Trends & Analysis:</h3>
                            <p className="card-description">Smart strategies to secure and grow your financial future.</p>
                        </Link>
                    </div>
                </section>

                {/* Call-to-Action Section */}
                <section className="learn-cta-section">
                    <h2 className="cta-heading">
                        <span className="cta-line-bold">Stay ahead with our expert</span>
                        <span className="cta-line-bold">insights and</span>
                        <span className="cta-line-light">transform the way you invest</span>
                    </h2>
                </section>
            </main>

            <Footer />
        </div>
    );
}

export default Learn;
