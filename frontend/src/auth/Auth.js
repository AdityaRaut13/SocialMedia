import React from "react";
import { Outlet } from "react-router-dom";

function Auth(props) {
  return (
    <div>
      auth
      <Outlet />
    </div>
  );
}

export default Auth;
