import axios from "axios";
import React, { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Purchase() {
  const [vendorList, setVendorList] = useState([]);
  const [date, setDate] = useState("");
  const [supplier, setVendorName] = useState("");
  const [productList, setProductList] = useState([]);
  const [data, setData] = useState([
    { _id: "", quantityInStock: "0", description: "", cost: "" },
  ]);
  const [total, setTotal] = useState(0);

  const style =
    "w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:border-blue-500";
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
    console.log(finalData);

    try {
      const response = await axios.post(
        "http://localhost:8000/admin/purchaseOrder",
        finalData
      );
      console.log("Order submitted", response.data);
      toast.success("Sucess");
      setData([{ _id: "", quantityInStock: "0", description: "", cost: "" }]);
    } catch (error) {
      console.error("Error submitting order", error.message);
    }
  };

  const add = () => {
    let sum = data.reduce((acc, ini) => acc + Number(ini.total), 0);
    setTotal(sum);
    console.table(data);
  };

  useEffect(() => {
    venList();
    proList();
    add();
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

        <form
          className="w-full relative flex flex-col gap-3 flex-1"
          onSubmit={handleSubmit}
        >
          <div>
            <label className="block mb-2 text-red-500">Select Vendor*</label>
            <select
              className="w-[30%] text-center text-gray-600 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:border-blue-500"
              onChange={(e) => setVendorName(e.target.value)}
              value={supplier}
              required
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
            <label className="block mb-2 text-red-500">Date*</label>
            <input
              type="date"
              className="w-[30%] text-center text-gray-600 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:border-blue-500"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>

          {/* Items Table */}
          <div className="w-full">
            <p className="font-semibold mb-2">Add Items</p>
            <div className="h-[80%] border border-gray-200 rounded-lg p-2">
              <table className="table-auto w-full text-left mb-4 text-xs rounded-t-xl">
                <thead>
                  <tr>
                    <th className="px-4 py-2">Items</th>
                    <th className="px-4 py-2">New Quantity</th>
                    <th className="px-4 py-2">Cost</th>
                    <th className="px-4 py-2">GST</th>
                    <th className="px-4 py-2">Amount</th>
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
                        <p>{item.total}</p>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Add Row Button */}
            <div className="flex justify-start relative">
              <button
                type="button"
                onClick={addRow}
                className=" flex items-center gap-1 px-4 py-2 bg-gray-100  rounded "
              >
                <p className="text-white bg-blue-600 rounded-full w-4 h-4 flex items-center justify-center">
                  +
                </p>
                <p className="text-gray-600">Add New Row</p>
              </button>
            </div>
          </div>
          <div className="absolute top-[83%] left-[87%]">
            <p className="text-red-600 ">Total Amount : {total}</p>
          </div>

          <div className="flex justify-end ">
            <button
              type="submit"
              className=" w-[17%] bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition duration-150 text-center self-end"
            >
              Submit Purchase Order
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
