import React from "react";
import { Link } from "react-router-dom";

const LinkButton = (props) => {
  const {
    to,
    buttonClassname,
    text
  } = props;
  return (
    <button className={buttonClassname}>
      <Link to={to}>{text}</Link>
    </button>
  )
}

export default LinkButton;