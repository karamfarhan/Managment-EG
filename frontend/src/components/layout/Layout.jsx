import { Fragment } from "react";
import Sidebar from "./sidebar/Sidebar";

//classes
import classes from "./Layout.module.css";
import { Header } from "./header/Header";

export const Layout = ({ children }) => {
  return (
    <Fragment>
      <Header />
      <main className={classes.layout}>
        <section dir="rtl">{children}</section>
        <Sidebar />
      </main>
    </Fragment>
  );
};
