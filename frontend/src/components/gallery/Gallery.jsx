import { Fragment, useState, useEffect, useContext } from "react";
import { AiOutlineFileImage } from "react-icons/ai";
import Bar from "../UI/bars/Bar";
import {
  fetchImgs,
  imageSearchPagination,
  imagesPagination,
  searchImgs,
} from "../../store/upload-img-slice.js";
import AuthContext from "../../context/Auth-ctx";
import { useDispatch, useSelector } from "react-redux";

import ImgModel from "../UI/imgModel/ImgModel";
import SelectImg from "../UI/select_img/SelectImg";
import classes from "./Gallery.module.css";
import Paginate from "../UI/pagination/Paginate";
import Search from "../UI/search/Search";

const Gallery = () => {
  const [imgSrc, setImgSrc] = useState([]);
  const [dateToday, setDateToday] = useState("");
  const [showModel, setShowModel] = useState(false);
  const [addImgs, setAddImgs] = useState(false);

  const [searchValue, setSearchValue] = useState("");

  const authCtx = useContext(AuthContext);

  const { token } = authCtx;

  /**************************/

  // pagination details
  const [currentPage, setCurrentPage] = useState(1);
  const [description, setDescription] = useState();
  const { data } = useSelector((state) => state.imageReducer);
  const { count } = data !== null && data;

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
    if (searchValue === "" && currentPage === 1) {
      dispatch(fetchImgs(obj));
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, searchValue, currentPage]);

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
    setImgSrc([]);
  };

  //selected image
  const selectedImgHandler = (i, src, des) => {
    setClickedImg(src);
    // setCurrentIndex(i);
    setShowImgModel(true);
    setDescription(des);
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

  //search handler
  const searchHandler = (e) => {
    setSearchValue(e.target.value);
    setCurrentPage(1);
  };

  //fetch search data
  const fetchSearchHandler = () => {
    const obj = {
      token,
      search: searchValue,
    };
    dispatch(searchImgs(obj));
  };
  //search pagnation
  const searchPagination = (obj) => {
    dispatch(imageSearchPagination(obj));
  };
  //pagination

  const paginationFun = (obj) => {
    dispatch(imagesPagination(obj));
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
          description={description}
        />
      )}

      <Bar>
        <div className="toolBar">
          <Search
            placeholder=" أبحث من خلال التاريخ أسم الموقع أو أسم المستخدم"
            onChange={searchHandler}
            value={searchValue}
            searchData={fetchSearchHandler}
          />
          <button className={classes.addImg} onClick={selectImgModelHandler}>
            <span>
              <AiOutlineFileImage />
            </span>
            اضافة صور
          </button>
        </div>
      </Bar>

      {allImgs && allImgs.length === 0 && (
        <p className="validation-msg">لا يوجد صور في اليوميات</p>
      )}
      <div className={classes.preview}>
        <div>
          {!showModel &&
            allImgs &&
            allImgs.map((el, index) => {
              return (
                <div
                  className={classes.fig}
                  key={index}
                  onClick={() =>
                    selectedImgHandler(index, el.image, el.media_pack.alt_text)
                  }>
                  <div>
                    <figure>
                      <img src={el.image} alt="f" />
                    </figure>
                    <div>
                      <h3> {el.media_pack && el.media_pack.store_name} </h3>
                      <p className={classes.uploaded}>
                        تم رفع الصور عن طريق :
                        <span>
                          {el.media_pack && el.media_pack.created_by}{" "}
                        </span>
                      </p>

                      <p className={classes.date}>
                        {new Date(
                          el.media_pack && el.media_pack.created_at
                        ).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
        {count > 10 && (
          <Paginate
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            count={count}
            paginationFun={paginationFun}
            search={searchValue}
            searchFn={fetchSearchHandler}
            searchPagination={searchPagination}
          />
        )}
      </div>
    </Fragment>
  );
};
export default Gallery;
