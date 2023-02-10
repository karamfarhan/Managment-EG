import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import jwt_decode from "jwt-decode";

import { AiFillSetting, AiOutlineLogout } from "react-icons/ai";
import classes from "./Header.module.css";
import { logout } from "../../../store/auth-slice";

export const Header = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const [signoutBtn, setSignoutBtn] = useState(false);
  const { token } = useSelector((state) => state.authReducer);
  const decoded = jwt_decode(token);
  const { is_superuser, permissions } = decoded;
  //logout handler
  const logoutHandler = () => {
    dispatch(logout());
  };
  // signout btn
  const toggleBtn = () => {
    setSignoutBtn((prevState) => !prevState);
  };

  let headerColor;

  if (location.pathname === "/staff") {
    headerColor = "#0b9cff";
  } else if (location.pathname === "/store") {
    headerColor = "#f13a11";
  } else if (location.pathname === "/gallery") {
    headerColor = "#2a4bf7";
  } else if (location.pathname === "/cars") {
    headerColor = "#1ca345";
  } else {
    headerColor = "#5e72e4";
  }

  return (
    <header className={classes.header} style={{ backgroundColor: headerColor }}>
      <div className={classes["head-content"]}>
        <div className={classes.actions}>
          <div>
            <span onClick={toggleBtn}>
              <AiFillSetting />
            </span>

            {signoutBtn && (
              <div className={classes.settings}>
                <button className={classes.logoutBtn} onClick={logoutHandler}>
                  تسجيل الخروج <AiOutlineLogout />
                </button>
              </div>
            )}
          </div>
          <p>{decoded.username} </p>
        </div>
        <h1>Mountain for Construction </h1>
      </div>
    </header>
  );
};
