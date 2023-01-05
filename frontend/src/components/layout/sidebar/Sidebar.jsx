import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { StaffIcon } from "../../icons/StaffIcon";
import { StoreIcon } from "../../icons/StoreIcon";

//icon
import { FaCarSide } from "react-icons/fa";
import { AiOutlineLogout } from "react-icons/ai";
import classes from "./Sidebar.module.css";
import { GalleryIcon } from "../../icons/GalleryIcon";
import { authAct } from "../../../store/auth-slice";

const Sidebar = () => {
  const dispatch = useDispatch();

  //logout handler
  const logoutHandler = () => {
    dispatch(authAct.logout());
  };

  return (
    <aside dir="rtl" className={classes.sidebar}>
      <ul>
        <li>
          <NavLink
            to="/staff"
            style={({ isActive }) => {
              return {
                background: isActive ? "#fff" : "inherit",
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
        <li>
          <NavLink
            to="/store"
            style={({ isActive }) => {
              return {
                background: isActive ? "#fff" : "inherit",
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
        <li>
          <NavLink
            to="/gallery"
            style={({ isActive }) => {
              return {
                background: isActive ? "#fff" : "inherit",
                color: isActive ? "#2150d8" : "#fff",
                borderRadius: isActive ? "43px 15px 13px 0px" : "inherit",
              };
            }}>
            <span>
              <GalleryIcon />
            </span>

            <p> معرض اليوميات</p>
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/cars"
            style={({ isActive }) => {
              return {
                background: isActive ? "#fff" : "inherit",
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
      </ul>

      <button className={classes.logoutBtn} onClick={logoutHandler}>
        تسجيل خروج <AiOutlineLogout />
      </button>
    </aside>
  );
};
export default Sidebar;
