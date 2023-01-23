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
  const [err, setErr] = useState(null);

  let form = false;

  if (userInfo.email !== "" && userInfo.password !== "") {
    form = true;
  }

  //login
  const { isLoading } = useSelector((state) => state.authReducer);
  const loggin = () => {
    dispatch(login(userInfo));
  };

  //submit hanlder
  const submitHandler = (e) => {
    // avoid browser behavior
    e.preventDefault();
    loggin();
  };

  const unAuthUser = err !== null ? classes.unauth : "";

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
              {err && <p className="err-msg"> {err} </p>}
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
