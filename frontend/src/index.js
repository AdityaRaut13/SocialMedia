/** @format */

import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./index.css";
import App from "./App";
import Auth from "./auth/Auth";
import LoginForm from "./auth/LoginForm";
import Home from "./portal/home/Home";
import UserProfile from "./portal/home/UserProfile";
import Profile from "./portal/profile/Profile";
import Messages from "./portal/messages/Messages";
import MsgPanel from "./portal/messages/MsgPanel";
import CreateAccount from "./auth/CreateAccount";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BrowserRouter basename="/">
      <Routes>
        <Route path="/auth" element={<Auth />}>
          <Route index path={"login"} element={<LoginForm />} />
          <Route path={"createAccount"} element={<CreateAccount />} />
        </Route>
        <Route path="/" element={<App />}>
          <Route index element={<Home />} />
          <Route path="/:username" element={<UserProfile />} />
          <Route path={"profile"} element={<Profile />} />
          <Route path={"messages"} element={<Messages />}>
            <Route path={":username"} element={<MsgPanel />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
