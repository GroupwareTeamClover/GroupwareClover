import React, { useState, useEffect } from 'react';
import styles from '../Messenger.module.css';
import { Modal } from '../../../../../components/Modal/Modal';
import { Folder } from '../../../../../components/Folder/Folder';

import UserSelectModal from './UserSelectModal';
import { useChatStore } from '../../../../../store/messengerStore';
import axios from 'axios';
import { BaseUrl } from '../../../../../commons/config';

const ChatList = ({ chatRooms, onChatSelect, onCreateChat }) => {

  const [isModalOpen, setIsModalOpen] = useState(false);
  const { onlineUsers, setOnlineUsers, addChatRoom, setSelectedChat } = useChatStore();

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div className={styles.chatList}>
      {/* 채팅방 목록을 매핑하여 표시 */}
      {chatRooms.map((chat) => (
        <div 
          key={chat.roomSeq} 
          className={styles.chatItem} 
          onClick={() => onChatSelect(chat)}
        >
          <div className={styles.avatar}></div>
          <div className={styles.chatInfo}>
            <h4>{chat.roomName}</h4>
            <p>{chat.lastMessage}</p>
          </div>
        </div>
      ))}
      {/* 새 채팅 시작 버튼 */}
      {/* <button onClick={() => onCreateChat(1)}>새 채팅 시작</button> */}
      <button className={styles.addUserButton} onClick={openModal}> + </button>
      <Modal isOpen={isModalOpen} onClose={closeModal}>
              <UserSelectModal onClose={closeModal}/>
      </Modal>
      
   
    </div>
  );
};

export default ChatList;