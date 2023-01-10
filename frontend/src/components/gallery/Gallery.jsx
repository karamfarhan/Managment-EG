import { Fragment, useState, useEffect, useContext } from "react";
import { AiOutlineFileImage } from "react-icons/ai";
import Bar from "../UI/bars/Bar";
import { fetchImgs } from "../../store/upload-img-slice.js";
import AuthContext from "../../context/Auth-ctx";
import { useDispatch, useSelector } from "react-redux";

import ImgModel from "../UI/imgModel/ImgModel";
import Notification from "../UI/notification/Notification";
import SelectImg from "../UI/select_img/SelectImg";
import classes from "./Gallery.module.css";
import Paginate from "../UI/pagination/Paginate";

const Gallery = () => {
  const [imgSrc, setImgSrc] = useState([]);
  const [dateToday, setDateToday] = useState("");
  const [showModel, setShowModel] = useState(false);
  const [addImgs, setAddImgs] = useState(false);
  const authCtx = useContext(AuthContext);

  const { token } = authCtx;



  /**************************/

// pagination details
const [currentPage, setCurrentPage] = useState(1)
const itemsPerPage = 10;
const {data} =  useSelector((state)=> state.imageReducer)
const {count} = data !== null && data






  /**************************/











  //image mode state
  const [clickedImg, setClickedImg] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showImgModel, setShowImgModel] = useState(false);
  const dispatch = useDispatch();

  //get all images
  useEffect(() => {
    const obj = {
      token,
    };
    dispatch(fetchImgs(obj));
  }, []);

  // all imgs
  const { data: all_images } = useSelector((state) => state.imageReducer);
  const allImgs = all_images && all_images.results;



  //mutate data


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
    setClickedImg(src);
    // setCurrentIndex(i);
    setShowImgModel(true);
    // setClickedImg(src);
    setCurrentIndex(i);
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
     

        <div>
          {!showModel &&
            allImgs &&
            allImgs.map((el, index) => {
              return (
                <div className ={classes.fig} key={index} onClick={() => selectedImgHandler(index, el.image)}>
                  <figure >
                    <img src={el.image} alt="f" />
                  </figure>
                  <div>

                  <h3> {el.media_pack.store} </h3>
                  <p className = {classes.uploaded}> تم رفع الصور عن طريق : <span>{el.media_pack.created_by} </span></p>
                  <p className = {classes.description_parag}> وصف الصورة : <span>{el.media_pack.alt_text}</span> </p>
                  <p className = {classes.date}> {new Date(el.media_pack.created_at).toLocaleString()} </p>

                  </div>
                </div>
              );
            })}
        </div>
       {itemsPerPage >= 10 &&  <Paginate currentPage = {currentPage} setCurrentPage = {setCurrentPage} itemsPerPage = {itemsPerPage} count = {count}  />}
      </div>
    </Fragment>
  );
};
export default Gallery;
