import { useState } from "react";
import jwt_decode from "jwt-decode";
import { useQuery } from "react-query";
import { useSelector, useDispatch } from "react-redux";
import { selectedAddress } from "../../../store/upload-img-slice";
import { NavLink, useLocation } from "react-router-dom";
import { StaffIcon } from "../../icons/StaffIcon";
import { StoreIcon } from "../../icons/StoreIcon";

//icon
import { FaCarSide } from "react-icons/fa";
import { GiPaddles } from "react-icons/gi";
import classes from "./Sidebar.module.css";
import { GalleryIcon } from "../../icons/GalleryIcon";
import { searchImgs } from "../../../store/upload-img-slice";

const Sidebar = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const [showGalleries, setShowGalleries] = useState(
    location.pathname === "/gallery" ? true : false
  );
  const [activeClass, setActiveClass] = useState(null);
  const { token } = useSelector((state) => state.authReducer);
  const decoded = jwt_decode(token);
  const { is_superuser, permissions } = decoded;
  const allPermissions = permissions.join(" ");

  const selectedStoreHandler = (e, id) => {
    const obj = {
      search: e.target.innerText,
      token,
    };

    dispatch(selectedAddress(e.target.innerText));
    dispatch(searchImgs(obj));
    setActiveClass(id);
  };
  console.log(is_superuser);

  const { data } = useQuery(
    "get/stores",
    async () => {
      try {
        const res = await fetch("http://127.0.0.1:8000/stores/select_list/", {
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

  return (
    <aside dir="rtl" className={classes.sidebar}>
      <ul>
        {(is_superuser === true ||
          allPermissions.includes("employee") ||
          allPermissions.includes("insurance")) && (
          <li>
            <NavLink
              to="/staff"
              style={({ isActive }) => {
                return {
                  background: isActive ? "#edeaea" : "inherit",
                  color: isActive ? "#2150d8" : "#fff",
                  borderRadius: isActive ? "43px 15px 13px 0px" : "inherit",
                };
              }}>
              <span>
                <StaffIcon />
              </span>
              <p>الموظفين</p>
            </NavLink>
          </li>
        )}
        {(is_superuser || allPermissions.includes("store")) && (
          <li>
            <NavLink
              to="/store"
              style={({ isActive }) => {
                return {
                  background: isActive ? "#edeaea" : "inherit",
                  color: isActive ? "#2150d8" : "#fff",
                  borderRadius: isActive ? "43px 15px 13px 0px" : "inherit",
                };
              }}>
              <span>
                <StoreIcon />
              </span>
              <p>المخازن</p>
            </NavLink>
          </li>
        )}
        {(is_superuser ||
          allPermissions.includes("substance") ||
          allPermissions.includes("instrument")) &&
          (!allPermissions.includes("invoice") ||
            !allPermissions.includes("store")) && (
            <li>
              <NavLink
                to="/create_subs"
                style={({ isActive }) => {
                  return {
                    background: isActive ? "#edeaea" : "inherit",
                    color: isActive ? "#2150d8" : "#fff",
                    borderRadius: isActive ? "43px 15px 13px 0px" : "inherit",
                  };
                }}>
                <span>
                  <GiPaddles />
                </span>
                <p>ادارة الموارد</p>
              </NavLink>
            </li>
          )}
        {(is_superuser === true || allPermissions.includes("media")) && (
          <li>
            <NavLink
              to="/gallery"
              onClick={() => dispatch(selectedAddress(""))}
              style={({ isActive }) => {
                return {
                  background: isActive ? "#edeaea" : "inherit",
                  color: isActive ? "#2150d8" : "#fff",
                  borderRadius: isActive ? "43px 15px 13px 0px" : "inherit",
                };
              }}>
              <span>
                <GalleryIcon />
              </span>
              <p> المشاريع</p>
            </NavLink>

            <ul className={showGalleries === true ? classes.active : ""}>
              {data &&
                data.map((el) => {
                  return (
                    <li
                      className={activeClass === el.pk ? classes.active : ""}
                      onClick={(e) => selectedStoreHandler(e, el.pk)}
                      key={el.pk}>
                      {el.address}
                    </li>
                  );
                })}
            </ul>
          </li>
        )}
        {(is_superuser === true || allPermissions.includes("car")) && (
          <li>
            <NavLink
              to="/cars"
              style={({ isActive }) => {
                return {
                  background: isActive ? "#edeaea" : "inherit",
                  color: isActive ? "#2150d8" : "#fff",
                  borderRadius: isActive ? "43px 15px 13px 0px" : "inherit",
                };
              }}>
              <span>
                <FaCarSide />
              </span>
              <p>السيارات</p>
            </NavLink>
          </li>
        )}
      </ul>
    </aside>
  );
};
export default Sidebar;
