import React, { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

function NewDepartment({ setVisible }) {
  const [newDept, setNewDept] = useState({
    dName: "",
    contact: "",
  });

  const post = async () => {
    try {
      const response = await axios.post(
        "http://localhost:8000/admin/newDepartment",
        { newDept }
      );
      if (response) {
        toast.success("Created Succesfully");
        setNewDept({
          dName: "",
          contact: "",
        });
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className="flex items-center justify-center absolute inset-0 bg-gray-800 bg-opacity-50">
      <div className="w-full max-w-md p-6 bg-white shadow-lg rounded-lg animate-fadeInDown flex-col flex justify-center items-center">
        <button
          className="bg-red-500 absolute top-2 right-2 text-white p-2 rounded-full w-10 h-10 flex items-center justify-center"
          onClick={() => setVisible(false)}
        >
          &times;
        </button>
        <h1 className="text-2xl text-blue-600 mb-4">New Department</h1>
        <form className="flex flex-col gap-6 w-full" >
          <div className="flex flex-col">
            <label className="text-gray-600 font-medium mb-2">
              Department Name:
            </label>
            <input
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
              type="text"
              placeholder="Enter department name"
              value={newDept.dName}
              onChange={(e) =>
                setNewDept((prev) => ({ ...prev, dName: e.target.value }))
              }
              required
            />
          </div>
          <div className="flex flex-col">
            <label className="text-gray-600 font-medium mb-2">Contact:</label>
            <input
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
              type="text"
              placeholder="Enter contact details"
              value={newDept.contact}
              onChange={(e) =>
                setNewDept((prev) => ({ ...prev, contact: e.target.value }))
              }
              required
            />
          </div>
          <button type="button" className="w-full bg-blue-600 text-white py-2 rounded-md font-semibold hover:bg-blue-700 transition duration-200" onClick={post}>
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

export default NewDepartment;
