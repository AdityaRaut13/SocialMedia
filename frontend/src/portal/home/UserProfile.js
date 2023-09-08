/** @format */

import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

function UserProfile() {
  const { username } = useParams();
  const [user, setUser] = useState({});
  useEffect(() => {
    axios
      .get(`http://localhost:3000/api/user/${username}`)
      .then((response) => {
        setUser(response.data);
      })
      .catch((error) => {
        console.error(error);
        alert("Something went wrong");
      });
  }, [username]);
  return (
    <div>
      UserProfile: <br />
      {JSON.stringify(user)}
    </div>
  );
}

export default UserProfile;
