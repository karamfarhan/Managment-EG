import { useState, useEffect, useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import jwt_decode from "jwt-decode";
import { AiFillCaretDown, AiOutlineLogout } from "react-icons/ai";
import { MdOutlineDarkMode } from "react-icons/md";
import { CiLight } from "react-icons/ci";
import { ImEarth } from "react-icons/im";
import { logout } from "../../../store/auth-slice";
import CloseBar from "../../icons/CloseBar";
import ToggleBar from "../../icons/ToggleBar";
import classes from "./Header.module.css";
import { ThemeContext } from "../../../App";
import { useTranslation } from "react-i18next";

export const Header = ({ showSideBar, sideBarHandler }) => {
  const themeCtx = useContext(ThemeContext);
  const dispatch = useDispatch();
  const { toggleTheme, theme } = themeCtx;
  const [signoutBtn, setSignoutBtn] = useState(false);
  const [lang, setLang] = useState(false);
  const [matches, setMatches] = useState(window.innerWidth);
  const { token } = useSelector((state) => state.authReducer);
  const decoded = jwt_decode(token);
  const [t, i18n] = useTranslation();

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
   // logoutEnpoint();
   dispatch(logout());
  };

  // signout btn
  const toggleBtn = () => {
    setSignoutBtn((prevState) => !prevState);
  };

  //change language
  const changeLanguage = (e) => {
    let selectedLanguage = e.target.innerText;
    if (selectedLanguage === "English") {
      selectedLanguage = "en";
    } else if (selectedLanguage === "العربية") {
      selectedLanguage = "ar";
    } else {
    }
    // i18n.changeLanguage(e.target.value);
    i18n.changeLanguage(selectedLanguage);
    localStorage.setItem("language", selectedLanguage);
  };

  let positionX = {};
  if (i18n.language === "ar") {
    positionX = {
      left: "10px",
    };
  } else {
    positionX = {
      right: "10px",
    };
  }
  return (
    <header
      className={classes.header}
      dir={i18n.language === "ar" ? "rtl" : "ltr"}>
      <div className={classes["head-content"]}>
        <div>
          {matches <= 820 && (
            <div className={classes.toggle} onClick={sideBarHandler}>
              {showSideBar ? <CloseBar /> : <ToggleBar />}
            </div>
          )}

          <h1> {t("mountain")} </h1>
        </div>
        <div className={classes.features}>
          <div onClick={toggleTheme} className={classes.toggleTheme}>
            {theme === "dark" ? <CiLight /> : <MdOutlineDarkMode />}
          </div>

          <div
            className={classes.lang}
            onClick={() => setLang((prevState) => !prevState)}>
            <div>
              <ImEarth />
            </div>
            {lang && (
              <ul>
                {["English", "العربية"].map((el, i) => (
                  <li onClick={changeLanguage} key={i}>
                    {el}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
        <div className={classes.actions}>
          {signoutBtn && (
            <div className={classes.settings} style={positionX}>
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
