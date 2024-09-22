import React, { useState } from 'react'
import NewDepartment from '../components/NewDepartment'

function Departments() {
  const[visible,setVisible] = useState(false)
  return (
    <div className='w-screen relative '>{visible&&<NewDepartment setVisible={setVisible}/>}
    <button className='bg-green-400 rounded-sm ' onClick={()=>{setVisible(true)}}>open</button>
    </div>
  )
}

export default Departments