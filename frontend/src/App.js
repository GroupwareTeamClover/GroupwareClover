import './App.css';
import { Login } from './components/Login/Login';
import {SideMenu} from "./components/SideMenu/SideMenu";
import {Home} from "./components/Home/Home";
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
