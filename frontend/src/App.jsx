import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Pages from "./pages/Pages";
import { updateToken } from "./store/auth-slice";
function App() {
  const dispatch = useDispatch();
  const { refresh, isAuth } = useSelector((state) => state.authReducer);
  useEffect(() => {
    const timer = setInterval(() => {
      if (refresh) {
        dispatch(updateToken(refresh));
      }
    }, 55000);
    return () => clearInterval(timer);
  }, [dispatch, isAuth, refresh]);

  return <Pages />;
}

export default App;
