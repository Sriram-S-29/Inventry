import React, { useEffect, useState } from 'react'
import NewVendor from '../components/NewVendor'
import axios from 'axios'

function Vendors() {
    const[newVendor,setNewVendor]= useState(false)
    const [vendorData,setVendorData] = useState([])
    const handleClick=()=>{
        setNewVendor((prev)=>!prev)
    }
    const VendorData = async()=>{
        try{
            const data = await axios.get("http://localhost:8000/admin/vendorList")
            console.log(data.data)
            if(data.data){
                setVendorData(data.data)
            }
        }
        catch(error){
            console.log(error.message)
        }
    }
    useEffect(()=>{
        VendorData()
    },[])
   
  return (
    <div className='flex flex-col w-[100%] relative'>
        {newVendor&&<NewVendor/>}
        {newVendor&&<button className="absolute top-9 right-4 w-10 text-white bg-red-500 rounded-full p-2 hover:bg-red-600" onClick={handleClick}>
          &times;
        </button>}
        <div  className='flex justify-between px-5 border flex-row w-[100%] h-10 items-center'> 
            <p className='font-extrabold text-xl'>Active Vendors</p>
            <div className=''>
                <button className='bg-blue-500 px-3 text-white text-sm py-2 rounded-md   ' onClick={handleClick}>+New</button>
            </div>
        </div>
        <div>
        <table class="min-w-full mt-9 table-auto text-[11px]">
  <thead>
    <tr class="bg-gray-200 text-gray-500">
      <th class="px-6 py-3 text-center font-semibold uppercase">Name</th>
      <th class="px-6 py-3 text-center font-semibold uppercase">Company Name</th>
      <th class="px-6 py-3 text-center font-semibold uppercase">Phone Number</th>
    </tr>
  </thead>
  <tbody>
    {vendorData&&vendorData.map((data)=>{
        return(<tr class="bg-gray-50 hover:bg-gray-100">
            <td class="px-6 py-4 text-center text-blue-500 font-bold ">{data.name}</td>
            <td class="px-6 py-4 text-center">{data.companyName}</td>
            <td class="px-6 py-4 text-center">{data.phno}</td>
          </tr>)
    })}
  </tbody>
</table>


        </div>
    </div>
  )
}

export default Vendors