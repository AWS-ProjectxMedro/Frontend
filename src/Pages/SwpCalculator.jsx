import React, { useState } from "react";
import "../assets/styles/SwpCalculator.scss";
import Header from "../Component/Header";
import Footer from "../Component/Footer";
import Seo from "../Component/Seo";
import Animation from "../assets/image/invest.jpg"; // Assuming this path is correct

function SwpCalculator() {
  const [investmentPeriod, setInvestmentPeriod] = useState(1);
  const [totalInvestment, setTotalInvestment] = useState(100000); // Example initial value
  const [monthlyWithdrawal, setMonthlyWithdrawal] = useState(1000); // Example initial value
  const [rateOfReturn, setRateOfReturn] = useState(8); // Example initial value
  const [finalValue, setFinalValue] = useState(null);
  const [totalInterest, setTotalInterest] = useState(null);
  const [totalWithdrawn, setTotalWithdrawn] = useState(null);
  const [tableData, setTableData] = useState([]);

  const handleInputChange = (setter) => (e) => {
    // Ensure we handle empty input gracefully, setting it to 0
    const value = e.target.value === "" ? 0 : parseFloat(e.target.value);
    // Use isNaN check for safety
    setter(isNaN(value) ? 0 : value);
  };

  // Separate handler for text input to allow typing numbers directly
  const handleTextInputChange = (setter) => (e) => {
    const value = e.target.value.replace(/[^0-9.]/g, ""); // Allow only numbers and dot
    // Ensure we handle empty input gracefully, setting it to 0 or keeping it empty for typing
    const numericValue = value === "" ? "" : parseFloat(value);
    // Update state only if it's a valid number or empty string
    if (value === "" || !isNaN(numericValue)) {
      setter(value === "" ? "" : numericValue); // Store empty string or number
    }
  };

  // Helper function to format numbers for display in text inputs
  const formatValueForInput = (value) => {
    // Show empty string if value is 0 or '', otherwise show the number
    return value === 0 || value === "" ? "" : value.toString();
  };

  const calculateSWP = () => {
    // Use 0 if state holds empty string before calculation
    const currentTotalInvestment = totalInvestment === "" ? 0 : totalInvestment;
    const currentMonthlyWithdrawal =
      monthlyWithdrawal === "" ? 0 : monthlyWithdrawal;
    const currentRateOfReturn = rateOfReturn === "" ? 0 : rateOfReturn;

    let remainingAmount = currentTotalInvestment;
    let totalWithdrawals = investmentPeriod * 12;
    let interestEarned = 0;
    let monthlyData = []; // Array to store monthly data for the table

    // Basic validation
    if (
      currentTotalInvestment <= 0 ||
      investmentPeriod <= 0 ||
      currentRateOfReturn < 0 ||
      currentMonthlyWithdrawal < 0
    ) {
      // Maybe set an error state here or just reset results
      setFinalValue(null);
      setTotalInterest(null);
      setTotalWithdrawn(null);
      setTableData([]); // Clear table data
      console.warn("Invalid input for calculation.");
      return; // Stop calculation if inputs are invalid
    }

    for (let i = 0; i < totalWithdrawals; i++) {
      // Ensure remainingAmount doesn't go below zero before calculation
      if (remainingAmount <= 0) {
        remainingAmount = 0;
        break; // Stop if balance is zero or negative
      }

      let interest = (remainingAmount * (currentRateOfReturn / 100)) / 12;
      interestEarned += interest;
      let beforeWithdrawal = remainingAmount + interest; // Balance before withdrawal
      remainingAmount = beforeWithdrawal - currentMonthlyWithdrawal;

      // Ensure remaining amount doesn't drop below zero *after* withdrawal
      if (remainingAmount < 0) {
        // Adjust last withdrawal if needed? Or just set final to 0?
        // For simplicity, let's assume the full withdrawal happens if possible,
        // and the final value reflects the potentially negative balance before setting to 0.
        // Let's recalculate the last effective withdrawal if balance goes negative.
        // Or more simply: cap remainingAmount at 0.
        remainingAmount = 0;
        // We need to know how many withdrawals actually happened.
        totalWithdrawals = i + 1; // Record the actual number of withdrawals made
      }

      monthlyData.push({
        month: i + 1,
        beginningBalance: beforeWithdrawal.toFixed(2),
        withdrawal: currentMonthlyWithdrawal.toFixed(2),
        interest: interest.toFixed(2),
        endingBalance: remainingAmount.toFixed(2),
      });
    }

    setFinalValue(remainingAmount.toFixed(2));
    setTotalInterest(interestEarned.toFixed(2));
    // Calculate total withdrawn based on actual withdrawals made before balance hit zero
    setTotalWithdrawn((currentMonthlyWithdrawal * totalWithdrawals).toFixed(2));
    setTableData(monthlyData); // Set the table data state
  };

  return (
    <div className="swpcalculator-container">
      <Seo
        title="SWP Calculator"
        description="This Systematic Withdrawal Plan calculator computes your matured sum as per your monthly withdrawals."
        canonical="Swp-calculator"
        keywords={[
          "trading",
          "thecapitaltree",
          "risk management",
          "strategies",
          "swp",
          "systematic withdrawal plan",
          "investment calculator",
        ]}
      />
      <Header />
      <main className="main-content-swp">
        <section className="swpcalculator-section">
          <h1 className="main-heading-swp">SWP Calculator</h1>
          {/* Flex Container for Columns */}
          <div className="calculator-layout-container">
            {/* Column 1: Calculator Form & Results */}
            <div className="calculator-form-column">
              {/* Using a wrapper div for inputs for better structure */}
              <div className="calculator-inputs">
                {[
                  {
                    label: "Total Investment (₹)",
                    value: totalInvestment,
                    setter: setTotalInvestment,
                    max: 10000000,
                  }, // Increased max
                  {
                    label: "Monthly Withdrawal (₹)",
                    value: monthlyWithdrawal,
                    setter: setMonthlyWithdrawal,
                    max: 100000,
                  },
                  {
                    label: "Expected Rate of Return (%)",
                    value: rateOfReturn,
                    setter: setRateOfReturn,
                    max: 30,
                  }, // Adjusted max
                ].map(({ label, value, setter, max }, index) => (
                  <div key={index} className="input-group">
                    {/* Changed class */}
                    <label htmlFor={`input-${index}`}>{label}</label>
                    <div className="input-controls">
                      {/* Wrapper for text and range */}
                      <input
                        id={`input-${index}`}
                        type="text" // Use text to allow empty string
                        value={formatValueForInput(value)} // Format for display
                        onChange={handleTextInputChange(setter)} // Use text handler
                        placeholder="0"
                        className="value-input" // Specific class for text input
                      />
                      <input
                        type="range"
                        min="0"
                        max={max}
                        // step={max / 100} // Step might be too large, adjust as needed
                        step={max > 10000 ? 1000 : max > 1000 ? 100 : 1} // Dynamic step
                        value={value === "" ? 0 : value} // Range needs a number
                        onChange={handleInputChange(setter)} // Use original handler
                        className="range-slider" // Specific class for range
                      />
                    </div>
                  </div>
                ))}

                <div className="input-group">
                  {/* Changed class */}
                  <label htmlFor="investmentPeriodInput">
                    Investment Period (Years)
                  </label>
                  <div className="investment-controls">
                    <button
                      className="control-btn"
                      onClick={() =>
                        setInvestmentPeriod((prev) => Math.max(prev - 1, 1))
                      }
                    >
                      -
                    </button>
                    <input
                      id="investmentPeriodInput"
                      type="text"
                      value={investmentPeriod}
                      readOnly
                      className="textinput period-input" // Specific class
                    />
                    <button
                      className="control-btn"
                      onClick={() => setInvestmentPeriod((prev) => prev + 1)}
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
              {/* End of calculator inputs */}
              <div className="calculate-button-container">
                <button className="calculate" onClick={calculateSWP}>
                  Calculate
                </button>
              </div>

              {finalValue !== null && (
                <div className="results-container">
                  {[
                    { label: "Final Value", value: finalValue },
                    { label: "Total Interest Earned", value: totalInterest },
                    { label: "Total Withdrawn", value: totalWithdrawn }, // Corrected label
                  ].map(({ label, value }, index) => (
                    <div key={index} className="result-item">
                      <span className="result-label">{label}:</span>
                      <span className="result-value">₹ {value}</span>{" "}
                      {/* Added space */}
                    </div>
                  ))}
                </div>
              )}
            </div>{" "}
            {/* End Column 1 */}
          </div>{" "}
          {/* End Flex Container */}
        </section>
        {/* Column 2: Video & Invest Button */}
        <div className="calculator-media-column">
          <img src={Animation} alt="" width="550px" />
          <button className="invest-now-button">Invest Now</button>
        </div>{" "}
        {/* End Column 2 */}
      </main>
      {tableData.length > 0 && (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Month</th>
                <th>Balance at Begin (₹)</th>
                <th>Withdrawal (₹)</th>
                <th>Interest Earned (₹)</th>
                <th>Balance at End (₹)</th>
              </tr>
            </thead>
            <tbody>
              {tableData.map((row, index) => (
                <tr key={index}>
                  <td>{row.month}</td>
                  <td>₹{row.beginningBalance}</td>
                  <td>₹{row.withdrawal}</td>
                  <td>₹{row.interest}</td>
                  <td>₹{row.endingBalance}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <Footer />
    </div>
  );
}

export default SwpCalculator;
