import { Fragment, useEffect, useState } from "react";
import Sidebar from "./sidebar/Sidebar";

//classes
import classes from "./Layout.module.css";
import { Header } from "./header/Header";

export const Layout = ({ children }) => {
  const [matches, setMatches] = useState(
    window.matchMedia("(max-width: 820px)").matches
  );
  const [showSideBar, setShowSideBar] = useState(true);

  useEffect(() => {
    const handler = (e) => {
      setMatches(e.matches);
    };
    if (matches === false) {
      setShowSideBar(true);
    } else {
      setShowSideBar(false);
    }
    window.matchMedia("(max-width: 820px)").addEventListener("change", handler);
  }, [matches]);
  //show side bar hanler
  const sideBarHandler = () => {
    setShowSideBar((prev) => !prev);
  };

  return (
    <Fragment>
      <Header
        showSideBar={showSideBar}
        sideBarHandler={sideBarHandler}
        matches={matches}
      />
      <main className={classes.layout}>
        <section>{children}</section>
      {showSideBar &&  <Sidebar />}
      </main>
    </Fragment>
  );
};
