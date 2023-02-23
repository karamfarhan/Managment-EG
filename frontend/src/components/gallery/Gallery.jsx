import { Fragment, useState, useEffect } from "react";
import jwt_decode from "jwt-decode";
import { useQuery } from "react-query";
import { AiOutlineFileImage } from "react-icons/ai";
import Bar from "../UI/bars/Bar";
import {
  fetchImgs,
  imageSearchPagination,
  imagesPagination,
  searchImgs,
} from "../../store/upload-img-slice.js";
import { useDispatch, useSelector } from "react-redux";

import ImgModel from "../UI/imgModel/ImgModel";
import SelectImg from "../UI/select_img/SelectImg";
import classes from "./Gallery.module.css";
import Paginate from "../UI/pagination/Paginate";

const Gallery = () => {
  const [imgSrc, setImgSrc] = useState([]);
  const [dateToday, setDateToday] = useState("");
  const [showModel, setShowModel] = useState(false);
  const [addImgs, setAddImgs] = useState(false);
  const { selected_store } = useSelector((state) => state.imageReducer);

  const [searchValue, setSearchValue] = useState("");

  const { token } = useSelector((state) => state.authReducer);
  const decoded = jwt_decode(token);
  const { is_superuser, permissions } = decoded;
  /**************************/

  // pagination details
  const [currentPage, setCurrentPage] = useState(1);
  const [description, setDescription] = useState();
  const { data } = useSelector((state) => state.imageReducer);
  const count =
    data &&
    (is_superuser ||
      permissions.includes("view_image") ||
      permissions.includes("view_mediapack")) &&
    data.count;

  /**************************/

  //image mode state
  const [clickedImg, setClickedImg] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showImgModel, setShowImgModel] = useState(false);
  const dispatch = useDispatch();

  //get all images
  useEffect(() => {
    if (
      searchValue === "" &&
      currentPage === 1 &&
      (permissions.includes("view_image") ||
        permissions.includes("view_mediapack") ||
        is_superuser)
    ) {
      dispatch(fetchImgs(token));
    }
    setSearchValue(selected_store);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, searchValue, currentPage, selected_store]);
  // all imgs
  const { data: all_images } = useSelector((state) => state.imageReducer);
  const allImgs = all_images && all_images.results;
  let result =
    allImgs &&
    allImgs.reduce(function (r, a) {
      r[a.media_pack.created_at] = r[a.media_pack.created_at] || [];
      r[a.media_pack.created_at].push(a);
      return r;
    }, Object.create(null));

  const { data: stores } = useQuery(
    "get/stores",
    async () => {
      try {
        const res = await fetch(`${window.domain}/stores/select_list/`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        return await res.json();
      } catch (err) {
        console.log(err);
      }
    },
    { refetchOnWindowFocus: false }
  );

  console.log(stores);

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

  //search handler
  // const searchHandler = (e) => {
  //   setSearchValue(e.target.value);
  //   setCurrentPage(1);
  // };

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
          description={description}
        />
      )}

      <Bar>
        <div className="toolBar">
          {/* <Search
              placeholder=" أبحث من خلال التاريخ أسم الموقع أو أسم المستخدم"
              onChange={searchHandler}
              value={searchValue}
              searchData={fetchSearchHandler}
            /> */}

          {(permissions.includes("add_image") ||
            permissions.includes("add_mediapack") ||
            is_superuser) && (
            <button className={classes.addImg} onClick={selectImgModelHandler}>
              <span>
                <AiOutlineFileImage />
              </span>
              اضافة صور
            </button>
          )}
        </div>
      </Bar>
      {/* {allImgs &&
        Object.entries(result).length === 0 &&
        (is_superuser ||
          permissions.includes("view_image") ||
          permissions.includes("view_mediapack")) && (
          <h1>لا يوجد مشاريع حاليا</h1>
        )} */}
      <div className={classes.box}>
        {(is_superuser ||
          permissions.includes("view_image") ||
          permissions.includes("view_mediapack")) &&
          stores &&
          stores.map((el, i) => {
            return (
              <div className={classes.content} key={i}>
                {/* <h4> {new Date(el.pk).toLocaleString()} </h4> */}
                <div className={classes.preview}>
                  <h1> {el.address} </h1>
                  {count > 10 &&
                    (is_superuser ||
                      permissions.includes("view_image") ||
                      permissions.includes("view_mediapack")) && (
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
              </div>
            );
          })}
      </div>
    </Fragment>
  );
};
export default Gallery;
