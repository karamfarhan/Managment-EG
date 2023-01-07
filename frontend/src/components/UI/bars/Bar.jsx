import classes from "./Bar.module.css";

const Bar = ({ children }) => {
  return <div className={classes.bar}>{children} </div>;
};
export default Bar;
