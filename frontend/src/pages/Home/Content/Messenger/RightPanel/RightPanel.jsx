import React from 'react';
import styles from '../Messenger.module.css';
import ChatWindow from './ChatWindow';

const RightPanel = ({ selectedChat }) => {
  return (
    <div className={styles.rightPanel}>
      {selectedChat ? (
        <ChatWindow chat={selectedChat} />
      ) : (
        <div className={styles.emptyChatWindow}>
          <p>채팅방을 선택해주세요.</p>
        </div>
      )}
    </div>
  );
};

export default RightPanel;