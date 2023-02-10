import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Pages from "./pages/Pages";
import { updateToken } from "./store/auth-slice";
import Cookies from "js-cookie";

function App() {
  console.log(Cookies.get("token-management"));
  const dispatch = useDispatch();
  const { refresh, token } = useSelector((state) => state.authReducer);

  useEffect(() => {
    if (token !== undefined) {
      dispatch(updateToken(refresh));
    }
  }, []);

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
