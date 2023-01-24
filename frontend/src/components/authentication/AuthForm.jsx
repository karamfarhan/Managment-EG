import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Login from "./Login";
import classes from "./AuthForm.module.css";
import { login } from "../../store/auth-slice";
const AuthForm = () => {
  const dispatch = useDispatch();
  //email & password
  const [userInfo, setUserInfo] = useState({
    email: "",
    password: "",
  });
  //

  let form = false;

  if (userInfo.email !== "" && userInfo.password !== "") {
    form = true;
  }

  //login
  const { isLoading, httpErr } = useSelector((state) => state.authReducer);
  const loggin = () => {
    dispatch(login(userInfo));
  };

  //submit hanlder
  const submitHandler = (e) => {
    // avoid browser behavior
    e.preventDefault();
    loggin();
  };

  const unAuthUser = httpErr && httpErr !== "" ? classes.unauth : "";
  console.log(httpErr);
  return (
    <main>
      <div className={`${classes.main} ${unAuthUser}`}>
        <div className={classes["form_container"]}>
          <form dir="rtl" onSubmit={submitHandler}>
            <Login userInfo={userInfo} setUserInfo={setUserInfo} />
            <div className={classes["action_submit"]}>
              {(!isLoading || isLoading === null) && (
                <button
                  disabled={!form}
                  type="submit"
                  className={classes.submitBtn}>
                  تسجيل الدخول
                </button>
              )}
              {isLoading && <p> انتظر..... </p>}
              {httpErr !== null && httpErr !== "" && !isLoading && (
                <p className="err-msg"> {httpErr} </p>
              )}
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
