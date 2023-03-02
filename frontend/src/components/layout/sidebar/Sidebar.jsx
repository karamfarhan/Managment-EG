import jwt_decode from "jwt-decode";
import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import { StaffIcon } from "../../icons/StaffIcon";
import { StoreIcon } from "../../icons/StoreIcon";
import { useTranslation } from "react-i18next";
//icon
import { FaCarSide } from "react-icons/fa";
import { GiPaddles } from "react-icons/gi";
import { AiOutlineHome } from "react-icons/ai";
import { TbFileInvoice } from "react-icons/tb";
import classes from "./Sidebar.module.css";

const Sidebar = () => {
  const token = useSelector((state) => state.authReducer.token);
  const decoded = jwt_decode(token);
  const { is_superuser, permissions } = decoded;
  const allPermissions = permissions.join(" ");
  const [t, i18n] = useTranslation();
  return (
    <aside className={classes.sidebar}>
      <ul>
        <li>
          <NavLink
            to="/main"
            style={({ isActive }) => {
              return {
                background: isActive ? "#edeaea" : "inherit",
                color: isActive ? "#2150d8" : "#fff",
              };
            }}
          >
            <span>
              <AiOutlineHome />
            </span>
            <p>{t("dashboard")} </p>
          </NavLink>
        </li>
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
                };
              }}
            >
              <span>
                <StaffIcon />
              </span>
              <p>{t("employees")}</p>
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
                };
              }}
            >
              <span>
                <StoreIcon />
              </span>
              <p>{t("stores")}</p>{" "}
            </NavLink>
          </li>
        )}

        {(is_superuser || allPermissions.includes("store")) && (
          <li>
            <NavLink
              to="/invoice"
              style={({ isActive }) => {
                return {
                  background: isActive ? "#edeaea" : "inherit",
                  color: isActive ? "#2150d8" : "#fff",
                };
              }}
            >
              <span>
                <TbFileInvoice />
              </span>
              <p>{t("invoices")}</p>
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
                  };
                }}
              >
                <span>
                  <GiPaddles />
                </span>
                <p>{t("substance management")}</p>
              </NavLink>
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
                };
              }}
            >
              <span>
                <FaCarSide />
              </span>
              <p>{t("cars")}</p>
            </NavLink>
          </li>
        )}
        {/* {(is_superuser === true || allPermissions.includes("media")) && (
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

            {(is_superuser ||
              permissions.includes("view_image") ||
              permissions.includes("view_mediapack")) && (
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
            )}
          </li>
        )} */}
      </ul>
    </aside>
  );
};
export default Sidebar;
