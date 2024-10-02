import React, { useEffect, useRef, useState } from "react";


import "react-loading-skeleton/dist/skeleton.css";
import Notification from "../components/Notification";

function Home() {
 


  return (
    <div className="w-screen  h-screen flex flex-col ">
      <div className="w-full bg-slate-300 flex justify-between">
        <input></input>
        <Notification/>

      </div>
      <div>
        remaing
      </div>
     
    </div>
  );
}

export default Home;
