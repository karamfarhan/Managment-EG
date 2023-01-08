import { Fragment } from "react";
import ReactDOM from "react-dom";
import classes from "./Backdrop.module.css";
const Backdrop = ({ children, hideModel }) => {
  return (
    <Fragment>
      {ReactDOM.createPortal(
        <div onClick={hideModel} className={classes.backdrop}>
          {children}
        </div>,
        document.getElementById("backdrop")
      )}
    </Fragment>
  );
};

export default Backdrop;
