import './App.css';
import { Login } from './pages/Login/Login';
import { SideMenu } from "./pages/SideMenu/SideMenu";
import { Home } from "./pages/Home/Home";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { useMemberStore } from "./store/store";
import { useEffect, useState } from "react";
import { AdminSideMenu } from './pages/SideMenu/AdminSideMenu';
import { Admin } from './pages/Admin/Admin';
import { PopupWindow } from './pages/Home/Content/Admin/PopupBoard/PopupContent/PopupWindow/PopupWindow';

function App() {
  const userData = sessionStorage.getItem("sessionUser");
  const adminCheck = sessionStorage.getItem("sessionAdmin");
  const { sign, setSign, setSessionData, admin, setAdmin } = useMemberStore();

  // Sidebar toggle
  const [open, setOpen] = useState(true);
  // 팝업
  const [showPopup, setShowPopup] = useState(false);

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
      
      // 팝업 상태 초기화 (새 로그인 시 항상 팝업이 뜨도록 설정)
      setShowPopup(true);  
    }

    if (adminCheck !== null && adminCheck === "true") {
      setAdmin(true);
    }
  }, [sign]);

  const handlePopupClose = () => {
    setShowPopup(false);
  };

  return (
    <div className="container">
      <Router>
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
        {showPopup && <PopupWindow onClose={handlePopupClose} />}
      </Router>
    </div>
  );
}

export default App;
