import { Fragment, useState } from "react";
import { AiOutlineFileImage } from "react-icons/ai";
import Bar from "../UI/bars/Bar";
import ImgModel from "../UI/imgModel/ImgModel";
import SelectImg from "../UI/select_img/SelectImg";
import classes from "./Gallery.module.css";

const Gallery = () => {
  const [imgSrc, setImgSrc] = useState([]);
  const [dateToday, setDateToday] = useState("");
  const [showModel, setShowModel] = useState(false);
  const [addImgs, setAddImgs] = useState(false);

  //image mode state
  const [clickedImg, setClickedImg] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showImgModel, setShowImgModel] = useState(false);
  console.log(currentIndex);
  //show model
  const selectImgModelHandler = () => {
    setShowModel(true);
  };

  //hide model
  const hideImageHandler = () => {
    setShowModel(false);
  };

  //selected image
  const selectedImgHandler = (i, src) => {
    const allImgSrc = [src];
    setClickedImg((prev) => [...prev, ...allImgSrc]);
    setCurrentIndex(i);
    setShowImgModel(true);
    console.log(clickedImg);
  };

  //close img model
  const closeModelHandler = () => {
    setShowImgModel(false);
  };

  //next img
  const nextImg = () => {
    setCurrentIndex((prevInx) => prevInx + 1);
  };

  //prev img
  const prevImg = () => {
    if (currentIndex < 0) return;
    setCurrentIndex((prevInx) => prevInx - 1);
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

      {showImgModel && (
        <ImgModel
          i={currentIndex}
          imgSrc={clickedImg}
          closeModelHandler={closeModelHandler}
          nextImg={nextImg}
          prevImg={prevImg}
        />
      )}

      <Bar>
        <button className={classes.addImg} onClick={selectImgModelHandler}>
          <span>
            <AiOutlineFileImage />
          </span>
          اضافة صور
        </button>
      </Bar>
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
                  <figure
                    key={index}
                    onClick={() => selectedImgHandler(index, el)}>
                    <img src={el} alt="f" />
                  </figure>
                </>
              );
            })}
        </div>
      </div>
    </Fragment>
  );
};
export default Gallery;
