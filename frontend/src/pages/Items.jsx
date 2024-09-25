import React, { useEffect, useState } from "react";
import NewItem from "../components/NewItem";
import axios from "axios";
import ItemDetails from "../components/ItemDetails";

function Items() {
  const [newItem, setNewItem] = useState(false);
  const [itemList, setItemList] = useState([]);
  const [list, setList] = useState([]);
  const [query, setQuery] = useState("");
  const [itemId, setItemId] = useState("");


  const handleId = (id) => {
    setItemId(id);
  };

 
  const handleClick = () => {
    setNewItem((prev) => !prev);
  };


  const List = async () => {
    try {
      const itemName = await axios.get("http://localhost:8000/admin/itemName");
      setList(itemName.data);
    } catch (error) {
      console.log(error.message);
    }
  };

 
  const ItemList = async () => {
    try {
      const itemName = await axios.get("http://localhost:8000/admin/itemList", {
        params: { query: `${query}` },
      });
      setItemList(itemName.data);
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleQuery = (e) => {
    setQuery(e.target.value);
  };

  useEffect(() => {
    List();
    ItemList();
  }, [query]);

  return (
    <div className="w-screen max-w-screen mx-auto">
      {newItem && <NewItem />}
      {newItem && (
        <button
          className="absolute top-9 right-4 w-10 text-white bg-red-500 rounded-full p-2 hover:bg-red-600 z-10"
          onClick={handleClick}
        >
          &times;
        </button>
      )}

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
          list="item-list"
          onChange={handleQuery}
        />
        <datalist id="item-list">
          {list.map((item, index) => (
            <option key={index} value={item.name} />
          ))}
        </datalist>

        <button
          className="bg-blue-500 px-3 text-white text-sm py-2 rounded-md"
          onClick={handleClick}
        >
          +
        </button>
      </div>

      <div className="flex text-sm mt-4">
        
        <div className="w-[30%] bg-white p-6 overflow-y-auto min-w-[23%]">
          <div className="flex items-center mb-4">
            <h2 className="text-sm font-semibold">Active Items</h2>
          </div>
          {itemList.map((item, index) => (
            <div
              key={index}
              className="flex justify-between items-center py-2 border-b hover:bg-gray-100 cursor-pointer"
              onClick={() => handleId(item._id)}
            >
              <label className="flex font-medium text-gray-700 items-center text-xs">
                {item.name}
              </label>
              <span className="text-gray-500">
                {item.quantityInStock} {item.units}
              </span>
            </div>
          ))}
        </div>

        {/* Item Details on the right, taking up the remaining width */}
        <div className="flex-grow bg-white p-6">
          <ItemDetails itemId={itemId} />
        </div>
      </div>
    </div>
  );
}

export default Items;
