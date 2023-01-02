import { useState } from "react";
import Login from "./Login";
import classes from "./AuthForm.module.css";
import SignUp from "./SignUp";
const AuthForm = () => {
  //login - create Account
  const [isLogin, setIsLogin] = useState(true);

  //submit hanlder
  const submitHandler = (e) => {
    // avoid browser behavior
    e.preventDefault();
  };

  //switch - form

  const switchForm = () => {
    setIsLogin((prevState) => !prevState);
  };

  // button class
  const switcherClass = isLogin
    ? classes.createNewAccBtn
    : classes.alreadyHaveAcc;

  return (
    <main>
      <div className={classes.main}>
        <div className={classes["form_container"]}>
          <form dir="rtl" onSubmit={submitHandler}>
            {isLogin && <Login />}
            {!isLogin && <SignUp />}
            <div className={classes["action_submit"]}>
              {isLogin && (
                <button type="submit" className={classes.submitBtn}>
                  {" "}
                  تسجيل الدخول{" "}
                </button>
              )}
              <button
                onClick={switchForm}
                type="submit"
                className={switcherClass}
              >
                {" "}
                {isLogin ? "انشاء حساب جديد" : "لديك حساب بالفعل ؟"}{" "}
              </button>
            </div>
          </form>
        </div>
        {isLogin && (
          <h1>
            Mountain <br /> for <br /> Constructrion
          </h1>
        )}{" "}
      </div>
    </main>
  );
};

export default AuthForm;
