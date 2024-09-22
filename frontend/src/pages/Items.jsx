import React, { useEffect, useState } from "react";
import NewItem from "../components/NewItem";
import axios from "axios";

function Items() {
  const [newItem, setNewItem] = useState(false);
  const [itemList, setItemList] = useState([]);
  const [list, setList] = useState([]);
  const [query, setQuery] = useState("");
  const handleClick = () => {
    setNewItem((prev) => {
      return !prev;
    });
  };
  const List = async () => {
    try {
      const itemName = await axios.get("http://localhost:8000/admin/itemName");
      setList(itemName.data);
      console.log(itemName.data);
    } catch (error) {
      console.log(error.message);
    }
  }
    const ItemList = async () => {
      try {
        const itemName = await axios.get(
          "http://localhost:8000/admin/itemList",{ params: { query: `${query}` }}
        );

        setItemList(itemName.data);
      } catch (error) {
        console.log(error.message);
      }
    };

  const handleQuery = (e) => {
    setQuery(e.target.value);
    console.log(query);
  };
  useEffect(() => {
    List();
    ItemList();
  }, [query]);
  return (
    <div className="w-screen h-screen">
      {newItem && <NewItem />}
      {newItem && (
        <button
          className="absolute top-9 right-4 w-10 text-white bg-red-500 rounded-full p-2 hover:bg-red-600 z-10"
          onClick={handleClick}
        >
          &times;
        </button>
      )}
      <div className="bg-gray-100 py-2 px-10 flex items-center  relative gap-3  ">
        <div className="absolute inset-y-0  flex items-center b pl-3 pointer-events-none ">
          <svg
            className="w-4 h-4 text-gray-500"
            aria-hidden="true"
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
          className="block p-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
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
        <div className="">
          <button
            className="bg-blue-500 px-3 text-white text-sm py-2 rounded-md   "
            onClick={handleClick}
          >
            +
          </button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table class="min-w-full mt-9 table-auto text-[11px]">
          <thead>
            <tr class="bg-gray-200 text-gray-500">
              <th class="px-6 py-3 text-center font-semibold uppercase">
                PRODUCT NAME
              </th>
              <th class="px-6 py-3 text-center font-semibold uppercase">
                UNIT
              </th>
              <th class="px-6 py-3 text-center font-semibold uppercase">
                DESCRIPTION
              </th>
              <th class="px-6 py-3 text-center font-semibold uppercase">
                QUANTITY IN HAND
              </th>
              <th class="px-6 py-3 text-center font-semibold uppercase">
                PRICE
              </th>
            </tr>
          </thead>
          <tbody>
            {itemList &&
              itemList.map((data) => {
                return (
                  <tr class="bg-gray-50 hover:bg-gray-100">
                    <td class="px-6 py-4 text-center text-blue-500 font-bold ">
                      {data.name}
                    </td>
                    <td class="px-6 py-4 text-center">{data.units}</td>
                    <td class="px-6 py-4 text-center">{data.description}</td>
                    <td class="px-6 py-4 text-center">
                      {data.quantityInStock}
                    </td>
                    <td class="px-6 py-4 text-center">
                      {data.cost}
                    </td>
                    
                    
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Items;
