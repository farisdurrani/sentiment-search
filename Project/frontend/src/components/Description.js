import React from "react";
import PropTypes from "prop-types";

const Description = (props) => {
  const { title, text } = props;
  return (
    <div className="description">
      <h2 className="description-title">{title}</h2>
      <p className="description-text">{text}</p>
    </div>
  );
};

Description.propTypes = {};

export default Description;
