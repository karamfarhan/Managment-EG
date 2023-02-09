import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Pages from "./pages/Pages";
import { updateToken } from "./store/auth-slice";
function App() {
  const dispatch = useDispatch();
  const { refresh } = useSelector((state) => state.authReducer);

  useEffect(() => {
    dispatch(updateToken(refresh));
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
