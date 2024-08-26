import React, { useState, useCallback } from 'react';
import DragModal from '../../../../../components/Modal/DragModal';
import styles from './ChildChatModal.module.css';
import ChatList from '../LeftPanel/ChatList';
import RightPanel from '../RightPanel/RightPanel';
import { useChatStore } from '../../../../../store/messengerStore';
import MessengerSideMenu from '../MessengerSideMenu/MessengerSideMenu';
import axios from 'axios';
import { BaseUrl } from '../../../../../commons/config';
import { leaveRoom, clearChatHistory, toggleNotifications } from '../../../../../commons/websocket';

const ChildChatModal = ({ isOpen, onClose, chatRooms, updateChatRoom }) => {
  const [openChatModals, setOpenChatModals] = useState([]);
  const { setSelectedChat: setStoreSelectedChat, setMessages } = useChatStore();

  const handleChatSelect = (chat) => {
    setStoreSelectedChat(chat);
    setOpenChatModals((prevModals) => [...prevModals, chat]);
  };

  const handleCloseChatModal = (chatSeq) => {
    setOpenChatModals((prevModals) =>
      prevModals.filter((modalChat) => modalChat.roomSeq !== chatSeq)
    );
  };

  const handleLeaveChat = useCallback(async (roomSeq) => {
    if (window.confirm("정말로 채팅방을 나가시겠습니까?")) {
      try {
        await axios.post(`${BaseUrl()}/api/chat/rooms/leave/${roomSeq}`);
        leaveRoom(roomSeq);
        setOpenChatModals((prevModals) =>
          prevModals.filter((modalChat) => modalChat.roomSeq !== roomSeq)
        );
        updateChatRoom(roomSeq, { isLeft: true });
        // 채팅방 목록에서도 해당 채팅방 제거
        updateChatRoom(roomSeq, null);
      } catch (error) {
        console.error('채팅방 나가기 오류:', error);
      }
    }
  }, [updateChatRoom]);

  const handleClearChat = useCallback(async (roomSeq) => {
    if (window.confirm("대화 내용을 삭제하시겠습니까? (서버에서도 삭제됩니다)")) {
      try {
        await axios.delete(`${BaseUrl()}/api/chat/messages/clear/${roomSeq}`);
        const response = await axios.get(`${BaseUrl()}/api/chat/rooms/${roomSeq}/messages`);
        setMessages(roomSeq, response.data);
        updateChatRoom(roomSeq, { lastMessage: null, lastMessageTime: null });
      } catch (error) {
        console.error('대화 내용 삭제 오류:', error);
      }
    }
  }, [setMessages, updateChatRoom]);

  const handleToggleNotifications = useCallback(async (roomSeq, enabled) => {
    try {
      await axios.post(`${BaseUrl()}/api/chat/notifications/${roomSeq}`, { enabled });
      toggleNotifications(roomSeq, enabled);
      updateChatRoom(roomSeq, { notificationsEnabled: enabled });
      console.log(`알림 ${enabled ? '켜기' : '끄기'}`);
    } catch (error) {
      console.error('알림 설정 변경 오류:', error);
    }
  }, [updateChatRoom]);

  if (!isOpen) return null;

  return (
    <>
      <DragModal isOpen={isOpen} onClose={onClose}>
        <div className={styles.modalBody}>
          <div className={styles.sideMenu}>
            <MessengerSideMenu />
          </div>
          <div className={styles.chatList}>
            <ChatList chatRooms={chatRooms} onChatSelect={handleChatSelect} updateChatRoom={updateChatRoom} />
          </div>
        </div>
      </DragModal>

      {openChatModals.map((chat) => (
        <DragModal key={chat.roomSeq} isOpen={true} onClose={() => handleCloseChatModal(chat.roomSeq)}>
          <RightPanel
            selectedChat={chat}
            onLeaveChat={handleLeaveChat}
            onClearChat={handleClearChat}
            onToggleNotifications={handleToggleNotifications}
          />
        </DragModal>
      ))}
    </>
  );
};

export default ChildChatModal;