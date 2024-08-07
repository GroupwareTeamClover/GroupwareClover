import React, { useEffect, useCallback } from 'react';
import axios from 'axios';
import { BaseUrl } from '../../../../commons/config';
import styles from './Messenger.module.css';
import ChatList from './LeftPanel/ChatList';
import ChatWindow from './RightPanel/ChatWindow';
import OnlineUsers from './LeftPanel/OnlineUsers';
import SearchBar from './LeftPanel/SearchBar';
import { useChatStore } from '../../../../store/messengerStore';
import MessengerSideMenu from './MessengerSideMenu/MessengerSideMenu';
import ProfilePanel from './ProfilePanel/ProfilePanel';
import { sendMessage } from '../../../../commons/websocket';

// axios 전역 설정
axios.defaults.withCredentials = true; // CORS 요청 시 쿠키 포함
axios.defaults.headers.post['Content-Type'] = 'application/json'; // POST 요청의 기본 Content-Type 설정

export const ChatMain = () => {
  // Zustand 스토어에서 필요한 상태와 액션들을 가져옴
  const {
    chatRooms, setChatRooms, addChatRoom, updateChatRoom,
    selectedChat, setSelectedChat,
    addMessage, setOnlineUsers, setUnreadCounts
  } = useChatStore();

  // 채팅방 목록을 서버로부터 가져오는 함수
  const fetchChatRooms = useCallback(async () => {
    try {
      const response = await axios.get(`${BaseUrl()}/chat/rooms`);
      setChatRooms(response.data);
      setSelectedChat(null); // selectedChat 상태 초기화
    } catch (error) {
      console.error('채팅방 목록 조회 오류:', error);
    }
  }, [setChatRooms]);

  // 컴포넌트 마운트 시 채팅방 목록 가져오기
  useEffect(() => {
    fetchChatRooms();
  }, [fetchChatRooms]);

  // 채팅 메시지 전송 함수
  const sendChatMessage = useCallback((roomSeq, content) => {
    const message = {
      roomSeq: roomSeq,
      content: content,
      type: 'CHAT'
    };
    sendMessage("/app/chat.sendMessage", message);
  }, []);

  // 메시지 읽음 처리 함수
  const markMessagesAsRead = useCallback((roomSeq) => {
    sendMessage("/app/chat.readMessages", { roomSeq: roomSeq });
  }, []);

  return (
    <div className={styles.container}>
      {/* 메신저 사이드 메뉴 */}
      <div className={styles.mSideMenu}>
        <MessengerSideMenu/>
      </div>
      {/* 왼쪽 패널: 검색, 온라인 사용자, 채팅방 목록 */}
      <div className={styles.leftPanel}>
        <SearchBar />
        <OnlineUsers />
        <ChatList
          chatRooms={chatRooms}
          onChatSelect={setSelectedChat}
        />
      </div>
      {/* 오른쪽 패널: 선택된 채팅방 또는 안내 메시지 */}
      <div className={styles.rightPanel}>
        {selectedChat ? (
          <ChatWindow 
            chat={selectedChat} 
            sendChatMessage={sendChatMessage}
            markMessagesAsRead={markMessagesAsRead}
          />
        ) : (
          <div className={styles.noChatSelected}>
            채팅방을 선택해주세요.
          </div>
        )}
      </div>
      {/* 프로필 패널 */}
      <div className={styles.profilePanel}>
        <ProfilePanel/>
      </div>
    </div>
  );
};
