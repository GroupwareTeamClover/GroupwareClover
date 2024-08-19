import React, { useState } from 'react';
import styles from './ChildChatModal.module.css';
import ChatList from '../LeftPanel/ChatList';
import RightPanel from '../RightPanel/RightPanel';
import { useChatStore } from '../../../../../store/messengerStore';

const ChildChatModal = ({ isOpen, onClose }) => {
  const [selectedChat, setSelectedChat] = useState(null);
  const { chatRooms, setSelectedChat: setStoreSelectedChat } = useChatStore();

  const handleChatSelect = (chat) => {
    setSelectedChat(chat);
    setStoreSelectedChat(chat);
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <button className={styles.closeButton} onClick={onClose}>
          &times;
        </button>
        {!selectedChat ? (
          <ChatList chatRooms={chatRooms} onChatSelect={handleChatSelect} />
        ) : (
          <RightPanel selectedChat={selectedChat} />
        )}
      </div>
    </div>
  );
};

export default ChildChatModal;
