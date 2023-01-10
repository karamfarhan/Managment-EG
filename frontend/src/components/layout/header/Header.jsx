import { useState, useContext } from "react";
import { useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";
import { AiFillSetting, AiOutlineLogout } from "react-icons/ai";
import classes from "./Header.module.css";
import AuthContext from "../../../context/Auth-ctx";
export const Header = () => {
  const [signoutBtn, setSignoutBtn] = useState(false);
  const authCtx = useContext(AuthContext);
  const { userInfom } = authCtx;
  console.log(userInfom);
  //logout handler
  const logoutHandler = () => {
    authCtx.logout();
  };
  // signout btn
  const toggleBtn = () => {
    setSignoutBtn((prevState) => !prevState);
  };

  return (
    <header className={classes.header}>
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
          <p>{userInfom.username} </p>
        </div>
        <h1>Mountain for Construction </h1>
      </div>
    </header>
  );
};
