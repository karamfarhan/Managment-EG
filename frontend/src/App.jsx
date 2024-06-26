import { useEffect, createContext, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Pages from "./pages/Pages";
import { logout, updateToken } from "./store/auth-slice";
import "./index.css";
export const ThemeContext = createContext(null);

function App() {
  window.domain = "http://127.0.0.1:8000/api/v1";
  // window.domain = "https://managment-eg-production.up.railway.app/api/v1";
  // window.domain = "https://managementdjango.onrender.com/api/v1";
  const dispatch = useDispatch();
  const { refresh, token } = useSelector((state) => state.authReducer);
  const [theme, setTheme] = useState(
    localStorage.getItem("theme") ? localStorage.getItem("theme") : "dark"
  );

  useEffect(() => {
    localStorage.setItem("theme", theme);
  }, [theme]);
  useEffect(() => {
    if (token !== null) {
      dispatch(updateToken(refresh));
    } else {
      dispatch(logout());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    const timer = setInterval(() => {
      if (refresh) {
        dispatch(updateToken(refresh));
      }
    }, 57000);
    return () => clearInterval(timer);
  }, [dispatch, refresh]);

  //toggle theme
  const toggleTheme = () => {
    setTheme((curr) => (curr === "light" ? "dark" : "light"));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <div id={theme}>
        <Pages />
      </div>
    </ThemeContext.Provider>
  );
}

export default App;
