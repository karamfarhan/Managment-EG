import { Fragment, useState, useEffect, useContext } from "react";
import { useQuery } from "react-query";
import ReactDOM from "react-dom";
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
  const [img, setImg] = useState([]);
  const authCtx = useContext(AuthContext);
  const { token } = authCtx;
  let dateNow = new Date().toLocaleString();
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
  console.log(img);

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
  //send images
  const sendImgs = async () => {
    const formdata = new FormData();

    for (let i = 0; i < selectStores.length; i++) {
      formdata.append("store", selectStores[i].pk);
    }
    for (let i = 0; i < img.length; i++) {
      formdata.append("images", img[i]);
    }

    formdata.append("alt_text", "dds");
    const res = await fetch("http://127.0.0.1:8000/images/", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formdata,
    });
    const data = await res.json();
    console.log(data);
  };

  const { isLoading, refetch, error, data } = useQuery("images", sendImgs, {
    refetchOnWindowFocus: false,
    enabled: false,
  });
  console.log(data);

  //add images
  const addImgsHandler = () => {
    setAddImgs(true);
    hideImageHandler();
    refetch();
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
              {selectStores.map((el) => {
                return (
                  <option value={el.name} key={el.pk}>
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
                      <button
                        onClick={() =>
                          setImgSrc(imgSrc.filter((e) => e !== el))
                        }>
                        {<AiOutlineDelete />}
                      </button>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>

        <div className={classes["action_two"]}>
          <button disabled={isDisable} onClick={addImgsHandler}>
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
