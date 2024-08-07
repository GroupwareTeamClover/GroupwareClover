import React, { useEffect } from 'react';
import styles from '../Messenger.module.css';
import { useChatStore } from '../../../../../store/messengerStore';
import { sendMessage, subscribeToRoom } from '../../../../../commons/websocket';
import axios from 'axios';
import { BaseUrl } from '../../../../../commons/config';
import { connectWebSocket } from '../../../../../commons/websocket';

const ChatList = ({ chatRooms, onChatSelect }) => {
  const { setSelectedChat, addChatRoom } = useChatStore();

  useEffect(() => {
    const handleMessage = (message) => {
      if (message.type === 'NEW_CHAT_ROOM') {
        console.log("New chat room received:", message.room);
        addChatRoom(message.room);
      }
      // 다른 타입의 메시지 처리...
    };

    const disconnect = connectWebSocket(handleMessage);

    return () => {
      if (disconnect) disconnect();
    };
  }, [addChatRoom]);

  const handleChatSelect = (chat) => {
    setSelectedChat(chat);

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
          <div className={styles.avatar}> 
            <img className={styles.avatar} src={chat.roomAvatar} alt="Avatar" />
          </div>
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