import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';


export default function PurchaseHistory() {
  const [purchaseHistory, setPurchaseHistory] = useState([]);
  const [history, setHistory] = useState([]);
  const [id, setId] = useState('');
  const [loading, setLoading] = useState(false);
  const [specificLoading, setSpecificLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedId, setSelectedId] = useState(null);
  const detailsRef = useRef();

  const getHistory = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:8000/admin/purchaseHistory');
      setPurchaseHistory(response.data);
    } catch (error) {
      console.error('Error fetching purchase history:', error);
      setError('Failed to fetch purchase history.');
    } finally {
      setLoading(false);
    }
  };

  const specificHistory = async () => {
    if (!id) return;
    setSpecificLoading(true);
    try {
      const response = await axios.get('http://localhost:8000/admin/specificHistory', { params: { id } });
      setHistory(response.data);
    } catch (error) {
      console.error('Error fetching specific history:', error);
      setError('Failed to fetch specific history.');
    } finally {
      setSpecificLoading(false);
    }
  };

  useEffect(() => {
    getHistory();
  }, []);

  useEffect(() => {
    specificHistory();
  }, [id]);



  return (
    <div className="w-screen bg-gray-50 p-2 sm:pt-7">
      <div className=" mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4 sm:mb-0">Purchase History</h1>
         
        </div>
        {error && <div className="text-red-500  text-center">{error}</div>}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 ">
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <h2 className="text-xl font-semibold p-4 bg-gray-100 text-gray-700">Purchase Summary</h2>
            {loading ? (
              <div className="text-center text-gray-500 p-4">Loading...</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {purchaseHistory.map((item) => (
                      <tr
                        key={item._id}
                        onClick={() => {
                          setId(item._id);
                          setSelectedId(item._id);
                        }}
                        className={`cursor-pointer hover:bg-gray-50 transition duration-150 ease-in-out ${
                          selectedId === item._id ? 'bg-blue-50' : ''
                        }`}
                      >
                        <td className="px-4 py-3 text-sm text-gray-800">{item.name}</td>
                        <td className="px-4 py-3 text-sm text-gray-800">Rs {item.totalAmount.toFixed(2)}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">
                          {new Date(item.date).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                    {purchaseHistory.length === 0 && (
                      <tr>
                        <td colSpan="3" className="px-4 py-3 text-center text-gray-500">
                          No purchase history available.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <div ref={detailsRef} className="p-4">
              <h2 className="text-xl font-semibold mb-4 text-gray-700">Purchase Details</h2>
              {specificLoading ? (
                <div className="text-center text-gray-500">Loading...</div>
              ) : history.length > 0 ? (
                history.map((item, key) => (
                  <div key={key} className="mb-6">
                    <div className="flex justify-between items-center mb-3 pb-2 border-b">
                      <span className="text-lg font-medium text-gray-800">
                        {new Date(item.date).toLocaleDateString()}
                      </span>
                      <span className="text-lg font-bold text-green-600">
                        Rs {item.totalAmount.toFixed(2)}
                      </span>
                    </div>
                    <div className="space-y-3">
                      {item.items.map((purchase) => (
                        <div key={purchase._id} className="bg-gray-50 p-3 rounded-md shadow-sm">
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-sm font-medium text-gray-800">{purchase.name}</span>
                            <span className="text-xs text-gray-600">Qty: {purchase.newQuantity}</span>
                          </div>
                          <div className="text-xs text-gray-600">Cost: Rs {purchase.cost.toFixed(2)}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              ) : selectedId ? (
                <div className="text-center text-gray-500">No details available for the selected purchase.</div>
              ) : (
                <div className="text-center text-gray-500">Select a purchase to view details.</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}