import React from "react";
import "./Style/Book.scss";
import Header from "../../Component/Header";  
import Footer from "../../Component/Footer";  
import commonStocks from "../../assets/image/business1.jpg";
import thinkGrow from "../../assets/image/business2.jpg";
import smallBusiness from "../../assets/image/business3.jpg";
import richDad from "../../assets/image/business4.jpg"; 
import intelligentInvestor from "../../assets/image/business5.png";
import commonInvest from "../../assets/image/business7.jpg";
import psychologyMoney from "../../assets/image/business6.jpg";

const books = [
    { id: 1, title: "The Intelligent Investor", author: "Benjamin Graham", img: intelligentInvestor },
    { id: 2, title: "Rich Dad Poor Dad", author: "Robert Kiyosaki", img: richDad },
    { id: 3, title: "The Psychology of Money", author: "Morgan Housel", img: psychologyMoney },
    { id: 4, title: "Common Stocks and Uncommon Profits", author: "Philip Fisher", img: commonInvest },
    { id: 5, title: "Think And Grow Rich", author: "Napoleon Hill", img: commonStocks },
    { id: 6, title: "Small Business Big Money", author: "Akinola Alabi", img: smallBusiness },
    { id: 6, title: "Small Business Big Money", author: "Akinola Alabi", img: smallBusiness },
    { id: 6, title: "Small Business Big Money", author: "Akinola Alabi", img: smallBusiness }
];

const Book = () => {
    return (
        <div className="book-page">
            <Header />
            
            <main className="book-main">
                <div className="book-container">
                    <h1 className="book-title">
                        <span className="book-title-r">R</span>ecommended Books
                    </h1>
                    <div className="book-grid">
                        {books.map((book, index) => (
                            <div key={`${book.id}-${index}`} className="book-card">
                                <div className="book-card-bg">
                                    <img src={book.img} alt={book.title} className="book-img" loading="lazy" />
                                </div>
                                <div className="book-info">
                                    <h3 className="book-name">{book.title.toLowerCase()}</h3>
                                    <p className="book-author">{book.author.toLowerCase()}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default Book;
