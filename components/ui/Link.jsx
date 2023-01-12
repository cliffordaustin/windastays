import React from "react";
import PropTypes from "prop-types";
import { Icon } from "@iconify/react";

function StyledLink({ text, titleClass = "" }) {
  return (
    <a href="#" className="link w-fit">
      <span className="mask">
        <div className="link-container">
          <span className={"link-title1 title " + titleClass}>{text}</span>
          <span className={"link-title2 title " + titleClass}>{text}</span>
        </div>
      </span>
      <div className="link-icon">
        <Icon className="icon" icon="material-symbols:arrow-forward-rounded" />
        <Icon className="icon" icon="material-symbols:arrow-forward-rounded" />
      </div>
    </a>
  );
}

StyledLink.propTypes = {};

export default StyledLink;
