import jwt_decode from "jwt-decode";
import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import { StaffIcon } from "../../icons/StaffIcon";
import { StoreIcon } from "../../icons/StoreIcon";

//icon
import { FaCarSide } from "react-icons/fa";
import { GiPaddles } from "react-icons/gi";
import classes from "./Sidebar.module.css";
import { GalleryIcon } from "../../icons/GalleryIcon";

const Sidebar = () => {
  const { token } = useSelector((state) => state.authReducer);
  const decoded = jwt_decode(token);

  const { is_superuser, permissions } = decoded;
  console.log(is_superuser);

  const allPermissions = permissions.join(" ");
  return (
    <aside dir="rtl" className={classes.sidebar}>
      <ul>
        {" "}
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
          allPermissions.includes("instrument")) && (
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
        {(is_superuser === true || allPermissions.includes("substance")) && (
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
              <p> المشاريع</p>
            </NavLink>
          </li>
        )}
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
