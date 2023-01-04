import { Fragment, useState } from "react";
import { AiOutlineFileImage } from "react-icons/ai";
import SelectImg from "../UI/select_img/SelectImg";
import classes from "./Gallery.module.css";

const Gallery = () => {
  const [imgSrc, setImgSrc] = useState([]);
  const [dateToday, setDateToday] = useState("");
  const [showModel, setShowModel] = useState(false);
  const [addImgs, setAddImgs] = useState(false);

  //show model
  const selectImgModelHandler = () => {
    setShowModel(true);
  };

  //hide model
  const hideImageHandler = () => {
    setShowModel(false);
  };

  return (
    <Fragment>
      {showModel && (
        <SelectImg
          setDateToday={setDateToday}
          imgSrc={imgSrc}
          setImgSrc={setImgSrc}
          hideImageHandler={hideImageHandler}
          setAddImgs={setAddImgs}
        />
      )}
      <div>
        <button className={classes.addImg} onClick={selectImgModelHandler}>
          <span>
            <AiOutlineFileImage />
          </span>
          اضافة صور
        </button>

        <div className={classes.preview}>
          {dateToday !== "" && addImgs && (
            <p className={classes.date}> {dateToday} </p>
          )}

          <div>
            {!showModel &&
              imgSrc &&
              addImgs &&
              imgSrc.map((el, index) => {
                return (
                  <>
                    <figure key={index}>
                      <img src={el} alt="f" />
                    </figure>
                  </>
                );
              })}
          </div>
        </div>
      </div>
    </Fragment>
  );
};
export default Gallery;
