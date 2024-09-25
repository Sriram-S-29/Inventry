"use client"

import axios from 'axios'
import React, { useState, useMemo, useEffect } from 'react'

import * as XLSX from 'xlsx';


export default function TransHistory({itemId}) {

    const [transactions,setTransactions]=  useState([])
  const [filters, setFilters] = useState({
    type: "all",
    supplier: "all",
    customer: "all",
    purpose: "all",
    startDate: "",
    endDate: "",
  })

  const getdata = async(itemId)=>{
    try{
        const response = await axios.get('http://localhost:8000/admin/getdata', {
            params: { id: itemId },
          })
          console.table(response)
          setTransactions(response.data)

    }
    catch(error){
        console.error(error.message);
    }
  }

  useEffect(()=>{
    getdata(itemId)
  },[itemId,filters])
  useEffect(() => {
    
  }, []);

  const handleFilterChange = (e) => {
    const { name, value } = e.target
    setFilters(prev => ({ ...prev, [name]: value }))
  }

  const filteredTransactions = useMemo(() => {
    return transactions.filter(t => {
      const typeMatch = filters.type === "all" || t.type.toLowerCase() === filters.type.toLowerCase()
      const supplierMatch = filters.supplier === "all" || t.supplier === filters.supplier
      const customerMatch = filters.customer === "all" || t.customer === filters.customer
      const purposeMatch = filters.purpose === "all" || t.purpose === filters.purpose
      const dateMatch = (!filters.startDate || t.date >= filters.startDate) &&
                        (!filters.endDate || t.date <= filters.endDate)
      return typeMatch && supplierMatch && customerMatch && purposeMatch && dateMatch
    })
  }, [filters,transactions])

  const uniqueSuppliers = [...new Set(transactions.filter(t => t.supplier).map(t => t.supplier))]
  const uniqueCustomers = [...new Set(transactions.filter(t => t.customer).map(t => t.customer))]
  const uniquePurposes = [...new Set(transactions.filter(t => t.purpose).map(t => t.purpose))]

  const ExportToExcel = ( data, fileName ) => {
  
    if (!data || !Array.isArray(data)) {
      console.error("Data is undefined or not an array:", data);
      return;
  }
        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.json_to_sheet(data);
        XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
        XLSX.writeFile(wb, `${fileName}_TRANSACTION.xlsx`);
  }

  return (
    <div className="p-4 max-w-6xl mx-auto">
        <div className='flex gap-[50%]  items-center mt-3 mb-5'>
        <h1 className="text-2xl font-bold ">Transaction History</h1>
        <button type='button' onClick={()=>{ExportToExcel(filteredTransactions,filteredTransactions[0].name)}} className='bg-green-400 p-2 text-white rounded w-[10%] h-[10%]'>export </button>
        </div>
    
          
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-4">
        <div>
          <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
            Transaction Type
          </label>
          <select
            id="type"
            name="type"
            className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            value={filters.type}
            onChange={handleFilterChange}
          >
            <option value="all">All Types</option>
            <option value="incoming">Incoming</option>
            <option value="outgoing">Outgoing</option>
          </select>
        </div>

        {filters.type === "incoming" && (
          <div>
            <label htmlFor="supplier" className="block text-sm font-medium text-gray-700 mb-1">
              Supplier
            </label>
            <select
              id="supplier"
              name="supplier"
              className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              value={filters.supplier}
              onChange={handleFilterChange}
            >
              <option value="all">All Suppliers</option>
              {uniqueSuppliers.map(supplier => (
                <option key={supplier} value={supplier}>{supplier}</option>
              ))}
            </select>
          </div>
        )}

        {filters.type === "outgoing" && (
          <>
            <div>
              <label htmlFor="customer" className="block text-sm font-medium text-gray-700 mb-1">
                Customer
              </label>
              <select
                id="customer"
                name="customer"
                className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                value={filters.customer}
                onChange={handleFilterChange}
              >
                <option value="all">All Customers</option>
                {uniqueCustomers.map(customer => (
                  <option key={customer} value={customer}>{customer}</option>
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
                className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                value={filters.purpose}
                onChange={handleFilterChange}
              >
                <option value="all">All Purposes</option>
                {uniquePurposes.map(purpose => (
                  <option key={purpose} value={purpose}>{purpose}</option>
                ))}
              </select>
            </div>
          </>
        )}

        <div>
          <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
            Start Date
          </label>
          <input
            type="date"
            id="startDate"
            name="startDate"
            className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            value={filters.startDate}
            onChange={handleFilterChange}
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
            className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            value={filters.endDate}
            onChange={handleFilterChange}
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
         
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
              {filters.type=='incoming'&&<th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>}
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Supplier/Customer</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Purpose</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredTransactions.map((transaction) => (
              <tr key={transaction.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{transaction._id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{transaction.type}</td>
                {filters.type=='incoming'&&<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Rs {transaction.cost}</td>}
                
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{transaction.newQuantity} {transaction.unit}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{transaction.date}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{transaction.supplier || transaction.customer}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{transaction.purpose || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}