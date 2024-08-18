import React, { useEffect, useCallback, useState } from 'react';
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
import { sendMessage, connectWebSocket, disconnectWebSocket, leaveRoom, clearChatHistory, toggleNotifications } from '../../../../commons/websocket';
import { handleChatCreated } from './utils/chat-utils';

// axios 전역 설정
axios.defaults.withCredentials = true; // CORS 요청 시 쿠키 포함
axios.defaults.headers.post['Content-Type'] = 'application/json'; // POST 요청의 기본 Content-Type 설정

export const ChatMain = () => {
  // Zustand 스토어에서 필요한 상태와 액션들을 가져옴
  const {
    chatRooms, setChatRooms, addChatRoom, updateChatRoom,
    selectedChat, setSelectedChat,
    addMessage, setOnlineUsers, setUnreadCounts, onlineUsers, setMessages
  } = useChatStore();

  // 선택된 프로필 상태 관리
  const [selectedProfile, setSelectedProfile] = useState(null);

  // 프로필 선택 핸들러
  const handleProfileSelect = useCallback((user) => {
    setSelectedProfile(user);
  }, []);

  useEffect(() => {
    // 초기 온라인 사용자 목록 가져오기
    const fetchInitialOnlineUsers = async () => {
      try {
        const response = await axios.get(`${BaseUrl()}/chat/online-users`);
        setOnlineUsers(response.data);
      } catch (error) {
        console.error('온라인 사용자 목록 조회 오류:', error);
      }
    };

    fetchInitialOnlineUsers();

    // WebSocket 메시지 핸들러
    const handleReceivedMessage = (message) => {
      console.log('메시지 수신:', message);
      switch (message.type) {
        case 'CHAT':
          addMessage(message.roomSeq, message);
          break;
        case 'USER_STATUS':
          setOnlineUsers(message.onlineUsers);
          break;
        case 'NEW_CHAT_ROOM':
        case 'CREATE_ONE_ON_ONE_CHAT':
        case 'CREATE_GROUP_CHAT':
              handleChatCreated(message.room);
              break;
        default:
          console.log('알 수 없는 메시지 타입:', message.type);
      }
    };

    // WebSocket 연결
    connectWebSocket(handleReceivedMessage);

    // 컴포넌트 언마운트 시 WebSocket 연결 해제
    return () => {
      disconnectWebSocket();
    };
  }, [addMessage, setOnlineUsers, addChatRoom]);

  // 채팅방 목록을 서버로부터 가져오는 함수
  const fetchChatRooms = useCallback(async () => {
    try {
      const response = await axios.get(`${BaseUrl()}/chat/rooms`);
      setChatRooms(response.data);
      setSelectedChat(null); // selectedChat 상태 초기화
    } catch (error) {
      console.error('채팅방 목록 조회 오류:', error);
    }
  }, [setChatRooms, setSelectedChat]);

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

  const handleChatStart = useCallback((newRoom) => {
    setSelectedChat(newRoom);
  }, [setSelectedChat]);

  const handleLeaveChat = async (roomSeq) => {
    if (window.confirm("정말로 채팅방을 나가시겠습니까?")) {
      try {
        await axios.post(`${BaseUrl()}/chat/rooms/leave/${roomSeq}`);
        leaveRoom(roomSeq);
        setSelectedChat(null);
        await fetchChatRooms();
      } catch (error) {
        console.error('채팅방 나가기 오류:', error);
      }
    }
  };

  const handleClearChat = async (roomSeq) => {
    if (window.confirm("대화 내용을 삭제하시겠습니까? (서버에서도 삭제됩니다)")) {
      try {
        await axios.delete(`${BaseUrl()}/chat/messages/clear/${roomSeq}`);
        // 서버에서 메시지 삭제 후, 해당 채팅방의 메시지를 다시 로드
        const response = await axios.get(`${BaseUrl()}/chat/rooms/${roomSeq}/messages`);
        setMessages(roomSeq, response.data);
        // 채팅방 목록 갱신 (필요한 경우)
        await fetchChatRooms();
      } catch (error) {
        console.error('대화 내용 삭제 오류:', error);
      }
    }
  };

  const handleToggleNotifications = async (roomSeq, enabled) => {
    try {
      await axios.post(`${BaseUrl()}/chat/notifications/${roomSeq}`, { enabled });
      toggleNotifications(roomSeq, enabled);
      console.log(`알림 ${enabled ? '켜기' : '끄기'}`);
    } catch (error) {
      console.error('알림 설정 변경 오류:', error);
    }
  };

  return (
    <div className={styles.container}>
      {/* 메신저 사이드 메뉴 */}
      <div className={styles.mSideMenu}>
        <MessengerSideMenu/>
      </div>
      {/* 왼쪽 패널: 검색, 온라인 사용자, 채팅방 목록 */}
      <div className={styles.leftPanel}>
        <SearchBar />
        <OnlineUsers 
          onlineUsers={onlineUsers} 
          onProfileSelect={handleProfileSelect}
        />
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
            onLeaveChat={handleLeaveChat}
            onClearChat={handleClearChat}
            onToggleNotifications={handleToggleNotifications}
          />
        ) : (
          <div className={styles.noChatSelected}>
            채팅방을 선택해주세요.
          </div>
        )}
      </div>
      {/* 프로필 패널 */}
      <div className={styles.profilePanel}>
        <ProfilePanel selectedProfile={selectedProfile} onChatStart={handleChatStart}/>
      </div>
    </div>
  );
};