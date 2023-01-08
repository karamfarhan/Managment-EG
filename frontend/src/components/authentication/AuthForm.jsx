import { useState, useContext } from "react";
import AuthContext from "../../context/Auth-ctx";
import Login from "./Login";
import classes from "./AuthForm.module.css";
const AuthForm = () => {
  //email & password
  const [userInfo, setUserInfo] = useState({
    email: "",
    password: "",
  });
  //
  const [err, setErr] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
   //auth context
   const authCtx = useContext(AuthContext);
  console.log(authCtx)
  let form = false;

  if (userInfo.email !== "" && userInfo.password !== "") {
    form = true;
  }



  //login 
  
  const loggin = async()=> {
    setIsLoading(true)
    
    try {
      const response = await fetch(
        "http://127.0.0.1:8000/account/login_token/",
        {
          method: "POST",
          headers: {
            "Content-type": "application/json",
          },

          body: JSON.stringify({
            email: userInfo.email,
            password: userInfo.password,
          }),
        }
      );
      const data = await response.json();
      setIsLoading(false)
      let token = data.access;
      authCtx.login(token, data);
      console.log(token)
      console.log(data)

      if (!response.ok) {
        throw new Error(data.detail);
      }
  

    } catch (err) {
     console.log(err.message)
     setErr(err.message)
     setIsLoading(false)
    }


  }


  console.log(authCtx.isLoggedIn)






  //submit hanlder
  const submitHandler = async(e) => {
    // avoid browser behavior
    e.preventDefault();
    await loggin()
//    dispatch(authAct.onLogin());
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
