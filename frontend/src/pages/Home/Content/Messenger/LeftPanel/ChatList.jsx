import React from 'react';
import styles from '../Messenger.module.css';
import { useChatStore } from '../../../../../store/messengerStore';
import { sendMessage } from '../../../../../commons/websocket';
import axios from 'axios';
import { BaseUrl } from '../../../../../commons/config';

const ChatList = ({ chatRooms, onChatSelect }) => {
  const { setSelectedChat } = useChatStore();

  const handleChatSelect = (chat) => {
    setSelectedChat(chat);

    // 사용자가 채팅방을 선택할 때 addUser 메시지 전송
    const sessionUser = JSON.parse(sessionStorage.getItem('sessionUser'));
    const message = {
      roomSeq: chat.roomSeq,
      messageType: 'JOIN',
      senderSeq: sessionUser.empSeq,
      senderName: sessionUser.empName
    };
    sendMessage("/app/chat.addUser", message);
  };
  console.log(chatRooms);

  return (
    <div className={styles.chatList}>
      {chatRooms.map((chat) => (
        <div 
          key={chat.roomSeq} 
          className={styles.chatItem} 
          onClick={() => handleChatSelect(chat)}
        >
          <div className={styles.avatar}> <img className={styles.avatar} src={chat.roomAvatar} alt="Avatar" /></div>
          <div className={styles.chatInfo}>
            <h4>{chat.roomName}</h4>
            <p>{chat.lastMessage}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ChatList;
