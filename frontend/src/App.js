import React, { useEffect, useState } from 'react';
import './App.css';
import { Login } from './pages/Login/Login';
import { SideMenu } from "./pages/SideMenu/SideMenu";
import { Home } from "./pages/Home/Home";
import {BrowserRouter as Router, Navigate} from "react-router-dom";
import { useMemberStore } from "./store/store";
import { AdminSideMenu } from './pages/SideMenu/AdminSideMenu';
import { Admin } from './pages/Admin/Admin';
import ScrollToTop from './components/ScrollToTop/ScrollToTop';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { toast } from 'react-toastify';
import { Loading } from "./components/Loading/Loading";
import { useChatStore } from './store/messengerStore';
import { connectWebSocket, subscribeToRoom, disconnectWebSocket } from './commons/websocket';

function App() {
  const userData = sessionStorage.getItem("sessionUser");
  const adminCheck = sessionStorage.getItem("sessionAdmin");
  const { sign, setSign, setSessionData, admin, setAdmin } = useMemberStore();
  const { 
    chatRooms, addMessage, setOnlineUsers, addChatRoom, updateChatRoom, 
    setChatRooms, updateUnreadCount, handleNoticeMessage, updateMessageUnreadCount 
  } = useChatStore();

  const [open, setOpen] = useState(true);
  const [loading, setLoading] = useState(true);

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

      // 웹소켓 연결을 로그인 후에만 시도
      connectWebSocket((message) => {
        console.log('메시지 수신:', message);

        switch (message.type) {
          case 'CHAT':
            addMessage(message.roomSeq, message);
            updateChatRoom(message.roomSeq, {
              lastMessage: message.messageContent,
              lastMessageTime: message.sendTime,
              unreadCount: (chatRooms.find(room => room.roomSeq === message.roomSeq)?.unreadCount || 0) + 1
            });
            break;
          case 'USER_STATUS':
            setOnlineUsers(message.onlineUsers);
            break;
          case 'UNREAD_COUNT_UPDATE':
            updateUnreadCount(message.roomSeq, message.unreadCount);
            break;
            case 'MESSAGE_UPDATE':
              updateMessageUnreadCount(message.roomSeq, message.messageSeq, message.unreadCount);
              break;            
          case 'CHAT_ROOMS_UPDATE':
            setChatRooms(message.rooms);
            break;
          case 'NEW_CHAT_ROOM':
          case 'CREATE_ONE_ON_ONE_CHAT':
          case 'CREATE_GROUP_CHAT':
            addChatRoom(message.room);
            break;
          case 'NOTICE':
            handleNoticeMessage(message.message);
            break;            
          default:
            console.log('알 수 없는 메시지 타입:', message.type);
        }
      });

      if (adminCheck !== null && adminCheck === "true") {
        setAdmin(true);
      }

      setLoading(false);
    } else {
      // 로그인되지 않은 상태에서는 로딩만 종료하고 로그인 페이지를 표시
      setLoading(false);
    }
  }, [sign, adminCheck, setSessionData, setSign, setAdmin, addMessage, setOnlineUsers, addChatRoom, updateChatRoom, setChatRooms, updateUnreadCount, handleNoticeMessage, updateMessageUnreadCount]);

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="container">
      <Router>
        <ScrollToTop />
        {!sign &&
          <>
            <Navigate to="/" replace />
            <Login setSign={setSign} setAdmin={setAdmin} />
          </>

        }
        {!admin ?
          <>
            {sign && !admin && <SideMenu open={open} setOpen={setOpen} />}
            {sign && !admin && <Home />}
          </>
          :
          <>
            {sign && admin && <AdminSideMenu open={open} setOpen={setOpen} />}
            {sign && admin && <Admin />}
          </>
        }
      </Router>
      
      <ToastContainer />
    </div>
  );
}

export default App;