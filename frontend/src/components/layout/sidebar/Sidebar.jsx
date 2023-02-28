import jwt_decode from "jwt-decode";
import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import { StaffIcon } from "../../icons/StaffIcon";
import { StoreIcon } from "../../icons/StoreIcon";
import { useTranslation } from "react-i18next";
//icon
import { FaCarSide } from "react-icons/fa";
import { GiPaddles } from "react-icons/gi";
import { BiPurchaseTag } from "react-icons/bi";
import { AiOutlineHome } from "react-icons/ai";
import { TbFileInvoice } from "react-icons/tb";
import classes from "./Sidebar.module.css";

const Sidebar = () => {
  const token = useSelector((state) => state.authReducer.token);
  const decoded = jwt_decode(token);
  const { is_superuser, permissions } = decoded;
  const allPermissions = permissions.join(" ");
<<<<<<< HEAD
  const [t, i18n] = useTranslation();
=======

>>>>>>> c9f6c2a (charts_part_one)
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
<<<<<<< HEAD
            <p>{t("dashboard")} </p>
=======
            <p>Dashboard </p>
>>>>>>> c9f6c2a (charts_part_one)
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
<<<<<<< HEAD
              <p>{t("employees")}</p>
=======
              <p>Employees</p>
>>>>>>> c9f6c2a (charts_part_one)
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
<<<<<<< HEAD
              <p>{t("stores")}</p>{" "}
=======
              <p>Stores</p>
>>>>>>> c9f6c2a (charts_part_one)
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

        {(is_superuser || allPermissions.includes("store")) && (
          <li>
            <NavLink
              to="/purchases"
              style={({ isActive }) => {
                return {
                  background: isActive ? "#edeaea" : "inherit",
                  color: isActive ? "#2150d8" : "#fff",
                };
              }}
            >
              <span>
                <BiPurchaseTag />
              </span>
              <p>{t("purchases")}</p>
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
<<<<<<< HEAD
                <p>{t("substance management")}</p>
=======
                <p>Substance management </p>
>>>>>>> c9f6c2a (charts_part_one)
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
<<<<<<< HEAD
              <p>{t("cars")}</p>
=======
              <p>Cars</p>
>>>>>>> c9f6c2a (charts_part_one)
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
