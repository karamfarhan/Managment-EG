import { Fragment, useState, useEffect, useContext } from "react";
import { useQuery } from "react-query";
import ReactDOM from "react-dom";
import { useDispatch, useSelector } from "react-redux";
import { uploadImgs } from "../../../store/upload-img-slice.js";
import AuthContext from "../../../context/Auth-ctx";
import { AiOutlineFileImage, AiOutlineDelete } from "react-icons/ai";
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
  const [selectStores, setSelectStores] = useState([]);
  const [selectedVal, setSelectVal] = useState("");
  const [img, setImg] = useState([]);
  const [description, setDescription] = useState("");
  const authCtx = useContext(AuthContext);
  const { token } = authCtx;
  let dateNow = new Date().toLocaleString();
  const dispatch = useDispatch();

  //form validation
  let formIsValid = false;

  if (selectedVal !== "" && description.trim() !== "") {
    formIsValid = true;
  }
  //select store
  useEffect(() => {
    const selectStore = async () => {
      const res = await fetch("http://127.0.0.1:8000/stores/select_list/", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      setSelectStores(data);
    };
    selectStore();
  }, [token]);

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
  //add images
  const addImgsHandler = () => {
    const obj = {
      token,
      img,
      selectVal: parseInt(selectedVal),
      description: description,
    };
    setAddImgs(true);
    hideImageHandler();
    dispatch(uploadImgs(obj));
    setImgSrc([]);
    setImg([]);
  };

  //delete handler
  const deleteHandler = (el, i) => {
    setImgSrc(imgSrc.filter((e) => e !== el));

    // setImg(delete img[i]);
  };
  const isDisable = imgSrc.length === 0;

  return (
    <Fragment>
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

          <div className={classes.selectLocation}>
            <select
              onChange={(e) => setSelectVal(e.target.value)}
              value={selectedVal}>
              <option value="#" selected hidden>
                أختار الموقع
              </option>
              {selectStores.map((el) => {
                return (
                  <option value={el.pk} key={el.pk}>
                    {el.name}
                  </option>
                );
              })}
            </select>
          </div>
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
            value={description}></textarea>
        </div>

        <div className={classes["action_two"]}>
          <button disabled={!formIsValid} onClick={addImgsHandler}>
            تأكيد
          </button>
          <button onClick={hideImageHandler}>الغاء</button>
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
