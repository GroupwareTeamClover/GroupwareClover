import React, { useState } from 'react';
import DragModal from '../../../../../components/Modal/DragModal';
import styles from './ChildChatModal.module.css';
import ChatList from '../LeftPanel/ChatList';
import RightPanel from '../RightPanel/RightPanel';
import { useChatStore } from '../../../../../store/messengerStore';
import MessengerSideMenu from '../MessengerSideMenu/MessengerSideMenu';

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
          <RightPanel selectedChat={chat} />
        </DragModal>
      ))}
    </>
  );
};

export default ChildChatModal;