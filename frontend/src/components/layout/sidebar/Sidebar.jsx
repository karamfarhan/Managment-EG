import { NavLink } from "react-router-dom";

import { StaffIcon } from "../../icons/StaffIcon";
import { StoreIcon } from "../../icons/StoreIcon";

//icon
import { FaCarSide } from "react-icons/fa";

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
                background: isActive ? "#9291db" : "inherit",
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
                background: isActive ? "#9291db" : "inherit",
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
                background: isActive ? "#9291db" : "inherit",
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
                background: isActive ? "#9291db" : "inherit",
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
