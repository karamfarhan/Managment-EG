import jwt_decode from "jwt-decode";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import classes from "./StoreProjects.module.css";
const StoreProjects = ({ data }) => {
  const [images, setImages] = useState([]);
  const { token } = useSelector((state) => state.authReducer);
  const decoded = jwt_decode(token);
  const { is_superuser, permissions } = decoded;

  //gallery
  useEffect(() => {
    const fetchImg = async () => {
      try {
        const res = await fetch(
          `${window.domain}/images/?search=${data.name}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const images = await res.json();
        setImages(images.results);
      } catch (err) {
        console.log(err);
      }
    };

    if (data !== undefined || data !== null) {
      fetchImg();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);
  let result =
    images &&
    images.reduce(function (r, a) {
      r[a.media_pack.created_at] = r[a.media_pack.created_at] || [];
      r[a.media_pack.created_at].push(a);
      return r;
    }, Object.create(null));
  console.log(result);
  return (
    <div className={classes.box}>
      <div className={classes.content}>
        {/* <h4> {new Date(el.pk).toLocaleString()} </h4> */}
        <div className={classes.preview}>
          {(is_superuser ||
            permissions.includes("view_image") ||
            permissions.includes("view_mediapack")) &&
            images &&
            Object.entries(result).length === 0 &&
            (is_superuser ||
              permissions.includes("view_image") ||
              permissions.includes("view_mediapack")) && (
              <h1>لا يوجد مشاريع حاليا</h1>
            )}

          {Object.entries(result).map(([key, value], i) => {
            return (
              <div key={key}>
                <p> {new Date(key).toDateString()} </p>

                <div className={classes.preview_img}>
                  {value.map((el) => {
                    return (
                      <div>
                        <img src={el.image} alt="projects" />
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}

          {/* {count > 10 &&
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
              )} */}
        </div>
      </div>
      {/* {(is_superuser ||
        permissions.includes("view_image") ||
        permissions.includes("view_mediapack")) &&
        images &&
        images.map((el, i) => {
          return (
   
          );
        })} */}
    </div>
  );
};

export default StoreProjects;
