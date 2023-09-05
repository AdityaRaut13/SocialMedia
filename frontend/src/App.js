import React, { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import SideBar from "./layout/sidebar";
import "./App.css";
function App() {
  const navigation = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token || token === "undefined") {
      navigation("/auth/login");
    }
  }, []);
  return (
    <div id="App">
      <SideBar/>
      <Outlet />
    </div>
  );
}

export default App;
