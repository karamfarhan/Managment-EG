import { Fragment } from "react";
import ReactDOM from "react-dom";
import classes from "./ImgModel.module.css";
import {
  AiOutlineClose,
  AiOutlineDoubleRight,
  AiOutlineDoubleLeft,
} from "react-icons/ai";

export const Backdrop = () => {
  return <div className={classes.backdrop} />;
};

export const ImgContainer = ({
  imgSrc,
  closeModelHandler,
  nextImg,
  prevImg,
  i,
}) => {
  return (
    <Fragment>
      <span onClick={closeModelHandler} className={classes.close}>
        <AiOutlineClose />
      </span>
      <div className={classes["img-container"]}>
        <img src={imgSrc[i]} alt="img" />

        <span className={classes.rightAngle} onClick={nextImg}>
          <AiOutlineDoubleRight />
        </span>
        <span className={classes.leftAngle} onClick={prevImg}>
          <AiOutlineDoubleLeft />
        </span>
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
      {ReactDOM.createPortal(<Backdrop />, document.getElementById("backdrop"))}
    </Fragment>
  );
};

export default ImgModel;
