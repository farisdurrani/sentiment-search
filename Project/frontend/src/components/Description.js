import React from "react";
import PropTypes from "prop-types";

const Description = (props) => {
  const { title, text, className, pStyle } = props;
  return (
    <div className={`description ${className}`}>
      <h2 className="description-title">{title}</h2>
      <p
        className={`description-text`}
        style={pStyle}
        dangerouslySetInnerHTML={{ __html: text }}
      />
    </div>
  );
};

Description.propTypes = {};

export default Description;
