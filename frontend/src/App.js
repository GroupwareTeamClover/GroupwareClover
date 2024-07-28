import './App.css';
import { Login } from './pages/Login/Login';
import {SideMenu} from "./pages/SideMenu/SideMenu";
import {Home} from "./pages/Home/Home";
import {BrowserRouter as Router} from "react-router-dom";
import {useMemberStore} from "./store/store";
import {useEffect, useState} from "react";
import { AdminSideMenu } from './pages/SideMenu/AdminSideMenu';
import { Admin } from './pages/Admin/Admin';


function App() {

  const userData = sessionStorage.getItem("sessionData");
  const { sign, setSign, setUserSession } = useMemberStore();

  // Sidebar toggle
  const [open, setOpen] = useState(true);

  useEffect(() => {
    /* Side-Bar toggle */
    if(localStorage.getItem("sidebar") === "true") setOpen(true);
    else setOpen(!open);
  }, [])

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
        { sign && <SideMenu open={open} setOpen={setOpen}/>  }
        { sign && <Home /> }
        {/* { !sign && <Login setSign={ setSign }/> }
        { sign && <AdminSideMenu />  }
        {  sign && <Admin /> } */}
      </Router>
    </div>
  );
}

export default App;
