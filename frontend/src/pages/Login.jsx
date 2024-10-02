"use client";
import Sucess from "../../Toast/Sucess";
import Error from "../../Toast/Error";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Login({ setIsAuthenticated }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(email)

    const data = { email, password, name: isLogin ? undefined : name };

    try {
      if (isLogin) {
        console.log(data)
        const response = await axios.post("http://localhost:8000/admin/login",{data});
        console.table(response.data);

        if (response.data.message =='Login successful' || response.data.message== 'Already logged in') {
          console.log('ende')
          const { token } = response.data;
          console.log(token)
          localStorage.setItem("authToken", token);
          console.log("Redirected");
          setIsAuthenticated(true);
          navigate("/dashboard");
        } else {
          setError(true);
        }
      } else {
        const response = await axios.post(
          "http://localhost:8000/admin/register",
          { email, password, name }
        );
        setSuccess(true);
        setIsLogin(true);
      }
    } catch (err) {
      console.error("Error:", err.response ? err.response.data : err.message);
      setError(true);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600 p-4 w-screen">
      <div className="w-full max-w-md bg-white/90 backdrop-blur-sm shadow-lg rounded-lg">
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-center mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-10 w-10 text-blue-600"
            >
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-center text-blue-800">
            Welcome to Inventory
          </h1>
          <p className="text-center text-blue-600">
            {isLogin ? "Login to your account" : "Create a new account"}
          </p>
          <div className="mt-4">
            <div className="flex border-b border-blue-300">
              <button
                className={`flex-1 py-2 text-center ${
                  isLogin
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-blue-400"
                }`}
                onClick={() => setIsLogin(true)}
              >
                Login
              </button>
              <button
                className={`flex-1 py-2 text-center ${
                  !isLogin
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-blue-400"
                }`}
                onClick={() => setIsLogin(false)}
              >
                Sign Up
              </button>
            </div>
            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              {!isLogin && (
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-blue-700"
                  >
                    Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    placeholder="John Doe"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 bg-white border border-blue-300 rounded-md text-sm shadow-sm placeholder-blue-400
                    focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              )}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-blue-700"
                >
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 bg-white border border-blue-300 rounded-md text-sm shadow-sm placeholder-blue-400
                  focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-blue-700"
                >
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 bg-white border border-blue-300 rounded-md text-sm shadow-sm placeholder-blue-400
                  focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                {isLogin ? "Login" : "Sign Up"}
              </button>
            </form>
          </div>
        </div>
        <div className="px-6 py-4 bg-blue-50 rounded-b-lg">
          <p className="text-sm text-center text-blue-700">
            {isLogin ? "Don't have an account?" : "Already have an account?"}
            <button
              className="ml-1 text-sm text-blue-600 hover:text-blue-800 focus:outline-none focus:underline"
              onClick={() => setIsLogin(!isLogin)}
            >
              {isLogin ? "Sign Up" : "Login"}
            </button>
          </p>
        </div>
      </div>
      {success && <Sucess message="New user created successfully" />}
      {error && <Error message="Login or registration failed" />}
    </div>
  );
}
