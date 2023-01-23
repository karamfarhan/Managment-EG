import { Fragment } from "react";
import ReactDOM from "react-dom";
import classes from "./ImgModel.module.css";
import { AiOutlineClose } from "react-icons/ai";
import Backdrop from "../backdrop/Backdrop";

export const ImgContainer = ({ imgSrc, closeModelHandler, description }) => {
  return (
    <Fragment>
      <Backdrop hideModel={closeModelHandler} />
      <span onClick={closeModelHandler} className={classes.close}>
        <AiOutlineClose />
      </span>
      <div className={classes["img-container"]}>
        <img src={imgSrc} alt="img" />
        <p>{description}</p>
      </div>
    </Fragment>
  );
};

const ImgModel = ({
  imgSrc,
  closeModelHandler,
  prevImg,
  nextImg,
  i,
  description,
}) => {
  return (
    <Fragment>
      {ReactDOM.createPortal(
        <ImgContainer
          imgSrc={imgSrc}
          closeModelHandler={closeModelHandler}
          nextImg={nextImg}
          prevImg={prevImg}
          i={i}
          description={description}
        />,
        document.getElementById("img_popup")
      )}
    </Fragment>
  );
};

export default ImgModel;
