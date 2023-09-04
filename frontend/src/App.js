import React, { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
function App() {
  const navigation = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token || token === "undefined") {
      navigation("/auth/login");
    }
  }, []);
  return (
    <div>
      App
      <Outlet />
    </div>
  );
}

export default App;
