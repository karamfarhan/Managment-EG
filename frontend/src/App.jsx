import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Pages from "./pages/Pages";
import { logout, updateToken } from "./store/auth-slice";

function App() {
  const dispatch = useDispatch();
  const { refresh, token, isAuth } = useSelector((state) => state.authReducer);

  useEffect(() => {
    if (token !== null) {
      dispatch(updateToken(refresh));
    } else {
      dispatch(logout());
    }
  }, []);
  console.log(isAuth);
  useEffect(() => {
    const timer = setInterval(() => {
      if (refresh) {
        dispatch(updateToken(refresh));
      }
    }, 57000);
    return () => clearInterval(timer);
  }, [dispatch, refresh]);

  return <Pages />;
}

export default App;
