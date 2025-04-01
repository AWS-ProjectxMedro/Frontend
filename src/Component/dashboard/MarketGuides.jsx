import React from 'react'
import { NavLink } from 'react-router-dom';
import logo3 from "../../assets/image/logo3.png";
import Sidebar from "../dashboard/Sidebar";
import "./MarketGuides.scss";
import image1 from "../../assets/image/marketGuides1.png";
import image2 from "../../assets/image/marketGuides2.png";
import image3 from "../../assets/image/marketGuides3.png";
import image4 from "../../assets/image/marketGuides4.png";



const MarketGuides = () => {
  return (
    
        <div className="dashboard-marketguides">
      <Sidebar />
      <div className="main-content-MarketGuides">
        <h1>Discover Your Favourite</h1>
        <div className='search-bar'>
        <input type="text" placeholder="Search investment categories" />
        <button className="explore-btn">explore</button>
        </div>
        <br />
        <br />
        <div>
        <h3>Popular searches</h3>
        <div className="tags">
          <span className="tag">market Trends</span>
          <span className="tag">Design principles</span>
          <span className="tag">Analysis</span>
          <span className="tag">Visual Editing</span>
          <span className="tag">Content Creation</span>
        </div>
        </div>
        <br />
        <div>
        <h3>Investment Categories</h3>
        <div className="categories">
          <span className="category">
            <span className='right'> ✓</span>Mark</span>
          <span className="category">
          <span className='right'> ✓</span>Fin</span>
          <span className="category">
          <span className='right'> ✓</span>Creative</span>
          <span className="category">
          <span className='right'> ✓</span>Data</span>
          <span className="category">
            <span className='right'> ✓</span> Visual</span>
        </div>
        </div>
        
        <div>
        <h3>Performance Rating</h3>
        <div className="rating">
          {Array.from({ length: 5 }, (_, index) => (
            <span key={index} className="star">★</span>
          ))}
        </div>
        </div>
        
        <h3>Skill level</h3>
        <div className="skills">
          <span className="skill">Novice</span>
          <span className="skill">Advance</span>
          <span className="skill">Export</span>
        </div>

        <h3>Tailored for you</h3>
        <div className="image-gallery">
          <img src={image1} alt="User Option 1"/>
          <img src={image2} alt="User Option 2"/>
          <img src={image3} alt="User Option 3"/>
          <img src={image4} alt="User Option 4"/>
        </div>
      </div>
    </div>
    
  )
}

export default MarketGuides;
