import React, { useEffect, useState } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2"; 
import { useTable } from "react-table";
import "chart.js/auto"; 
import "./App.css";

function App() {
  const [barChartData, setBarChartData] = useState({});
  const [transactions, setTransactions] = useState([]);
  const [statistics, setStatistics] = useState({});
  const [monthTransactions, setMonthTransactions] = useState("March");
  const [monthBarChart, setMonthBarChart] = useState("");
  const [monthStatistics, setMonthStatistics] = useState("");
  const [search, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);

  // Fetch Transactions
  const fetchTransactions = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/products/transactions",
        {
          params: { page, perPage, month: monthTransactions, search },
        }
      );
      setTransactions(response.data.transactions || []);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  };

  // Fetch Bar Chart Data
  const fetchBarChartData = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/products/barChart",
        {
          params: { month: monthBarChart },
        }
      );
      const barChart = response.data;

      // Update bar chart data state
      setBarChartData({
        labels: barChart.map((item) => item.range), 
        datasets: [
          {
            label: "Number of Items",
            data: barChart.map((item) => item.count), 
            backgroundColor: "rgba(75, 192, 192, 0.6)",
            borderColor: "rgba(75, 192, 192, 1)",
            borderWidth: 1,
          },
        ],
      });
    } catch (error) {
      console.error("Error fetching bar chart data:", error);
    }
  };

  // Fetch Statistics Data
  const fetchStatistics = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/products/statistics",
        {
          params: { month: monthStatistics },
        }
      );
      setStatistics(response.data);
    } catch (error) {
      console.error("Error fetching statistics:", error);
    }
  };

  useEffect(() => {
    fetchTransactions();
    fetchBarChartData();
    fetchStatistics();
  }, [
    page,
    perPage,
    monthTransactions,
    monthBarChart,
    monthStatistics,
    search,
  ]);


  return (
    <div className="App">
      <h1>Dashboard</h1>



      {/* Transactions Table Section */}
      <h2>Transactions</h2>
      <div className="filters">
        <label>Filter Transactions by Month: </label>
        <select
          value={monthTransactions}
          onChange={(e) => setMonthTransactions(e.target.value)}
        >
          <option value="">All Months</option>
          <option value="January">January</option>
          <option value="February">February</option>
          <option value="March">March</option>
          <option value="April">April</option>
          <option value="May">May</option>
          <option value="June">June</option>
          <option value="July">July</option>
          <option value="August">August</option>
          <option value="September">September</option>
          <option value="October">October</option>
          <option value="November">November</option>
          <option value="December">December</option>
        </select>
        <input
          type="text"
          placeholder="Search by Title"
          value={search}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-bar"
        />
      </div>
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Title</th>
              <th>Description</th>
              <th>Price</th>
              <th>Category</th>
              <th>Sold</th>
              <th>Image</th>
            </tr>
          </thead>
          <tbody>
            <>
              {transactions && transactions.length > 0 ? (
                transactions.map((data) => (
                  <tr key={data?.id}>
                    <td>{data?.id}</td>
                    <td>{data?.title}</td>
                    <td>{data?.description}</td>
                    <td>{data?.price}</td>
                    <td>{data?.category}</td>
                    <td>{data?.sold ? "Sold" : "Not Sold"}</td>
                    <td>
                      <img
                        src={data?.image}
                        alt={data?.title}
                        style={{ width: "50px", height: "50px" }}
                      />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7">Record not found</td>{" "}
                </tr>
              )}
            </>
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="pagination">
        <span>Page {page}</span>
        <button onClick={() => setPage(page > 1 ? page - 1 : 1)}>
          Previous
        </button>
        <button onClick={() => setPage(page + 1)}>Next</button>
        <span>Per Page {perPage}</span>
      </div>

      {/* Statistics Section */}
      <h2>Statistics</h2>
      <div className="statistics-container">
        <div className="filters">
          <label>Filter Statistics by Month: </label>
          <select
            value={monthStatistics}
            onChange={(e) => setMonthStatistics(e.target.value)}
          >
            <option value="">All Months</option>
            <option value="January">January</option>
            <option value="February">February</option>
            <option value="March">March</option>
            <option value="April">April</option>
            <option value="May">May</option>
            <option value="June">June</option>
            <option value="July">July</option>
            <option value="August">August</option>
            <option value="September">September</option>
            <option value="October">October</option>
            <option value="November">November</option>
            <option value="December">December</option>
          </select>
        </div>
        <div className="statistics">
          <p>Total Sale: {statistics.totalSaleAmount}</p>
          <p>Total Sold Item: {statistics.totalSoldItems}</p>
          <p>Total Not Sold Item: {statistics.totalNotSoldItems}</p>
        </div>
      </div>

      {/* Bar Chart Section */}
      <h2>Price Range Bar Chart</h2>
      <div className="barchart-container">
        <div className="filters">
          <label>Filter Bar Chart by Month: </label>
          <select
            value={monthBarChart}
            onChange={(e) => setMonthBarChart(e.target.value)}
          >
            <option value="">All Months</option>
            <option value="January">January</option>
            <option value="February">February</option>
            <option value="March">March</option>
            <option value="April">April</option>
            <option value="May">May</option>
            <option value="June">June</option>
            <option value="July">July</option>
            <option value="August">August</option>
            <option value="September">September</option>
            <option value="October">October</option>
            <option value="November">November</option>
            <option value="December">December</option>
          </select>
        </div>
        {barChartData.labels ? <Bar data={barChartData} /> : <p>Loading...</p>}
      </div>

      
    </div>
  );
}

export default App;
