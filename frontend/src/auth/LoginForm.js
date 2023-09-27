import React, { useState } from "react";
import axios from "axios";
import "./auth.css";
import { useNavigate, Link } from "react-router-dom";
import { setToken } from "../portal/utility";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigation = useNavigate();
  const onEmailChange = (event) => {
    setEmail(event.target.value);
  };
  const onPasswordChange = (event) => {
    setPassword(event.target.value);
  };
  const onSubmitCall = (event) => {
    axios
      .post("http://localhost:3000/api/user/login", {
        email,
        password,
      })
      .then((response) => {
        const token = response.data.token;
        if (!token) {
          alert("Unable to login. Please try after some time.");
          return;
        }
        localStorage.clear();
        setToken("token", token);
        setTimeout(() => {
          navigation("/");
        }, 500);
      })
      .catch((error) => {
        console.error(error);
        alert("Oops! Some error occured.");
      });
    event.preventDefault();
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
        value={email}
        onChange={onEmailChange}
      />{" "}
      <br />
      <label htmlFor="password" style={{ alignSelf: "baseline" }}>
        Password
      </label>
      <input
        autoComplete="true"
        type="password"
        id="password"
        onChange={onPasswordChange}
        value={password}
      />
      <br />
      <button type="submit">Sign in</button>
      <p>
        Don't have a account{" ? "}
        <Link to="/auth/createAccount">Create an account</Link>
      </p>
    </form>
  );
}

export default LoginForm;
