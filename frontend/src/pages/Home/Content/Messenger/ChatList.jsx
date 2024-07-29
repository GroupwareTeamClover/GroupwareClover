import React from 'react';
import styles from './Messenger.module.css';

const ChatList = () => {
  return (
    <div className={styles.chatList}>
      <div className={styles.chatItem}>
        <div className={styles.avatar}></div>
        <div className={styles.chatInfo}>
          <h4>정경호</h4>
          <p>5:40분입니다</p>
        </div>
        <span className={styles.time}>5 min ago</span>
      </div>
      {/* 더 많은 채팅 항목들 */}
    </div>
  );
};

export default ChatList;