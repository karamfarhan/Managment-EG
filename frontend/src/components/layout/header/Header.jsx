import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import jwt_decode from "jwt-decode";

import { AiFillSetting, AiOutlineLogout } from "react-icons/ai";
import classes from "./Header.module.css";
import { logout } from "../../../store/auth-slice";
import ToggleBar from "../../icons/ToggleBar";
import CloseBar from "../../icons/CloseBar";

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
      const data = await res.json();
      console.log(data);
    } catch (err) {
      console.log(err);
    }
  };

  // =======
  // >>>>>>> 134e99f673ddf634ae3634039f18ef0b46c5fb0c

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
      {matches && (
        <div className={classes.toggle} onClick={sideBarHanler}>
          {showSideBar ? <CloseBar /> : <ToggleBar />}
        </div>
      )}
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
      </div>
    </header>
  );
};
