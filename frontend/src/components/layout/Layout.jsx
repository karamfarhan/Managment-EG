import { Fragment, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Sidebar from "./sidebar/Sidebar";
//classes
import classes from "./Layout.module.css";
import { Header } from "./header/Header";

export const Layout = ({ children }) => {
  const [t, i18n] = useTranslation();
  const [matches, setMatches] = useState(
    window.matchMedia("(max-width: 820px)").matches
  );
  const [showSideBar, setShowSideBar] = useState(true);

  useEffect(() => {
    const handler = (e) => {
      setMatches(e.matches);
    };
    // if (matches === false) {
    //   setShowSideBar(true);
    // } else {
    //   setShowSideBar(false);
    // }
    window.matchMedia("(max-width: 820px)").addEventListener("change", handler);
  }, [matches]);

  //show side bar hanler
  const sideBarHandler = () => {
    setShowSideBar((prev) => !prev);

  };

  let sectionPosition = {
    marginLeft: "auto",
  };

  if (i18n.language === "ar") {
    sectionPosition = {
      marginRight: "auto",
    };
  }
<<<<<<< HEAD
  console.log(matches)
=======
>>>>>>> 833ee3ff6f1ddbdce15c11278bfd16e0624378c0
  return (
    <Fragment>
      <Header
        showSideBar={showSideBar}
        sideBarHandler={sideBarHandler}
        matches={matches}
      />
      <main
        className={classes.layout}
        dir={i18n.language === "en" ? "ltr" : "rtl"}

      >
<<<<<<< HEAD
        <section style={{ ...sectionPosition, width: showSideBar === false ? "100%" : null }} >{children}</section>
=======
        <section
          style={{
            ...sectionPosition,
            width: showSideBar === false ? "100%" : null,
          }}
        >
          {children}
        </section>
>>>>>>> 833ee3ff6f1ddbdce15c11278bfd16e0624378c0
        {showSideBar && <Sidebar />}
      </main>
    </Fragment>
  );
};
