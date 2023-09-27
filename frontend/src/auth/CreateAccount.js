import React, { useState } from "react";
import axios from "axios";
import { setToken } from "../portal/utility";
import { useNavigate } from "react-router-dom";
import "./auth.css";
function CreateAccount() {
  const [user, setUser] = useState({ email: "", password: "", username: "" });
  const navigation = useNavigate();
  const onSubmitCall = (event) => {
    axios
      .post(`http://localhost:3000/api/user`, user)
      .then((response) => {
        const token = response.data.token;
        if (!token) {
          alert("Unable to login. Please try after some time.");
          return;
        }
        localStorage.clear();
        setToken("token", token);
        setTimeout(() => {
          navigation("/profile");
        }, 0);
      })
      .catch((err) => {
        console.error(err);
        alert("Oops! some error occured.");
      });
    event.preventDefault();
  };
  const onEmailChange = (event) => {
    setUser((prev) => {
      return {
        ...prev,
        email: event.target.value,
      };
    });
  };
  const onPasswordChange = (event) => {
    setUser((prev) => {
      return {
        ...prev,
        password: event.target.value,
      };
    });
  };
  const onUsernameChange = (event) => {
    setUser((prev) => {
      return {
        ...prev,
        username: event.target.value,
      };
    });
  };
  return (
    <form className="auth-box" onSubmit={onSubmitCall}>
      <label htmlFor="email" style={{ alignSelf: "baseline" }}>
        Email
      </label>
      <input
        autoComplete="true"
        type="email"
        id="email"
        value={user.email}
        onChange={onEmailChange}
      />{" "}
      <br />
      <label htmlFor="username" style={{ alignSelf: "baseline" }}>
        username
      </label>
      <input
        autoComplete="true"
        type="text"
        id="username"
        onChange={onUsernameChange}
        value={user.username}
      />
      <br />
      <label htmlFor="password" style={{ alignSelf: "baseline" }}>
        Password
      </label>
      <input
        autoComplete="true"
        type="password"
        id="password"
        onChange={onPasswordChange}
        value={user.password}
      />
      <br />
      <button type="submit">Sign up</button>
    </form>
  );
}

export default CreateAccount;
