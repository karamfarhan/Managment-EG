import classes from "./Inputs.module.css";
const Inputs = (props) => {
  return (
    <div className={classes.inputs}>
      <label htmlFor={props.id}> {props.label} </label>
      <input {...props} />
    </div>
  );
};

export default Inputs;
