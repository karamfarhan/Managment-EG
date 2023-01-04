import { Fragment } from "react";
import ReactDOM from "react-dom";
import { AiOutlineFileImage } from "react-icons/ai";

import classes from "./SelectImg.module.css";

export const Backdrop = ({ hideImageHandler }) => {
  return <div onClick={hideImageHandler} className={classes.backdrop}></div>;
};

export const ImgSelect = ({
  setDateToday,
  setImgSrc,
  imgSrc,
  setAddImgs,
  hideImageHandler,
}) => {
  let dateNow = new Date().toLocaleString();

  function updateImageDisplay(e) {
    const curFiles = e.target.files;

    if (curFiles.length === 0) {
      return;
    } else {
      setDateToday(dateNow);
      const selectedImages = Array.from(curFiles);

      const imagesArr = selectedImages.map((file) => {
        if (validFileType(file)) {
          return URL.createObjectURL(file);
        }
      });

      setImgSrc((prevImg) => prevImg.concat(imagesArr));
    }
  }
  const fileTypes = [
    "image/apng",
    "image/bmp",
    "image/gif",
    "image/jpeg",
    "image/pjpeg",
    "image/png",
    "image/svg+xml",
    "image/tiff",
    "image/webp",
    "image/x-icon",
  ];

  function validFileType(file) {
    return fileTypes.includes(file.type);
  }

  //add images
  const addImgsHandler = () => {
    setAddImgs(true);
    hideImageHandler();
  };

  const isDisable = imgSrc.length === 0;

  return (
    <Fragment>
      <div className={classes["popup-container"]}>
        <div className={classes.actions}>
          <button className={classes.addImg}>
            <span>
              <AiOutlineFileImage />
            </span>
            تحميل صور
            <input
              type="file"
              accept="image/png, image/jpeg, image/png"
              name="image_uploads"
              multiple
              onChange={updateImageDisplay}
            />
          </button>

          <div className={classes.selectLocation}>
            <select>
              <option value="#" selected hidden>
                أختار الموقع
              </option>
              <option value="#">مستشفي السعودي</option>
              <option value="#">نيو جيزة</option>
              <option value="#">بورسعيد</option>
            </select>
          </div>
        </div>
        <div className={classes.preview}>
          <div>
            {imgSrc &&
              imgSrc.map((el, index) => {
                return (
                  <figure key={index}>
                    <img src={el} alt="f" />
                  </figure>
                );
              })}
          </div>
        </div>

        <div className={classes["action_two"]}>
          <button disabled={isDisable} onClick={addImgsHandler}>
            تأكيد
          </button>
          <button>الغاء</button>
        </div>
      </div>
    </Fragment>
  );
};

const SelectImg = ({
  setDateToday,
  imgSrc,
  setImgSrc,
  hideImageHandler,
  setAddImgs,
}) => {
  return (
    <div>
      {ReactDOM.createPortal(
        <Backdrop hideImageHandler={hideImageHandler} />,
        document.getElementById("backdrop")
      )}
      {ReactDOM.createPortal(
        <ImgSelect
          imgSrc={imgSrc}
          setImgSrc={setImgSrc}
          setDateToday={setDateToday}
          setAddImgs={setAddImgs}
          hideImageHandler={hideImageHandler}
        />,
        document.getElementById("img_popup")
      )}
    </div>
  );
};
export default SelectImg;
