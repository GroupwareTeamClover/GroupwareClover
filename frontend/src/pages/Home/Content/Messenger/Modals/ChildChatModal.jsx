import React, { useState } from 'react';
import styles from './ChildChatModal.module.css';
import ChatList from '../LeftPanel/ChatList';
import RightPanel from '../RightPanel/RightPanel';
import { useChatStore } from '../../../../../store/messengerStore';

const ChildChatModal = ({ isOpen, onClose }) => {
  const [openChatModals, setOpenChatModals] = useState([]);
  const { chatRooms, setSelectedChat: setStoreSelectedChat, updateChatRoom } = useChatStore();

  const handleChatSelect = (chat) => {
    setStoreSelectedChat(chat);
    setOpenChatModals((prevModals) => [...prevModals, chat]);
  };

  const handleCloseChatModal = (chatSeq) => {
    setOpenChatModals((prevModals) =>
      prevModals.filter((modalChat) => modalChat.roomSeq !== chatSeq)
    );
  };

  if (!isOpen) return null;

  return (
    <>
      <div className={styles.modalOverlay}>
        <div className={styles.modalContent}>
          <button className={styles.closeButton} onClick={onClose}>
            &times;
          </button>
          <ChatList chatRooms={chatRooms} onChatSelect={handleChatSelect} updateChatRoom={updateChatRoom} />
        </div>
      </div>

      {openChatModals.map((chat) => (
        <div key={chat.roomSeq} className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <button
              className={styles.closeButton}
              onClick={() => handleCloseChatModal(chat.roomSeq)}
            >
              &times;
            </button>
            <RightPanel selectedChat={chat} />
          </div>
        </div>
      ))}
    </>
  );
};

export default ChildChatModal;
