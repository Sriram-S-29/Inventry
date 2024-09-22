import axios from "axios";
import React, { useEffect, useState } from "react";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Purchase() {
  const [vendorList, setVendorList] = useState([]);
  const [date, setDate] = useState("");
  const [supplier, setVendorName] = useState("");
  const [productList, setProductList] = useState([]);
  const [data, setData] = useState([
    { _id: "", quantityInStock: "0", description: "", cost: "" },
  ]);
  const[total,setTotal]=useState(0)

  const style =
    "block w-[50%] appearance-none bg-white border border-gray-300 text-gray-700 py-3 px-4 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition ease-in-out duration-150 mb-4";
    const style1 =
    "block w-[100%] appearance-none bg-white border border-gray-300 text-gray-700 py-3 px-4 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition ease-in-out duration-150 mb-4";

  // Fetch vendors list
  const venList = async () => {
    try {
      const response = await axios("http://localhost:8000/admin/vendorList");
      setVendorList(response.data);
    } catch (error) {
      console.log(error.message);
    }
  };

  // Fetch products list
  const proList = async () => {
    try {
      const response = await axios("http://localhost:8000/admin/productLists");
      setProductList(response.data);
    } catch (error) {
      console.log(error.message);
    }
  };

  // Handle adding a new row for products
  const addRow = () => {
    setData([
      ...data,
      { _id: "", quantityInStock: "0", description: "", cost: "" },
    ]);
  };

  // Handle product selection and avoid duplication
  const handleChange = (key, value) => {
    const newData = [...data];
    const exists = newData.some((item) => item.name === value);

    if (!exists) {
      newData[key] = {
        ...productList.find((item) => item.name === value),
        newQuantity: "",
        total: "",
        gst: "",
      };
      setData(newData);
    } else {
      newData[key].name = "";
      setData(newData);
      alert("Item already exists.");
    }
  };

  const handleUpdate = (key, field, value) => {
    const newData = [...data];
    newData[key][field] = value;

    if (field === "newQuantity" || field === "cost" || field === "gst") {
      const newQuantity = parseFloat(newData[key].newQuantity) || 0;
      const cost = parseFloat(newData[key].cost) || 0;
      const gstRate = parseFloat(newData[key].gst) || 0;
      const gstAmount = (gstRate / 100) * cost;

      const total = (cost + gstAmount) * newQuantity;

      newData[key].total = total.toFixed(2);
    }

    setData(newData);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const finalData = {
      supplier,
      date,
      total,
      products: data.map((item) => ({
        productId: item._id,
        name: item.name,
        newQuantity: item.newQuantity,
        cost: item.cost,
        gst: item.gst,
        total: item.total,
      })),
    };
    console.log(finalData)

    try {
      const response = await axios.post(
        "http://localhost:8000/admin/purchaseOrder",
        finalData
      );
      console.log("Order submitted", response.data);
      toast.success("Sucess");
      setData([
        { _id: "", quantityInStock: "0", description: "", cost: "" },
      ])
    } catch (error) {
      console.error("Error submitting order", error.message);
    }
  };

  const add = ()=>{
    let  sum = data.reduce((acc,ini)=>acc+Number(ini.total),0) 
    setTotal(sum)
    console.table(data)
  }

  useEffect(() => {
    venList();
    proList();
    add() 
  }, [data]);

  return (
    <div className="w-screen h-screen flex justify-center bg-white p-4">
      <div className="w-[100%]">
        <h1 className="text-2xl font-bold mb-6 flex items-center">
          <svg
            className="w-6 h-6 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
            />
          </svg>
          New Purchase Order
        </h1>

        <form className="w-full" onSubmit={handleSubmit}>
          {/* Vendor Selection */}
          <div>
            <label className="block mb-2">Select Vendor</label>
            <select
              className={style}
              onChange={(e) => setVendorName(e.target.value)}
              value={supplier}
            >
              <option value="">-- Choose Vendor --</option>
              {vendorList.map((item, key) => (
                <option key={key} value={item.name}>
                  {item.name} - {item.companyName.toUpperCase()}
                </option>
              ))}
            </select>
          </div>

          {/* Date Selection */}
          <div>
            <label className="block mb-2">Date</label>
            <input
              type="date"
              className={style}
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>

          {/* Items Table */}
          <div className="w-full">
            <p className="font-semibold mb-2">Add Items</p>
            <div className="h-[80%] border border-gray-200 rounded-lg p-2">
              <table className="min-w-full bg-white border border-gray-300 shadow-md mb-4">
                <thead>
                  <tr>
                    <th className="py-2 px-4 border">Items</th>
                    <th className="py-2 px-4 border">New Quantity</th>
                    <th className="py-2 px-4 border">Cost</th>
                    <th className="py-2 px-4 border">GST</th>
                    <th className="py-2 px-4 border">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((item, key) => (
                    <tr key={key} className="hover:bg-gray-100">
                      <td className="p-2 border">
                        <select
                          className="block w-full appearance-none bg-white border border-gray-300 text-gray-700 py-3 px-4 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition ease-in-out duration-150 mb-4"
                          value={item.name}
                          onChange={(e) => handleChange(key, e.target.value)}
                        >
                          <option>-- Select Item --</option>
                          {productList.map((product, idx) => (
                            <option key={idx} value={product.name}>
                              {product.name}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="p-2 border">
                        <input
                          type="number"
                          className={style1}
                          value={item.newQuantity}
                          placeholder="eg: 10"
                          onChange={(e) =>
                            handleUpdate(key, "newQuantity", e.target.value)
                          }
                        />
                        <p className="text-green-500">
  Stock In Hand &nbsp; {item.quantityInStock} {item.units}
</p>
                      </td>
                      <td className="p-2 border">
                        <input
                          type="number"
                          className={style1}
                          value={item.cost}
                          placeholder="eg: 100"
                          onChange={(e) =>
                            handleUpdate(key, "cost", e.target.value)
                          }
                        />
                      </td>
                      <td className="p-2 border">
                        <input
                          type="number"
                          className={style1}
                          value={item.gst}
                          placeholder="eg: 18"
                          onChange={(e) =>
                            handleUpdate(key, "gst", e.target.value)
                          }
                        />
                      </td>
                      <td className="p-2 border">
                        <p>{item.total}</p>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Add Row Button */}
            <button
              type="button"
              onClick={addRow}
              className="bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition duration-150"
            >
              Add Row
            </button>
          </div>
          <div>  <p>{total}</p></div>
        

          {/* Submit Button */}
          <button
            type="submit"
            className="mt-4 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition duration-150"
          >
            Submit Purchase Order
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

export default Purchase;
