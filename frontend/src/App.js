import './App.css';
import { Login } from './pages/Login/Login';
import { SideMenu } from "./pages/SideMenu/SideMenu";
import { Home } from "./pages/Home/Home";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { useMemberStore } from "./store/store";
import { useEffect, useState } from "react";
import { AdminSideMenu } from './pages/SideMenu/AdminSideMenu';
import { Admin } from './pages/Admin/Admin';
import Swal from "sweetalert2";
import ScrollToTop from './components/ScrollToTop/ScrollToTop';

function App() {
  const userData = sessionStorage.getItem("sessionUser");
  const adminCheck = sessionStorage.getItem("sessionAdmin");
  const { sign, setSign, setSessionData, admin, setAdmin } = useMemberStore();

  // Sidebar toggle
  const [open, setOpen] = useState(true);

  useEffect(() => {
    /* Side-Bar toggle */
    if (localStorage.getItem("sidebar") === "true") setOpen(true);
    else setOpen(!open);
  }, []);

  useEffect(() => {
    const data = JSON.parse(userData);
    if (data !== null) {
      setSign(true);
      setSessionData(data);
    }

    if (adminCheck !== null && adminCheck === "true") {
      setAdmin(true);
    }
  }, [sign]);



  return (
    <div className="container">
      <Router>
      <ScrollToTop/>
        { !sign && <Login setSign={ setSign } setAdmin={ setAdmin }/> }
        { !admin ?
            <>
              { (sign && !admin) && <SideMenu open={open} setOpen={setOpen}/>  }
              { (sign && !admin) && <Home /> }
            </>
            :
            <>
              {/* 관리자페이지 */}
              { (sign && admin) && <AdminSideMenu open={open} setOpen={setOpen}/>  }
              { (sign && admin) && <Admin /> }
            </>
        }
      </Router>
    </div>
  );
}

export default App;
