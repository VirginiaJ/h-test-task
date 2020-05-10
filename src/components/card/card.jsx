import React from "react";
import "./card.css";

const card = props => {
  return (
    <div className="card">
      some content
      <button onClick={props.clicked}>Close</button>
    </div>
  );
};

export default card;
