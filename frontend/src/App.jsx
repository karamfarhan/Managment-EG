import { useCallback, useEffect } from "react";
import { useSelector } from "react-redux";
import Pages from "./pages/Pages";
function App() {
  const { refresh, user } = useSelector((state) => state.authReducer);

  const updateToken = useCallback(() => {
    fetch("http://127.0.0.1:8000/account/token/refresh/", {
      method: "POST",
      body: JSON.stringify({ refresh }),
      headers: {
        "Content-type": "Application/json",
      },
    }).then((res) => {
      if (res.status === 200) {
        return res.json().then((data) => {
          localStorage.setItem("access_token", data.access);
          console.log(data);
        });
      }
      if (res.status === 401) {
        console.log(res.detail || "something went wrong");
      }
    });
  }, []);

  useEffect(() => {
    let interval = setInterval(() => {
      if (user !== null) {
        updateToken();
      }
    }, 240000);
    return () => clearInterval(interval);
  }, [updateToken, user]);

  return <Pages />;
}

export default App;
