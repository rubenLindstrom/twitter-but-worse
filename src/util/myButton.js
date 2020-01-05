import React from "react";

// MUI
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";

const myButton = ({
  children,
  onClick,
  btnClassName,
  tipClassName,
  tip,
  placement = "top"
}) => (
  <Tooltip title={tip} className={tipClassName} placement={placement}>
    <IconButton onClick={onClick} className={btnClassName}>
      {children}
    </IconButton>
  </Tooltip>
);

export default myButton;
