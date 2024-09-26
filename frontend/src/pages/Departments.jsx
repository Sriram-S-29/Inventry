import React, { useEffect, useState } from "react";
import NewDepartment from "../components/NewDepartment";
import axios from "axios";

function Departments() {
  const [visible, setVisible] = useState(false);
  const [query, setQuery] = useState("");
  const [timeCall, setTimeCall] = useState(Date.now());
  const getDept = async (req, res) => {
    try {
      const response = await axios.get(
        " http://localhost:8000/admin/departmentLists",
        {
          params: { query: `${query}` },
        }
      );
      console.log("hai");
      console.table(response);
    } catch (error) {
      console.log(error.message);
    }
  };
  useEffect(() => {
    let nowCall = Date.now();
    if (nowCall-timeCall  > 1500) {
      setTimeCall(nowCall);
      getDept();
    }
  }, [query]);
  return (
    <div className="w-screen max-w-screen mx-auto relative ">
      <div className="bg-gray-100 py-2 px-10 flex items-center relative gap-3">
        <div className="absolute inset-y-0 flex items-center pl-3 pointer-events-none">
          <svg
            className="w-4 h-4 text-gray-500"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 20 20"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
            />
          </svg>
        </div>

        <input
          type="search"
          className="block p-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 focus:outline-none w-full"
          name="query"
          id="query"
          placeholder="Search in Items ( / )"
          onChange={(e) => {
            setQuery(e.target.value);
          }}
        />
        {/* <datalist id="item-list">
          {list.map((item, index) => (
            <option key={index} value={item.name} />
          ))}
        </datalist> */}
        {visible && <NewDepartment setVisible={setVisible} />}
        <button
          className="bg-blue-500 px-3 text-white text-sm py-2 rounded-md"
          onClick={() => {
            setVisible(true);
          }}
        >
          +
        </button>
      </div>
    </div>
  );
}

export default Departments;
