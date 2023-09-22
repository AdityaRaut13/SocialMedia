import React from "react";
import { useParams } from "react-router-dom";

function MsgPanel() {
  const { username } = useParams();
  return <div>{username}</div>;
}

export default MsgPanel;
