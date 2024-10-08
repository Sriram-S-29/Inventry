import axios from 'axios'
import React, { useEffect, useState } from 'react'
import * as XLSX from 'xlsx';
import TransHistory from './TransHistory';

function ItemDetails({ itemId }) {
  const [item, setItem] = useState({})
  const [activeTab, setActiveTab] = useState('overview')
  const [transaction,setTransaction] = useState([])
  
  const ExportToExcel = ( data, fileName ) => {
    console.log(data)
    if (!data || !Array.isArray(data)) {
      console.error("Data is undefined or not an array:", data);
      return;
  }
        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.json_to_sheet(data);
        XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
        XLSX.writeFile(wb, `${fileName}.xlsx`);
  }

  const getItem = async (itemId) => {
    try {
      console.log(itemId)
      const response = await axios.get("http://localhost:8000/admin/itemDetail", {
        params: { id: itemId },
      })
      console.log('Yes this is')
      console.table(response.data)
      
      setItem(response.data)
    
    } catch (error) {
      console.log('error')
      console.log(error)
    }
  }

  const getTrans = async(itemId)=>{

    try{
      const response = await axios.get("http://localhost:8000/admin/transaction", {
        params: { id: itemId },
      })
      console.table(response.data)
      setTransaction(response.data)

    }
    catch(error){
      console.log(error.message)
    }
  }

 
  useEffect(() => {
    console.log(itemId)
    if (itemId) {
      console.log('called')
      getItem(itemId)
      getTrans(itemId)
      
    }
  }, [itemId])

 
  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <>
            <h3 className="font-semibold mt-6 mb-2">Item Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm text-gray-600">Category</h4>
                <p>{item.category ? `${item.category}` : 'N/A'}</p>
              </div>
              <div>
                <h4 className="text-sm text-gray-600">Description</h4>
                <p>{item.description || 'N/A'}</p>
              </div>
            </div>

            <h3 className="font-semibold mt-6 mb-2">Stock Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm text-gray-600">In Stock</h4>
                <p>{item.quantityInStock ? ` ${item.quantityInStock}` : 'N/A'}</p>
              </div>
              <div>
                <h4 className="text-sm text-gray-600">Units</h4>
                <p>{item.units || 'N/A'}</p>
              </div>
            </div>
            <h3 className="font-semibold mt-6 mb-2">Purchase Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm text-gray-600">Price</h4>
                <p>{item.cost ? `Rs ${item.cost}` : 'N/A'}</p>
              </div>
              
            </div>
          </>
        )
      case 'transactions':
        return<div className="container mx-auto p-6 bg-white rounded-lg shadow-lg">
        <div className='flex justify-between'><h2 className="text-2xl font-bold mb-4 text-gray-800">Transaction History</h2>
        <button type="button" onClick={()=>{ExportToExcel(transaction,item.name)}} className="bg-green-400 rounded-lg p-2 h-9 w-[17%] text-white flex justify-around ">
          <p className=' right-3'>Export to Excel </p>

        </button></div>
       
          
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer / Supplier</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Purpose</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {transaction.map((item, key) => (
                <tr 
                  key={key} 
                  className="hover:bg-gray-50 transition-colors duration-200"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 ">
                    {item.supplier || item.customer}
                    
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 relative flex">
                    {item.supplier&&(<p className='transform rotate-45 insert-0 left-2 absolute text-green-500'>&rarr;</p>)}
                    {item.customer&&(<p className='transform rotate-[320deg] insert-0 left-2 absolute text-red-400'>&rarr;</p>)}
                    {item.newQuantity}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      item.type === 'incoming' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                    }`}>
                      {item.type}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {transaction.length === 0 && (
          <p className="text-center text-gray-500 mt-4">No transactions found.</p>
        )}
      </div>
      
      case 'history':
        return <div  className=' w-[100%]'>
          <TransHistory itemId={itemId} />

        </div> 
      default:
        return null
    }
  }

  return (
    <div className="flex flex-col  p-6 overflow-y-auto
      max-w-full  ">
      <h1 className="text-2xl font-bold mb-2">{item.name}</h1>
      <p className="text-sm text-gray-600 mb-4">
        {item.description}
      </p>

      <div className=" rounded-lg shadow p-6 ">
        <div className="flex border-b mb-4">
          <button
            className={`pb-2 mr-4 ${activeTab === 'overview' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-gray-500'}`}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          <button
            className={`pb-2 mr-4 ${activeTab === 'transactions' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-gray-500'}`}
            onClick={() => setActiveTab('transactions')}
          >
            Transactions
          </button>
          <button
            className={`pb-2 ${activeTab === 'history' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-gray-500'}`}
            onClick={() => setActiveTab('history')}
          >
            History
          </button>
        </div>

        
        {renderTabContent()}
      </div>
    </div>
  )
}

export default ItemDetails
