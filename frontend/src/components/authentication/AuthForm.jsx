import { useState } from "react";
import Login from "./Login";
import classes from "./AuthForm.module.css";
const AuthForm = () => {
  //login - create Account
  //  const [isLogin, setIsLogin] = useState(true);

  //submit hanlder
  const submitHandler = (e) => {
    // avoid browser behavior
    e.preventDefault();
  };

  return (
    <main>
      <div className={classes.main}>
        <div className={classes["form_container"]}>
          <form dir="rtl" onSubmit={submitHandler}>
            <Login />
            <div className={classes["action_submit"]}>
              <button type="submit" className={classes.submitBtn}>
                تسجيل الدخول
              </button>
            </div>
          </form>
        </div>
        <h1>
          Mountain <br /> for <br /> Constructrion
        </h1>
      </div>
    </main>
  );
};

export default AuthForm;
