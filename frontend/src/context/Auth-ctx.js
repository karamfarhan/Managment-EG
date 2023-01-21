import React, { useState, useEffect, useCallback } from "react";

const AuthContext = React.createContext({
  token: "",
  isLoggedIn: false,
  login: (token, data) => {},
  logout: () => {},
});

export const AuthContextProvider = (props) => {
  const storedToken = sessionStorage.getItem("token-management");
  const storedUser = sessionStorage.getItem("user");

  const [token, setToken] = useState(storedToken);
  const [userInfom, setUserInform] = useState(JSON.parse(storedUser));

  const userIsLoggedIn = !!token;
  console.log(token);

  const logoutHandler = useCallback(() => {
    setToken(null);
    sessionStorage.removeItem("token-management");
    sessionStorage.removeItem("user");
    sessionStorage.removeItem("current-page");
    sessionStorage.removeItem("filter");
  }, []);

  const loginHandler = (token, data) => {
    setToken(token);
    setUserInform(data);
    sessionStorage.setItem("token-management", token);
    sessionStorage.setItem("user", JSON.stringify(data));
    sessionStorage.removeItem("filter");
  };
  const updateToken = useCallback(() => {
    fetch("http://127.0.0.1:8000/account/token/refresh/", {
      method: "POST",
      body: JSON.stringify({ refresh: userInfom.refresh }),
      headers: {
        "Content-type": "Application/json",
      },
    }).then((res) => {
      if (res.status === 200) {
        return res.json().then((data) => {
          setToken(data.access);
          localStorage.setItem("token-management", data.access);
        });
      }
      if (res.status === 401) {
        logoutHandler();
        console.log(res.detail || "something went wrong");
      }
    });
  }, [userInfom]);
  useEffect(() => {
    let interval = setInterval(() => {
      if (userIsLoggedIn) {
        updateToken();
      }
    }, 240000);
    return () => clearInterval(interval);
  }, [updateToken, userIsLoggedIn]);
  const contextValue = {
    token: token,
    isLoggedIn: userIsLoggedIn,
    login: loginHandler,
    logout: logoutHandler,
    userInfom,
  };

  useEffect(() => {
    if (token === "") {
      logoutHandler();
    }
  }, [logoutHandler]);
  return (
    <AuthContext.Provider value={contextValue}>
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
