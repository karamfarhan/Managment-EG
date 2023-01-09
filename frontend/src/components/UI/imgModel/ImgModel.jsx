import { Fragment } from "react";
import ReactDOM from "react-dom";
import classes from "./ImgModel.module.css";
import {
  AiOutlineClose,
  AiOutlineDoubleRight,
  AiOutlineDoubleLeft,
} from "react-icons/ai";
import Backdrop from "../backdrop/Backdrop";

export const ImgContainer = ({
  imgSrc,
  closeModelHandler,
  nextImg,
  prevImg,
  i,
}) => {
  return (
    <Fragment>
      <Backdrop hideModel={closeModelHandler} />
      <span onClick={closeModelHandler} className={classes.close}>
        <AiOutlineClose />
      </span>
      <div className={classes["img-container"]}>
        <img src={imgSrc} alt="img" />

        {/* <span className={classes.rightAngle} onClick={nextImg}>
          <AiOutlineDoubleRight />
        </span>
        <span className={classes.leftAngle} onClick={prevImg}>
          <AiOutlineDoubleLeft />
        </span> */}
      </div>
    </Fragment>
  );
};

const ImgModel = ({ imgSrc, closeModelHandler, prevImg, nextImg, i }) => {
  return (
    <Fragment>
      {ReactDOM.createPortal(
        <ImgContainer
          imgSrc={imgSrc}
          closeModelHandler={closeModelHandler}
          nextImg={nextImg}
          prevImg={prevImg}
          i={i}
        />,
        document.getElementById("img_popup")
      )}
    </Fragment>
  );
};

export default ImgModel;
