import Inputs from "../UI/inputs/Inputs";
import classes from "./AuthForm.module.css";
const Login = ({ userInfo, setUserInfo }) => {
  return (
    <>
      <Inputs
        type="email"
        placeholder="Email"
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
        placeholder="Passowrd"
        value={userInfo.password}
        onChange={(e) =>
          setUserInfo({
            ...userInfo,
            password: e.target.value,
          })
        }
      />
    </>
  );
};

export default Login;
