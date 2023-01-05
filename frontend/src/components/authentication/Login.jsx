import Inputs from "../UI/inputs/Inputs";
import classes from "./AuthForm.module.css";
const Login = ({ userInfo, setUserInfo }) => {
  return (
    <>
      <Inputs
        type="email"
        placeholder="البريد الالكتروني"
        value={userInfo.email}
        onChange={(e) =>
          setUserInfo({
            ...userInfo,
            email: e.target.value,
          })
        }
      />
      <Inputs
        type="password"
        placeholder="الرقم السري"
        value={userInfo.password}
        onChange={(e) =>
          setUserInfo({
            ...userInfo,
            password: e.target.value,
          })
        }
      />
      <button className={classes.forgetPass}> نسيت كلمة السر؟ </button>
    </>
  );
};

export default Login;
