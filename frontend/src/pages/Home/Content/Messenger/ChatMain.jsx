import React, { useEffect, useCallback } from 'react';
import axios from 'axios';
import { BaseUrl } from '../../../../commons/config';
import styles from './Messenger.module.css';
import ChatList from './LeftPanel/ChatList';
import ChatWindow from './RightPanel/ChatWindow';
import OnlineUsers from './LeftPanel/OnlineUsers';
import SearchBar from './LeftPanel/SearchBar';
import { useChatStore } from '../../../../store/messengerStore'; // Zustand 스토어 import
import MessengerSideMenu from './MessengerSideMenu/MessengerSideMenu';
import ProfilePanel from './ProfilePanel/ProfilePanel';

// axios 기본 설정: 모든 요청에 credentials 포함
axios.defaults.withCredentials = true;
axios.defaults.headers.post['Content-Type'] = 'application/json'; // 꼭 필요한 설정인지 확인 필요함

export const ChatMain = () => {
  // 스토어에서 필요한 상태와 액션들을 가져옴
  const { 
    chatRooms, setChatRooms, addChatRoom, updateChatRoom, 
    selectedChat, setSelectedChat, 
    addMessage, setOnlineUsers 
  } = useChatStore();

  // WebSocket 메시지 처리 함수
  const handleWebSocketMessage = useCallback((event) => {
    const data = JSON.parse(event.data);
    console.log('WebSocket message received:', data);

    // 메시지 타입에 따라 적절한 처리를 수행.
    // 전부 안되는 중 
    switch (data.type) {
      case 'NEW_MESSAGE':
        addMessage(data.roomSeq, data.message);
        break;
      case 'USER_STATUS':
        setOnlineUsers(data.onlineUsers);
        break;
      case 'NEW_CHAT_ROOM':
        addChatRoom(data.room);
        break;
      default:
        console.log('설정해 놓지 않은 메시지 타입:', data.type);
    }
  }, [addMessage, setOnlineUsers, addChatRoom]);

  // 컴포넌트 마운트 시 WebSocket 연결 및 채팅방 목록
  // 로그인 시로 변경 예정
  useEffect(() => {
    const wsUrl = `ws://${BaseUrl().replace(/^https?:\/\//, '')}/chat`;
    const socket = new WebSocket(wsUrl);

    socket.onmessage = handleWebSocketMessage;

    fetchChatRooms();

    // 컴포넌트 언마운트 시 WebSocket 연결 종료
    return () => {
      socket.close();
    };
  }, [handleWebSocketMessage]);


  // 채팅방 목록을 서버로부터 가져오는 함수
  const fetchChatRooms = async () => {
    try {
      const response = await axios.get(`${BaseUrl()}/chat/rooms`);
      setChatRooms(response.data);
    } catch (error) {
      console.error('채팅방 목록 조회 오류:', error);

    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.mSideMenu}>
        <MessengerSideMenu/>
      </div>
      <div className={styles.leftPanel}>
        <SearchBar />
        <OnlineUsers />
        <ChatList
          chatRooms={chatRooms}
          onChatSelect={setSelectedChat}
        />
      </div>
      <div className={styles.rightPanel}>
        {selectedChat ? (
          <ChatWindow chat={selectedChat} />
        ) : (
          <div className={styles.noChatSelected}>
            채팅방을 선택해주세요.
          </div>
        )}
      </div>
      <div className={styles.profilePanel}>
          <ProfilePanel/>
      </div>
    </div>
  );
};