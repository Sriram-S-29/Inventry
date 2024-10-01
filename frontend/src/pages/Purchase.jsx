import axios from "axios";
import React, { useEffect, useState } from "react";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import NewItem from "../components/NewItem";

function Purchase() {
  const [vendorList, setVendorList] = useState([]);
  const [date, setDate] = useState("");
  const [supplier, setVendorName] = useState("");
  const [productList, setProductList] = useState([]);
  const [data, setData] = useState([
    { _id: "", quantityInStock: "0", description: "", cost: "" },
  ]);
  const [total, setTotal] = useState(0);
  const [open,setOpen]= useState(false)

  const style1 =
    "w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:border-blue-500";

  const venList = async () => {
    try {
      const response = await axios("http://localhost:8000/admin/vendorList");
      setVendorList(response.data);
    } catch (error) {
      console.log(error.message);
    }
  };

  const proList = async () => {
    try {
      const response = await axios("http://localhost:8000/admin/productLists");
      setProductList(response.data);
    } catch (error) {
      console.log(error.message);
    }
  };

  const addRow = () => {
    setData([
      ...data,
      { _id: "", quantityInStock: "0", description: "", cost: "" },
    ]);
  };

  const removeRow = (index) => {
    const updatedData = [...data];
    updatedData.splice(index, 1);
    setData(updatedData);
    calculateTotal(updatedData); // Update total after removal
  };

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
      alert("Item already exists.");
      newData[key].name = "";
      setData(newData);
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
    calculateTotal(newData); 
  };

  const calculateTotal = (newData) => {
    let sum = newData.reduce((acc, ini) => acc + Number(ini.total), 0);
    setTotal(sum.toFixed(2));
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
    console.log(finalData);

    try {
      const response = await axios.post(
        "http://localhost:8000/admin/purchaseOrder",
        finalData
      );
      console.log("Order submitted", response.data);
      toast.success("New Products Added ");

     
      setData([{ _id: "", quantityInStock: "0", description: "", cost: "" ,newQuantity: "",total: "", gst: ""}]);
     
      setDate("");
      setVendorName("");
      setTotal(0);
    } catch (error) {
      console.error("Error submitting order", error.message);
      toast.error("Failed to submit order.");
    }
  };

  useEffect(() => {
    venList();
    proList();
  }, [open]);

  return (
    <div className="w-screen h-screen flex justify-center bg-gray-50">
      <div className="w-[100%]  ">
        <div className="w-full h-20 background border flex  items-center justify-between ">
        <h1 className="text-2xl  p-3   flex items-center  ">
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
        <button className={`bg-blue-500 h-8 w-8  rounded text-white p-2  flex items-center right-5 relative justify-center z-20 ring-1  hover:ring-blue-500 border ${open&&`bg-red-600 ring-red-500 border-2 hover:ring-red-500`}`} onClick={()=>{setOpen(prev=>!prev)}}>{open?'x':'+'}</button>

        {open&&<NewItem/>}
        <div className="absolute top-2 bg-green-50 w-56 h-16  flex items-center justify-center gap-2 z-10 rounded-xl border-2 border-white ">
          <div className="bg-green-500 text-white p-2 rounded-lg w-10 text-center h-8 flex  items-center"><p>Ok</p></div>
          <div className="text-gray-500">Added Success </div>

        </div>
        
        </div>
        
        

        <form
          className="w-full relative flex flex-col gap-3 flex-1 p-4  bg-white"
          onSubmit={handleSubmit}
        >
          <div>
            <label className="block mb-2 text-red-500 text-sm"> Vendor name*</label>
            <div className="flex  items-center">
            <select
              className="w-[30%] text-center text-gray-600 py-1 border border-gray-300 rounded focus:outline-none focus:ring focus:border-blue-500   text-sm"
              onChange={(e) => setVendorName(e.target.value)}
              value={supplier}
              required
            >
              <option value=" text-sm" >-- Select Vendor --</option>
              {vendorList.map((item, key) => (
                <option key={key} value={item.name}>
                  {item.name} - {item.companyName.toUpperCase()}
                </option>
              ))}
            </select>
            <svg className="w-5 min-h-7 min-w-5  max-h-4 p-1 h-7  rounded-r-md bg-blue-500" id="Layer_1" xmlns="http://www.w3.org/2000/svg" x="0" y="0" viewBox="0 0 512 512" xml:space="preserve" class="icon icon-sm align-text-bottom"><path fill="#FFF" d="M421 97C365.3 4 244.4-26.3 151.5 29.4S28.3 205.9 83.9 298.8c49.5 82.6 150.5 115.7 237.5 83l66.3 110.7c10 16.7 31.7 22.1 48.4 12.1 16.7-10 22.1-31.7 12.1-48.4L382 345.6c70-61.4 88.4-166 39-248.6zm-85.6 239.5c-76.4 45.8-175.8 20.8-221.6-55.6S93 105.1 169.4 59.3 345.2 38.5 391 114.9s20.8 175.8-55.6 221.6z"></path></svg>

            </div>
            
          </div>

          {/* Date Selection */}
          <div>
            <label className="block mb-2 text-red-500  text-sm">Date*</label>
            <input
              type="date"
              className="w-[32%] text-center text-gray-600 py-[1px] border border-gray-300 rounded focus:outline-none focus:ring focus:border-blue-500  text-sm"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>

          {/* Items Table */}
          <div className="w-full">
            <p className="font-semibold mb-2">Add Items</p>
            <div className="h-[80%] border border-gray-100 rounded-t-full ">
              <table className="table-auto w-full text-left mb-4 text-xs rounded-t-xl">
                <thead className="bg-gray-100 border rounded-t-3xl">
                  <tr>
                    <th className="px-4 ">Items</th>
                    <th className="px-4 ">New Quantity</th>
                    <th className="px-4">Cost</th>
                    <th className="px-4 ">GST</th>
                    <th className="px-4 ">Amount</th>
                    <th className="px-4 py-2">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((item, key) => (
                    <tr key={key} className="hover:bg-gray-100">
                      <td className="p-2 border">
                        <select
                          className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:border-blue-500"
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
                          Stock In Hand &nbsp; {item.quantityInStock}{" "}
                          {item.units}
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
                        <input
                          type="text"
                          className={style1}
                          value={item.total}
                          disabled
                        />
                      </td>
                      <td className="p-2 border text-center">
                        <button
                          type="button"
                          onClick={() => removeRow(key)}
                          className="text-red-600 font-semibold hover:underline"
                        >
                          x
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <button
                type="button"
                onClick={addRow}
                className="bg-blue-50 hover:bg-gray-300 text-gray-300 px-3 py-1 rounded-sm flex gap-3 text-sm"
              >
                 <p  className="bg-blue-600 rounded-full w-5 h-5">+</p>
                 <p className="text-black">Add  Row</p>

              </button>
            </div>
          </div>

          <div className="flex justify-between items-center mt-4 ">
            <div className="flex gap-5 bg-gray-100 p-4">
            <p>Total:</p> 
            <span className="">Rs  {total}</span>
            </div>
            
              
          
            <button
              type="submit"
              className="px-6 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
            >
              Submit
            </button>
          </div>
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
