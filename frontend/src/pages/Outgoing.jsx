import axios from "axios";
import React, { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Outgoing() {
  const [dList, setDList] = useState([]);
  const [pList, setPList] = useState([]);
  const [data, setData] = useState({
    dName: "",
    date: "",
    purpose: "",
  });
  const [product, setProduct] = useState([{ product: "", quantity: "" }]);
  useEffect(() => {
    getList();
  }, [product]);
  const getList = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/admin/departmentList"
      );
      setDList(response.data.departmentList);
      setPList(response.data.datas);
      console.table(pList);
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleOnChange = (pro, value) => {
    setData((prev) => ({ ...prev, [pro]: value }));
  };

  const addrow = () => {
    console.table(pList);
    setProduct([...product, { product: "", quantity: "" }]);
  };

  const handleData = (key, field, value) => {
    let products = [...product];

    if (field === "quantity") {
      const selectedProduct = products[key].product;
      const availableProduct = pList.find(
        (item) => item.name === selectedProduct
      );

      if (availableProduct && value > availableProduct.quantityInStock) {
        alert("Quantity exceeds available stock");
        return;
      }
    }

    let exists = product.some(
      (items) => items.product === value && field === "product"
    );
    if (!exists) {
      products[key][field] = value;
      setProduct(products);
    } else {
      products[key][field] = "";
      setProduct(products);
      alert("Product already selected");
    }
  };

  const removeRow = (key) => {
    let products = [...product];
    products.splice(key, 1);
    setProduct(products);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const finalData = {
      ...data,
      products: product,
    };

    try {
      console.log(finalData);
      const response = await axios.post(
        "http://localhost:8000/admin/outgoing",
        finalData
      );
      console.log("Success:", response.data);
      setProduct([{ product: "", quantity: "" }]);
      toast.success("Sucess");
    } catch (error) {
      console.error("Error posting data:", error.message);
      alert("Failed to submit data.");
    }
  };

  useEffect(() => {
    getList();
  }, []);

  return (
    <div className="min-h-screen w-screen bg-white flex flex-col items-center py-8 text-sm">
      <form className="w-full p-4 bg-gray-50" onSubmit={handleSubmit}>
        <h2 className="text-xl  text-gray-900 mb-6 bg-white p-2 ">
          Outgoing Products ↗️
        </h2>

        <div className="mb-4  gap-4 items-center">
          <label className="block text-red-500  mb-2">Department*</label>
          <select
            id="dName"
            value={data.dName}
            onChange={(e) => handleOnChange("dName", e.target.value)}
            className="w-full  px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:border-blue-500 focus:w-full  "
          >
            <option className="text-gray-100">-- Select Department--</option>
            {dList.map((item, index) => (
              <option key={index} value={item.dName}>
                {item.dName}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4   gap-4 items-center">
          <label className="block text-red-500  mb-2">Date* </label>
          <input
            type="date"
            value={data.date}
            onChange={(e) => handleOnChange("date", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:border-blue-500"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2">Purpose</label>
          <input
            type="text"
            value={data.purpose}
            onChange={(e) => handleOnChange("purpose", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:border-blue-500"
            placeholder="Enter Purpose"
          />
        </div>

        <table className="table-auto w-full text-left mb-4 text-xs rounded-t-xl ">
          <thead>
            <tr>
              <th className="text-[1rem] ">Item Table</th>
            </tr>
            <tr className="bg-gray-200">
              <th className="px-4 py-2">ITEM DETAILS</th>
              <th className="px-4 py-2">AVAILABLE QUANTITY</th>
              <th className="px-4 py-2">REQUESTED QUANTITY</th>
              <th className="px-4 py-2"></th>
            </tr>
          </thead>
          <tbody>
            {product.map((item, key) => (
              <tr key={key} className="border-b">
                <td className="px-4 py-2">
                  <select
                    value={item.product}
                    onChange={(e) => handleData(key, "product", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:border-blue-500"
                  >
                    <option value="">-- Select an option --</option>
                    {pList.map((items, idx) => (
                      <option key={idx} value={items.name}>
                        {items.name} (Available: {items.quantityInStock})
                      </option>
                    ))}
                  </select>
                </td>
                <td className="px-4 py-2 text-green-500">
                  {(() => {
                    const foundProduct = pList.find(
                      (prod) => prod.name === item.product
                    );
                    return foundProduct
                      ? `${foundProduct.quantityInStock} ${
                          foundProduct.units || ""
                        }`
                      : "N/A";
                  })()}
                </td>
                <td className="px-4 py-2">
                  <input
                    placeholder="Quantity"
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) =>
                      handleData(key, "quantity", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:border-blue-500"
                  />
                </td>
                <td className="px-4 py-2">
                  <button
                    type="button"
                    onClick={() => removeRow(key)}
                    className="text-red-600 hover:text-red-800 focus:outline-none"
                  >
                    &times;
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex justify-start">
          <button
            type="button"
            onClick={addrow}
            className=" flex items-center gap-1 px-4 py-2 bg-gray-100  rounded "
          >
            <p className="text-white bg-blue-600 rounded-full w-4 h-4 flex items-center justify-center">
              +
            </p>
            <p className="text-gray-600">Add New Row</p>
          </button>
        </div>

        <div className="flex justify-end mt-4">
          <button
            type="submit"
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 focus:outline-none focus:ring focus:ring-green-300"
          >
            Submit
          </button>
        </div>
      </form>
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

export default Outgoing;
