import Inputs from "../UI/inputs/Inputs";
import classes from "./AuthForm.module.css";
const Login = () => {
  return (
    <>
      <Inputs type="email" placeholder="البريد الالكتروني" />
      <Inputs type="password" placeholder="الرقم السري" />
      <button className={classes.forgetPass}> نسيت كلمة السر؟ </button>
    </>
  );
};

export default Login;
