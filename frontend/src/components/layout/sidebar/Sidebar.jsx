import { NavLink, useNavigate } from "react-router-dom";
import { StaffIcon } from "../../icons/StaffIcon";
import { StoreIcon } from "../../icons/StoreIcon";

//icon
import { FaCarSide } from "react-icons/fa";
import { GiPaddles } from "react-icons/gi";
import classes from "./Sidebar.module.css";
import { GalleryIcon } from "../../icons/GalleryIcon";

const Sidebar = () => {
  return (
    <aside dir="rtl" className={classes.sidebar}>
      <ul>
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
        <li>
          <NavLink
            to="/gallery"
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

            <p> معرض اليوميات</p>
          </NavLink>
        </li>
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
      </ul>
    </aside>
  );
};
export default Sidebar;
