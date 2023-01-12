import {useContext, useEffect} from 'react';
import AuthContext from './context/Auth-ctx'
import Pages from "./pages/Pages";
function App() {

  const authCtx = useContext(AuthContext)

  const {logout} = authCtx


  return <Pages />;
}

export default App;
