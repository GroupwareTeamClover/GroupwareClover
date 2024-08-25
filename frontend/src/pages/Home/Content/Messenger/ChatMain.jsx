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
import { sendMessage, leaveRoom, clearChatHistory, toggleNotifications } from '../../../../commons/websocket';

axios.defaults.withCredentials = true;
axios.defaults.headers.post['Content-Type'] = 'application/json';

export const ChatMain = () => {
  const {
    chatRooms, setChatRooms, updateChatRoom,
    selectedChat, setSelectedChat,
    onlineUsers, setMessages, setOnlineUsers
  } = useChatStore();

  const [selectedProfile, setSelectedProfile] = useState(null);

  const handleProfileSelect = useCallback((user) => {
    setSelectedProfile(user);
  }, []);

  useEffect(() => {
    const fetchInitialOnlineUsers = async () => {
      try {
        const response = await axios.get(`${BaseUrl()}/api/chat/online-users`);
        setOnlineUsers(response.data);
      } catch (error) {
        console.error('온라인 사용자 목록 조회 오류:', error);
      }
    };

    fetchInitialOnlineUsers();
  }, [setOnlineUsers]);

  const fetchChatRooms = useCallback(async () => {
    try {
      const response = await axios.get(`${BaseUrl()}/api/chat/rooms`);
      const roomsWithUnreadCounts = await Promise.all(response.data.map(async (room) => {
        const unreadCountResponse = await axios.get(`${BaseUrl()}/api/chat/messages/unread/${room.roomSeq}`);
        return { ...room, unreadCount: unreadCountResponse.data };
      }));
      setChatRooms(roomsWithUnreadCounts);
      setSelectedChat(null);
    } catch (error) {
      console.error('채팅방 목록 조회 오류:', error);
    }
  }, [setChatRooms, setSelectedChat]);

  useEffect(() => {
    fetchChatRooms();
  }, [fetchChatRooms]);

  const sendChatMessage = useCallback((roomSeq, content) => {
    const message = {
      roomSeq: roomSeq,
      content: content,
      type: 'CHAT'
    };
    sendMessage("/app/chat.sendMessage", message);
  }, []);

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
        await axios.delete(`${BaseUrl()}/api/chat/messages/clear/${roomSeq}`);
        const response = await axios.get(`${BaseUrl()}/api/chat/rooms/${roomSeq}/messages`);
        setMessages(roomSeq, response.data);
        await fetchChatRooms();
      } catch (error) {
        console.error('대화 내용 삭제 오류:', error);
      }
    }
  };

  const handleToggleNotifications = async (roomSeq, enabled) => {
    try {
      await axios.post(`${BaseUrl()}/api/chat/notifications/${roomSeq}`, { enabled });
      toggleNotifications(roomSeq, enabled);
      console.log(`알림 ${enabled ? '켜기' : '끄기'}`);
    } catch (error) {
      console.error('알림 설정 변경 오류:', error);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.mSideMenu}>
        <MessengerSideMenu />
      </div>
      <div className={styles.leftPanel}>
        <SearchBar />
        <OnlineUsers 
          onlineUsers={onlineUsers} 
          onProfileSelect={handleProfileSelect}
        />
        <ChatList
          chatRooms={chatRooms}
          onChatSelect={setSelectedChat}
          updateChatRoom={updateChatRoom}
        />
      </div>
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
      <div className={styles.profilePanel}>
        <ProfilePanel selectedProfile={selectedProfile} onChatStart={handleChatStart} />
      </div>
    </div>
  );
};
