import React from 'react';
import styles from '../Messenger.module.css';

const ChatList = ({ chatRooms, onChatSelect, onCreateChat }) => {
  return (
    <div className={styles.chatList}>
      {/* 채팅방 목록을 매핑하여 표시 */}
      {/* {chatRooms.map((chat) => (
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
      ))} */}
      {/* 새 채팅 시작 버튼 */}
      <button onClick={() => onCreateChat(1)}>새 채팅 시작</button>
    </div>
  );
};

export default ChatList;