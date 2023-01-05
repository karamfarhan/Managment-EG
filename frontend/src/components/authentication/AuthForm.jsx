import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Login from "./Login";
import classes from "./AuthForm.module.css";
import { authAction } from "../../store/auth-slice";
const AuthForm = () => {
  //email & password
  const [userInfo, setUserInfo] = useState({
    email: "",
    password: "",
  });
  const dispatch = useDispatch();

  let form = false;

  if (userInfo.email !== "" && userInfo.password !== "") {
    form = true;
  }

  //auth state
  const { err: errorState, isLoading } = useSelector(
    (state) => state.authReducer
  );

  //submit hanlder
  const submitHandler = (e) => {
    // avoid browser behavior
    e.preventDefault();

    dispatch(authAction(userInfo));
  };

  const unAuthUser = errorState !== null ? classes.unauth : "";

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
              {errorState && <p className="err-msg"> {errorState} </p>}
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
