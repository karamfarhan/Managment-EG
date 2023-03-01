import { useState, useEffect, useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import jwt_decode from "jwt-decode";
import { AiFillCaretDown, AiOutlineLogout } from "react-icons/ai";
import { MdOutlineDarkMode } from "react-icons/md";
import { CiLight } from "react-icons/ci";
import { logout } from "../../../store/auth-slice";
import CloseBar from "../../icons/CloseBar";
import ToggleBar from "../../icons/ToggleBar";
import classes from "./Header.module.css";
import { ThemeContext } from "../../../App";

export const Header = ({ showSideBar, sideBarHandler }) => {
  const themeCtx = useContext(ThemeContext);
  const { toggleTheme, theme } = themeCtx;
  const dispatch = useDispatch();
  const [signoutBtn, setSignoutBtn] = useState(false);
  const [matches, setMatches] = useState(window.innerWidth);
  const { token } = useSelector((state) => state.authReducer);
  const decoded = jwt_decode(token);

  useEffect(() => {
    const handlerResize = () => setMatches(window.innerWidth);
    window.addEventListener("resize", handlerResize);

    return () => window.removeEventListener("resize", handlerResize);
  }, []);

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

  return (
    <header className={classes.header}>
      <div className={classes["head-content"]}>
        {matches <= 820 && (
          <div className={classes.toggle} onClick={sideBarHandler}>
            {showSideBar ? <CloseBar /> : <ToggleBar />}
          </div>
        )}

        <h1> mountain</h1>
        <div onClick={toggleTheme} className={classes.toggleTheme}>
          {theme === "dark" ? <CiLight /> : <MdOutlineDarkMode />}
        </div>
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
