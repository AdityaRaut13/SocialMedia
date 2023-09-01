import React, { useState } from "react";
import axios from "axios";
import "./App.css";
function App() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const onUsernameChange = (event) => {
    if (!/[A-Za-z_ 0-9]*/.test(event.target.value)) {
      return;
    }
    setUsername(event.target.value);
  };
  const onPasswordChange = (event) => {
    setPassword(event.target.value);
  };
  const onSubmitCall = async (event) => {
    try {
      const res = await axios.post("http://localhost:3000/api/user/login", {
        username,
        password,
      });
      console.log(res);
    } catch (err) {
      console.log(err);
    }
    event.preventDefault();
  };
  return (
    <div className="App">
      <form id="login" onSubmit={onSubmitCall}>
        <label for="username" style={{ alignSelf: "baseline" }}>
          Username
        </label>
        <input
          type="text"
          name="username"
          value={username}
          onChange={onUsernameChange}
        />{" "}
        <br />
        <label for="password" style={{ alignSelf: "baseline" }}>
          Password
        </label>
        <input
          type="password"
          name="password"
          onChange={onPasswordChange}
          value={password}
        />
        <br />
        <button type="submit">Sign in</button>
      </form>
    </div>
  );
}

export default App;
