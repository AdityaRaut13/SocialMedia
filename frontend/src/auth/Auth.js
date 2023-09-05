import React from "react";
import { Outlet } from "react-router-dom";

function Auth(props) {
  return (
    <div className="Auth">
      <Outlet />
    </div>
  );
}

export default Auth;
