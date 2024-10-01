import React, { useEffect, useState } from "react";
import NewDepartment from "../components/NewDepartment";
import axios from "axios";
import DepartmentHistory from "../components/DepartmentHistory";

function Departments() {
  const [visible, setVisible] = useState(false);
  const [query, setQuery] = useState("");
  const [timeCall, setTimeCall] = useState(Date.now());
  const [dept, setDept] = useState([]);
  const [id, setId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getDept = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get("http://localhost:8000/admin/departmentLists", {
        params: { query },
      });
      setDept(response.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      setError("Failed to fetch departments. Please try again.");
    }
  };

  useEffect(() => {
    getDept();
  }, []);

  useEffect(() => {
    let nowCall = Date.now();
    if (nowCall - timeCall > 1500) {
      setTimeCall(nowCall);
      getDept();
    }
  }, [query]);

  return (
    <div className="w-screen max-w-screen mx-auto relative">
      <div className="bg-white shadow-md py-4 px-10 flex items-center gap-4">
        <div className="relative w-full max-w-md">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3">
            <svg
              className="w-5 h-6  text-gray-500"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m21 21-5-5m0-10a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z"
              />
            </svg>
          </div>
          <input
            type="search"
            className="block w-full p-2 pl-10 text-sm border rounded-lg bg-gray-50 border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Search Departments"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <button
          className="bg-blue-600 px-2 py-2 text-white rounded-md hover:bg-blue-700 transition text-sm"
          onClick={() => setVisible(true)}
        >
          Add Department
        </button>
        {visible && <NewDepartment setVisible={setVisible} />}
      </div>

      <div className="flex  mt-6">
        <div className="w-[29%]  bg-white shadow-md rounded-lg p-1">
          <p className="text-lg mb-4">Active Departments</p>
          {loading ? (
            <p>Loading departments...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : (
            <table className="w-full table-auto text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 text-left">Department Name</th>
                  <th className="px-4 py-2 text-left">Contact</th>
                </tr>
              </thead>
              <tbody>
                {dept.length > 0 ? (
                  dept.map((item, key) => (
                    <tr
                      key={key}
                      className="hover:bg-gray-50 cursor-pointer"
                      onClick={() => setId(item._id)}
                    >
                      <td className="px-4 py-2 border-b">{item.dName}</td>
                      <td className="px-4 py-2 border-b">{item.contact}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="2" className="text-center py-4 text-gray-500">
                      No departments found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>

        <div className="w-auto bg-white shadow-md rounded-lg p-">
          <DepartmentHistory id={id} />
        </div>
      </div>
    </div>
  );
}

export default Departments;
