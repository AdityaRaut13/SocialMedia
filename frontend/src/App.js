import React, { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import SideBar from "./layout/sidebar";
import "./App.css";
import { getToken } from "./portal/utility";
function App() {
  const navigation = useNavigate();
  useEffect(() => {
    const token = getToken("token");
    if (!token) {
      navigation("/auth/login");
    }
  }, [navigation]);
  return (
    <div id="App">
      <SideBar />
      <div className="container">
        <Outlet />
      </div>
    </div>
  );
}

export default App;
