import Inputs from "../UI/inputs/Inputs";
import classes from "./AuthForm.module.css";
const AuthForm = () => {
  return (
    <div className={classes["form_container"]}>
      <form dir="rtl">
        <Inputs placeholder="البريد الالكتروني" />
        <Inputs placeholder="الرقم السري" />
        <div className={classes["action_submit"]}>
          {" "}
          <button type="submit"> تسجيل الدخول </button>
        </div>
      </form>
    </div>
  );
};

export default AuthForm;
