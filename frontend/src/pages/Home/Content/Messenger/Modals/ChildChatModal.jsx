import React, { useState } from 'react';
import styles from './ChildChatModal.module.css';
import ChatList from '../LeftPanel/ChatList';
import RightPanel from '../RightPanel/RightPanel';

const ChildChatModal = ({ isOpen, onClose, chatRooms }) => {
  const [selectedChat, setSelectedChat] = useState(null);

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <button className={styles.closeButton} onClick={onClose}>
          &times; 
        </button>
        {!selectedChat ? (
          <ChatList chatRooms={chatRooms} onChatSelect={setSelectedChat} />
        ) : (
          <RightPanel selectedChat={selectedChat} />
        )}
      </div>
    </div>
  );
};

export default ChildChatModal;
