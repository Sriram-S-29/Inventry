import axios from "axios";
import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function NewItem() {
  const [data, setData] = useState({
    name: "",
    category: "",
    units: "",
    cost: "",
    minimum:"", 
    description: "", 
  });
  const [listOfItem, setList] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await axios.post("http://localhost:8000/admin/newItem", data);
      console.log(result)
      toast.success("New product created");
      setData({
        name: "",
        category: "",
        units: "",
        cost: "", // Reset the cost field
        description: "",
      });
    } catch (error) {
      console.error("Error occurred:", error.response ? error.response.data : error.message);
      toast.error("Error occurred. Please try again.");
    }
  };

  const initial = async () => {
    try {
      const response = await axios.get("http://localhost:8000/admin/list");
      setList(response.data);
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    initial();
  }, []);

  return (
    <div className="absolute inset-0 m-auto flex items-center justify-center min-h-screen bg-gray-100 bg-opacity-85 animate-fadeInDown">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Add New Product</h2>
        <form onSubmit={handleSubmit}>
          {/* Product Name */}
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={data.name}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Product Category */}
          <div className="mb-4">
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">Category</label>
            <input
              type="text"
              id="category"
              name="category"
              value={data.category}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              list="category-list"
              required
            />
            <datalist id="category-list">
              {listOfItem.map((item, index) => (
                <option key={index} value={item.category} />
              ))}
            </datalist>
          </div>

          {/* Product Units */}
          <div className="mb-5 mt-7 flex justify-center items-center gap-2">
            <label htmlFor="units" className="block text-sm font-medium text-gray-700 mb-2">Units</label>
            <input
              type="text"
              id="units"
              name="units"
              value={data.units}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              list='unit'
              required
            />
             <label htmlFor="units" className="block text-sm font-medium text-red-400 mb-2 text-center after:content-['*'] ">Minimum Units</label>
            <input
              type="number"
              id="minimum"
              name="minimum"
              value={data.minimum}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <datalist id="unit">
              {listOfItem.map((item, index) => (
                <option key={index} value={item.units} />
              ))}
            </datalist>
          </div>

          {/* Product Cost */}
          <div className="mb-4">
            <label htmlFor="cost" className="block text-sm font-medium text-gray-700 mb-2">Price</label>
            <input
              type="number"
              id="cost"
              name="cost"
              value={data.cost}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Optional Description */}
          <div className="mb-4">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">Description (Eg:- (16 x 12)(100 covers per bundle))</label>
            <textarea
              id="description"
              name="description"
              value={data.description}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300"
          >
            Submit
          </button>
        </form>
      </div>

      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnHover
        draggable
        pauseOnFocusLoss
      />
    </div>
  );
}

export default NewItem;
