import { useState, useEffect } from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import "./App.css";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Nav from "./components/Nav";
import Vendors from "./pages/Vendors";
import Items from "./pages/Items";
import Purchase from "./pages/Purchase";
import Departments from "./pages/Departments";
import Outgoing from "./pages/Outgoing";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    setIsAuthenticated(!!token);
  }, []);

  return (
    <BrowserRouter>
      <div className="w-screen h-screen flex flex-row">
        {isAuthenticated&&<Nav />}
        <Routes>
          <Route
            path="/"
            element={isAuthenticated ? <Navigate to="/home" /> : <Login setIsAuthenticated={setIsAuthenticated} />}
          />
          <Route
            path="/home"
            element={isAuthenticated ? <Home /> : <Navigate to="/" />}
          />
          <Route path="/vendors" element={isAuthenticated ? <Vendors /> : <Navigate to="/" />} />
          <Route path="/items" element={isAuthenticated ? <Items /> : <Navigate to="/" />} />
          <Route path="/newPurchase" element={isAuthenticated ? <Purchase /> : <Navigate to="/" />} />
          <Route path="/departments" element={isAuthenticated ? <Departments/> : <Navigate to="/" />} />
          <Route path="/outgoing" element={isAuthenticated ? <Outgoing/> : <Navigate to="/" />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
