import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import jwt_decode from "jwt-decode";

import { AiFillSetting, AiOutlineLogout, AiOutlineHome } from "react-icons/ai";
import classes from "./Header.module.css";
import { logout } from "../../../store/auth-slice";

export const Header = ({ sideBarHanler, showSideBar, matches }) => {
  const dispatch = useDispatch();
  const location = useLocation();
  const [signoutBtn, setSignoutBtn] = useState(false);
  const { token } = useSelector((state) => state.authReducer);
  const decoded = jwt_decode(token);
  // <<<<<<< HEAD
  const logoutEnpoint = async () => {
    try {
      const res = await fetch(`${window.domain}/account/logout/`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.ok) {
        dispatch(logout());
      }
      await res.json();
    } catch (err) {
      console.log(err);
    }
  };

  // =======

  //logout handler
  const logoutHandler = () => {
    //
    logoutEnpoint();
  };

  // signout btn
  const toggleBtn = () => {
    setSignoutBtn((prevState) => !prevState);
  };
  //logout
  // async function logoutIntegrate(){

  // }

  let headerColor = "#7c7979";

  if (location.pathname === "/staff") {
    headerColor = "#c1392b";
  } else if (location.pathname === "/store") {
    headerColor = "#27ae61";
  } else if (location.pathname === "/create_subs") {
    headerColor = "#114299";
  } else if (location.pathname === "/cars") {
    headerColor = "#27ae61";
  } else {
  }

  return (
    <header className={classes.header} style={{ backgroundColor: headerColor }}>
      {/* {matches && (
        <div className={classes.toggle} onClick={sideBarHanler}>
          {showSideBar ? <CloseBar /> : <ToggleBar />}
        </div>
      )} */}
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
        <h1> ماونتن للانشاءات </h1>
        {location.pathname !== "/main" && (
          <Link to="/">
            <AiOutlineHome />
          </Link>
        )}
      </div>
    </header>
  );
};
