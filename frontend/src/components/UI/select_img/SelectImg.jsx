import { Fragment, useState, useEffect } from "react";
import jwt_decode from "jwt-decode";
import ReactDOM from "react-dom";
import { useDispatch, useSelector } from "react-redux";
import { uploadImgs } from "../../../store/upload-img-slice.js";
import { AiOutlineFileImage } from "react-icons/ai";
import classes from "./SelectImg.module.css";
import Backdrop from "../backdrop/Backdrop.jsx";

export const SelectImg = ({ hideImageHandler, id }) => {
  const [selectStores, setSelectStores] = useState([]);
  const [imgSrc, setImgSrc] = useState([]);
  const [selectedVal, setSelectVal] = useState("");
  const [img, setImg] = useState([]);
  const [description, setDescription] = useState("");
  const { token } = useSelector((state) => state.authReducer);
  const decoded = jwt_decode(token);
  const { is_superuser, permissions } = decoded;
  const dispatch = useDispatch();
  //form validation
  let formIsValid = false;

  if (description.trim() !== "" && img.length > 0) {
    formIsValid = true;
  }

  function updateImageDisplay(e) {
    const curFiles = e.target.files;
    if (curFiles.length === 0) {
      return;
    } else {
      //setDateToday(dateNow);
      const selectedImages = Array.from(curFiles);
      const imagesArr = selectedImages.map((file) => {
        if (validFileType(file)) {
          return URL.createObjectURL(file);
        }
      });
      setImgSrc((prevImg) => prevImg.concat(imagesArr));
      setImg(selectedImages);
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
  const { selected_store } = useSelector((state) => state.imageReducer);

  //authenticated function
  function auth() {
    if (
      is_superuser ||
      permissions.includes("view_image") ||
      permissions.includes("view_mediapack")
    ) {
      return true;
    } else {
      return false;
    }
  }

  //add images
  const addImgsHandler = () => {
    const obj = {
      token,
      img,
      selectVal: parseInt(id),
      description: description,
      search: selected_store,
      authenticated: auth(),
    };

    hideImageHandler();
    dispatch(uploadImgs(obj));
    setImgSrc([]);
    setImg([]);
  };

  return (
    <Backdrop hideModel={hideImageHandler}>
      <div className={classes["popup-container"]} dir="rtl">
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

          {/* <div className={classes.selectLocation}>
            <select
              onChange={(e) => setSelectVal(e.target.value)}
              value={selectedVal}
            >
              <option value="#" selected hidden>
                أختار الموقع
              </option>
              {selectStores.map((el) => {
                return (
                  <option value={el.pk} key={el.pk}>
                    {el.address}
                  </option>
                );
              })}
            </select>
          </div> */}
        </div>
        <div className={classes.preview}>
          <div>
            {imgSrc &&
              imgSrc.map((el, index) => {
                return (
                  <div key={index}>
                    <figure>
                      <img src={el} alt="title" />
                    </figure>
                    <div className={classes.prev}>
                      <p> {index + 1} </p>
                      {/*           <button onClick={() => deleteHandler(el, index)}>
                        {<AiOutlineDelete />}
                </button>*/}
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
        <div className={classes.comment}>
          <textarea
            placeholder="تعليق علي الصور"
            onChange={(e) => setDescription(e.target.value)}
            value={description}
          ></textarea>
        </div>

        <div className={classes["action_two"]}>
          <button disabled={!formIsValid} onClick={addImgsHandler}>
            تأكيد
          </button>
          <button onClick={hideImageHandler}>الغاء</button>
        </div>
      </div>
    </Backdrop>
  );
};

export default SelectImg;
