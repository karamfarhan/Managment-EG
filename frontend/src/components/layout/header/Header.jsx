import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import jwt_decode from "jwt-decode";
import { AiFillCaretDown, AiOutlineLogout } from "react-icons/ai";
import { logout } from "../../../store/auth-slice";

import classes from "./Header.module.css";

export const Header = () => {
  const dispatch = useDispatch();
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

  // let headerColor = "#7c7979";

  // if (location.pathname === "/staff") {
  //   headerColor = "#c1392b";
  // } else if (location.pathname === "/store") {
  //   headerColor = "#27ae61";
  // } else if (location.pathname === "/create_subs") {
  //   headerColor = "#114299";
  // } else if (location.pathname === "/cars") {
  //   headerColor = "#27ae61";
  // } else {
  // }

  return (
    <header className={classes.header}>
      {/* {matches && (
        <div className={classes.toggle} onClick={sideBarHanler}>
          {showSideBar ? <CloseBar /> : <ToggleBar />}
        </div>
      )} */}
      <div className={classes["head-content"]}>
        <h1> mountain for construction </h1>
        <div className={classes.actions}>
          {signoutBtn && (
            <div className={classes.settings}>
              <div>
                <img src="../../../../images/logo/logo.png" alt="user" />{" "}
              </div>
              <div>
                <p>{decoded.username} </p>
              </div>
              <button className={classes.logoutBtn} onClick={logoutHandler}>
                sign out
                <AiOutlineLogout />
              </button>
            </div>
          )}

          <div className={classes.user} onClick={toggleBtn}>
            <div>
              <img src="../../../../images/logo/logo.png" alt="user" />
            </div>

            <span>
              <AiFillCaretDown />
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};
