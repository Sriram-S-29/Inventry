import React, { useEffect, useRef, useState } from "react";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

function Home() {
  const inputbox = useRef();
  const c = () => {
    inputbox.current.focus();
    console.log(inputbox.current.value);


  };


  return (
    <div className="w-screen  h-screen">
      <div>
        <input ref={inputbox}></input>
        <button onClick={c}>Click</button>
        <Skeleton circle={10} />
      </div>
    </div>
  );
}

export default Home;
