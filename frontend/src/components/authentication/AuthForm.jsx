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
    let obj = {
      email: userInfo.email,
      password: userInfo.password,
    };

    dispatch(login(obj));
  };

  //submit hanlder
  const submitHandler = (e) => {
    // avoid browser behavior
    e.preventDefault();
    loggin();
  };

  const unAuthUser = httpErr && httpErr !== "" ? classes.unauth : "";
  return (
    <main>
      <div className={`${classes.main} ${unAuthUser}`}>
        <div className={classes["form_container"]}>
          <form onSubmit={submitHandler}>
            <Login userInfo={userInfo} setUserInfo={setUserInfo} />
            <div className={classes["action_submit"]}>
              {(!isLoading || isLoading === null) && (
                <button
                  disabled={!form}
                  type="submit"
                  className={classes.submitBtn}>
                  sign in
                </button>
              )}
              {isLoading && <p> loading..... </p>}
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
