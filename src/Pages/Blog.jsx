import React from "react";
import "../assets/styles/Blog.scss";
import Header from "../Component/Header";
import Footer from '../Component/Footer';
import Seo from '../Component/Seo';
import { NavLink } from "react-router-dom";

function Blog() {
    return (
        <div className="blog-container">
             <Seo title="Blog Page" description="this is Blog page" page="Blog" keywords={["trading", "thecaptaltree", "risk management", "strategies"]} />
        <Header/>
        <main className="main-content">
            <section className="Blog-section">
            <h1 className="main-heading">Blog</h1>
            <p className="Blog-text">
                Learn about investing and grow your wealth with us.
            </p>
            <aside className="sidebar">
                                <h2 className="sidebar-title">Learning Paths</h2>
                                <ul>
                                    <li><NavLink to="/learn" activeClassName="active">Investment Learning</NavLink></li>
                                    <li><NavLink to="/book" activeClassName="active">Books</NavLink></li>
                                    <li><NavLink to="/short60" activeClassName="active">Short60</NavLink></li>
                                    <li><NavLink to="/blog" activeClassName="active">Blog</NavLink></li>
                                </ul> 
                            </aside>
            
            </section>
        </main>
       <Footer/>
        </div>
    );
    
}

export default Blog;