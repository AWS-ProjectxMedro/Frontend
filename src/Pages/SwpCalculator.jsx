import React, { useState } from "react";
import "../assets/styles/SwpCalculator.scss";
import Header from "../Component/Header";
import Footer from "../Component/Footer";
import Seo from "../Component/Seo";

function SwpCalculator() {
    const [investmentPeriod, setInvestmentPeriod] = useState(1);
    const [totalInvestment, setTotalInvestment] = useState(0);
    const [monthlyWithdrawal, setMonthlyWithdrawal] = useState(0);
    const [rateOfReturn, setRateOfReturn] = useState(0);
    const [finalValue, setFinalValue] = useState(null);
    const [totalInterest, setTotalInterest] = useState(null);
    const [totalWithdrawn, setTotalWithdrawn] = useState(null);

    const handleInputChange = (setter) => (e) => {
        setter(parseFloat(e.target.value) || 0);
    };

    const calculateSWP = () => {
        let remainingAmount = totalInvestment;
        let totalWithdrawals = investmentPeriod * 12;
        let interestEarned = 0;

        for (let i = 0; i < totalWithdrawals; i++) {
            let interest = (remainingAmount * (rateOfReturn / 100)) / 12;
            interestEarned += interest;
            remainingAmount = remainingAmount + interest - monthlyWithdrawal;
            if (remainingAmount < 0) {
                remainingAmount = 0;
                break;
            }
        }

        setFinalValue(remainingAmount.toFixed(2));
        setTotalInterest(interestEarned.toFixed(2));
        setTotalWithdrawn((monthlyWithdrawal * totalWithdrawals).toFixed(2));
    };

    return (
        <div className="swpcalculator-container">
            <Seo
                title="SWP Calculator"
                description="This Systematic Withdrawal Plan calculator computes your matured sum as per your monthly withdrawals."
                canonical="Swp-calculator"
                keywords={["trading", "thecapitaltree", "risk management", "strategies"]}
            />
            <Header />
            <main className="main-content-swp">
                <br />
                <br />
                <section className="swpcalculator-section">
                    <h1 className="main-heading-swp">SWP Calculator</h1>
                    <div className="swpcalculator-display">
                        {[ 
                            { label: "Total Investment", value: totalInvestment, setter: setTotalInvestment, max: 1000000 },
                            { label: "Monthly Withdrawal", value: monthlyWithdrawal, setter: setMonthlyWithdrawal, max: 100000 },
                            { label: "Expected Rate of Return (%)", value: rateOfReturn, setter: setRateOfReturn, max: 50 }
                        ].map(({ label, value, setter, max }, index) => (
                            <div key={index} className="input-row">
                                <div className="input-container">
                                    <label>{label}</label>
                                    <input type="text" value={value} onChange={handleInputChange(setter)} />
                                </div>
                                <input
                                    type="range"
                                    min="0"
                                    max={max}
                                    step={max / 100}
                                    value={value}
                                    onChange={handleInputChange(setter)}
                                />
                            </div>
                        ))}

                        <div className="input-container">
                            <label>Years of Investment</label>
                            <div className="investment-controls">
                                <button className="control-btn" onClick={() => setInvestmentPeriod((prev) => prev + 1)}>+</button>
                                <button className="control-btn" onClick={() => setInvestmentPeriod((prev) => Math.max(prev - 1, 1))}>-</button>
                                <input type="text" value={investmentPeriod} readOnly  className="textinput"/>
                            </div>
                        </div>

                        <div>
                            <button className="calculate" onClick={calculateSWP}>Calculate</button>
                        </div>

                        {finalValue !== null && (
                            <div className="results-container">
                                {[
                                    { label: "Final Value", value: finalValue },
                                    { label: "Total Interest Earned", value: totalInterest },
                                    { label: "Total Withdrawal", value: totalWithdrawn }
                                ].map(({ label, value }, index) => (
                                    <div key={index} className="result-item">
                                        <span className="result-label">{label}:</span>
                                        <span className="result-value">₹{value}</span>
                                    </div>
                                ))}
                            </div>
                        )}
        
                        
                            <button className="display-button">Invest Now</button>
                        
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    );
}

export default SwpCalculator;

