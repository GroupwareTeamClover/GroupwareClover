import React, { useState, useEffect } from 'react';
import { BaseUrl } from '../../../../commons/config';
import styles from './Messenger.module.css';
import ChatList from './LeftPanel/ChatList';
import ChatWindow from './RightPanel/ChatWindow';
import OnlineUsers from './LeftPanel/OnlineUsers';
import SearchBar from './LeftPanel/SearchBar';
import axios from 'axios';

axios.defaults.withCredentials = true;

export const ChatMain = () => {
  const [chatRooms, setChatRooms] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    // WebSocket 연결 설정
    const wsUrl = `ws://${BaseUrl().replace(/^https?:\/\//, '')}/chat`;
    const newSocket = new WebSocket(wsUrl);

    newSocket.onmessage = (e) => {
      console.log(`onMessage: ${e.data}`);
    }
    setSocket(newSocket);

    // 컴포넌트가 마운트될 때 채팅방 목록을 가져옴
    fetchChatRooms();

    // 컴포넌트가 언마운트될 때 WebSocket 연결을 닫음
    return () => {
      newSocket.close();
    };
  }, []);

  // 채팅방 목록을 서버로부터 가져오는 함수
  const fetchChatRooms = async () => {
    try {
      const response = await axios.get(`${BaseUrl()}/chat/rooms`);
      setChatRooms(response.data);
    } catch (error) {
      console.error('채팅방 목록 오류 발생:', error);
    }
  };

  // 새로운 1:1 채팅방을 생성하는 함수
  const createChatRoom = async (userId) => {
    try {
      const response = await axios.post(`${BaseUrl()}/chat/rooms`, { empSeq: userId });
      const newRoom = response.data;
      // 새로운 채팅방을 목록에 추가
      setChatRooms([...chatRooms, newRoom]);
      // 새로 생성된 채팅방을 선택
      setSelectedChat(newRoom);
    } catch (error) {
      console.error('채팅방 생성 오류11 :', error);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.leftPanel}>
        <SearchBar />
        <OnlineUsers />
        <ChatList
          chatRooms={chatRooms}
          onChatSelect={setSelectedChat}
          onCreateChat={createChatRoom}
        />
      </div>
      <div className={styles.rightPanel}>
        {selectedChat ? (
          <ChatWindow
            chat={selectedChat}
            socket={socket}
          />
        ) : (
          <div className={styles.noChatSelected}>
            채팅방을 선택해주세요.
          </div>
        )}
      </div>
    </div>
  );
};