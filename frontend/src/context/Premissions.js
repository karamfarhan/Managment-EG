import React from "react";
import jwt_decode from "jwt-decode";
import { useSelector } from "react-redux";
const PremissionContext = React.createContext({
  is_superuser: null,
  permissions: [],
});

export const PremissionProvider = ({ children }) => {
  const { token } = useSelector((state) => state.authReducer);

  const decoded = jwt_decode(token);
  const { is_superuser, permissions } = decoded;

  const premissionVal = {
    is_superuser,
    permissions: permissions,
  };
  return (
    <PremissionContext.Provider value={premissionVal}>
      {children}
    </PremissionContext.Provider>
  );
};

export default PremissionContext;
