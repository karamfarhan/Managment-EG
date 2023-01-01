import classes from "./Inputs.module.css";
const Inputs = (props) => {
  return (
    <div className={classes.inputs}>
      <input {...props} />
    </div>
  );
};

export default Inputs;
