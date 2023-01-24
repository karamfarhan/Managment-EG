import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Pages from "./pages/Pages";
import { updateToken } from "./store/auth-slice";
function App() {
  const dispatch = useDispatch();
  const { refresh, isAuth } = useSelector((state) => state.authReducer);
  console.log(refresh);
  useEffect(() => {
    const timer = setInterval(() => {
      if (isAuth && refresh) {
        dispatch(updateToken(refresh));
      }
    }, 24000);
    return () => clearInterval(timer);
  }, [dispatch, isAuth, refresh]);

  return <Pages />;
}

export default App;
