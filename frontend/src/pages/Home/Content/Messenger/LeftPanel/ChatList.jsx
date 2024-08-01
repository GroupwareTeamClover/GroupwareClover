import React, { useState, useEffect } from 'react';
import styles from '../Messenger.module.css';
import { useChatStore } from '../../../../../store/messengerStore';
import axios from 'axios';
import { BaseUrl } from '../../../../../commons/config';
// room 정보, 선택된 채팅 정보 넘겨받아옴
const ChatList = ({ chatRooms, onChatSelect}) => {

  const { onlineUsers, setOnlineUsers, addChatRoom, setSelectedChat } = useChatStore(); // 사용하려나?

  return (
    <div className={styles.chatList}>
      {/* 채팅방 목록을 매핑하여 표시 */}
      {chatRooms.map((chat) => (
        <div 
          key={chat.roomSeq} 
          className={styles.chatItem} 
          onClick={() => onChatSelect(chat)}
        >
          <div className={styles.avatar}> <img className={styles.avatar} src={chat.roomAvatar} ></img></div>
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