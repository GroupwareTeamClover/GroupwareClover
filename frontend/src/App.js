import './App.css';
import { Login } from './pages/Login/Login';
import {SideMenu} from "./pages/SideMenu/SideMenu";
import {Home} from "./pages/Home/Home";
import {BrowserRouter as Router} from "react-router-dom";
import {useMemberStore} from "./store/store";
import {useEffect} from "react";

function App() {

  const userData = sessionStorage.getItem("sessionData");
  const { sign, setSign, setUserSession } = useMemberStore();

  useEffect(() => {
    const data = JSON.parse(userData);
    if(data !== null) {
      setSign(true);
      setUserSession(data);
    }
  }, [sign]);

  return (
    <div className="container">
      <Router>
        { !sign && <Login setSign={ setSign }/> }
        { sign && <SideMenu />  }
        { sign && <Home /> }
      </Router>
    </div>
  );
}

export default App;
