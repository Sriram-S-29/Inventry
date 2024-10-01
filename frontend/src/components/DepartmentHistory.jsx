"use client";

import axios from "axios";
import React, { useEffect, useState, useMemo } from "react";
import dayjs from "dayjs";
import * as XLSX from "xlsx";

function DepartmentHistory({ id }) {
  const [history, setHistory] = useState([]);
  const [filters, setFilters] = useState({
    product: "all",
    purpose: "all",
    minQuantity: "",
    maxQuantity: "",
    startDate: "",
    endDate: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch department history based on ID
  const getDepartmentHistory = async (id) => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get("http://localhost:8000/admin/getHistory", {
        params: { id },
      });
      setHistory(response.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      setError("Failed to load department history.");
      console.error(error);
    }
  };

  useEffect(() => {
    if (id) {
      getDepartmentHistory(id);
    }
  }, [id]);

  // Handle filter input changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  // Reset all filters to default values
  const handleResetFilters = () => {
    setFilters({
      product: "all",
      purpose: "all",
      minQuantity: "",
      maxQuantity: "",
      startDate: "",
      endDate: "",
    });
    setError(null);
  };

  
  const filteredHistory = useMemo(() => {
    const { product, purpose, minQuantity, maxQuantity, startDate, endDate } = filters;

  
    if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
      setError("Start date cannot be later than end date.");
      return [];
    } else {
      setError(null);
    }

    return history.filter((item) => {
      const productMatch = product === "all" || item.product === product;
      const purposeMatch = purpose === "all" || item.purpose === purpose;
      const minQuantityMatch = minQuantity === "" || item.quantity >= parseInt(minQuantity, 10);
      const maxQuantityMatch = maxQuantity === "" || item.quantity <= parseInt(maxQuantity, 10);
      const startDateMatch = !startDate || new Date(item.date) >= new Date(startDate);
      const endDateMatch = !endDate || new Date(item.date) <= new Date(endDate);

      return (
        productMatch &&
        purposeMatch &&
        minQuantityMatch &&
        maxQuantityMatch &&
        startDateMatch &&
        endDateMatch
      );
    });
  }, [filters, history]);

  
  const uniqueProducts = useMemo(
    () => [...new Set(history.map((item) => item.product))],
    [history]
  );
  const uniquePurposes = useMemo(
    () => [...new Set(history.map((item) => item.purpose))],
    [history]
  );

  
  const exportToExcel = () => {
    if (filteredHistory.length === 0) {
      alert("No data available to export.");
      return;
    }

    const dataToExport = filteredHistory.map((item) => ({
      Date: dayjs(item.date).format("DD MMM YYYY"),
      Product: item.product,
      Quantity: item.quantity,
      Purpose: item.purpose,
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "DepartmentHistory");
    XLSX.writeFile(workbook, `DepartmentHistory_${dayjs().format("YYYYMMDD_HHmmss")}.xlsx`);
  };

  return (
    <div className="p-2 bg-gray-100 w-[100%] min-h-screen  text-[12px] ">
      <div className="max-w-6xl mx-auto  p-3 rounded-lg shadow-md">
       
        <div className="flex flex-col md:flex-row justify-between items-center mb-6">
          <h2 className="text-lg font-semibold">Department History</h2>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <button
              onClick={exportToExcel}
              className="bg-green-500 hover:bg-green-600 text-white px-2 rounded-md text-sm"
            >
              Export to Excel
            </button>
            <button
              onClick={handleResetFilters}
              className="bg-blue-500 hover:bg-blue-600 text-white px-2 text-sm py-2 rounded-md"
            >
              Reset Filters
            </button>
          </div>
        </div>

      
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
        
          <div>
            <label htmlFor="product" className="block text-sm font-medium text-gray-700 mb-1">
              Product
            </label>
            <select
              id="product"
              name="product"
              value={filters.product}
              onChange={handleFilterChange}
              className="block w-full px-1 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Products</option>
              {uniqueProducts.map((prod) => (
                <option key={prod} value={prod}>
                  {prod}
                </option>
              ))}
            </select>
          </div>

         
          <div>
            <label htmlFor="purpose" className="block text-sm font-medium text-gray-700 mb-1">
              Purpose
            </label>
            <select
              id="purpose"
              name="purpose"
              value={filters.purpose}
              onChange={handleFilterChange}
              className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Purposes</option>
              {uniquePurposes.map((purp) => (
                <option key={purp} value={purp}>
                  {purp}
                </option>
              ))}
            </select>
          </div>

        
          <div>
            <label htmlFor="minQuantity" className="block text-sm font-medium text-gray-700 mb-1">
              Min Quantity
            </label>
            <input
              type="number"
              id="minQuantity"
              name="minQuantity"
              value={filters.minQuantity}
              onChange={handleFilterChange}
              className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., 10"
              min="0"
            />
          </div>

      
          <div>
            <label htmlFor="maxQuantity" className="block text-sm font-medium text-gray-700 mb-1">
              Max Quantity
            </label>
            <input
              type="number"
              id="maxQuantity"
              name="maxQuantity"
              value={filters.maxQuantity}
              onChange={handleFilterChange}
              className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., 50"
              min="0"
            />
          </div>

       
          <div>
            <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
              Start Date
            </label>
            <input
              type="date"
              id="startDate"
              name="startDate"
              value={filters.startDate}
              onChange={handleFilterChange}
              className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

         
          <div>
            <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">
              End Date
            </label>
            <input
              type="date"
              id="endDate"
              name="endDate"
              value={filters.endDate}
              onChange={handleFilterChange}
              className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>


        {error && <p className="text-red-500 mb-4">{error}</p>}

        
        {loading && <p className="text-gray-500">Loading history...</p>}

        
        {!loading && (
          <div className="overflow-x-auto  ">
            <table className="min-w-full rounded-lg shadow-md">
              <thead className="bg-gray-50 ">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Quantity
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Purpose
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200  ">
                {filteredHistory.length > 0 ? (
                  filteredHistory.map((item, index) => (
                    <tr
                      key={item._id}
                      className={`hover:bg-gray-100 ${index % 2 === 0 ? "bg-gray-50" : ""}`}
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {dayjs(item.date).format("DD MMM YYYY")}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.product}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.quantity}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.purpose}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="4"
                      className="px-6 py-4 text-center text-sm text-gray-500"
                    >
                      No history available for the selected filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default DepartmentHistory;
