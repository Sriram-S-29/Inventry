import axios from 'axios'
import React, { useEffect, useState } from 'react'

function ItemDetails({itemId}) {
    const [item,setItem] = useState({})

    const getItem = async(itemId)=>{
        try{
            const response =  await axios.get("http://localhost:8000/admin/itemDetail",{
                params: {
                  id: itemId, }
                })
                console.log(response.data)
                setItem(response.data)

        }
        catch(error){
            console.log(error)
        }
    }
    useEffect(()=>{
        getItem(itemId)
    },[itemId])

  return (
    <div>{itemId}</div>
  )
}

export default ItemDetails