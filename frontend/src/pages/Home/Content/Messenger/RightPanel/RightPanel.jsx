import React from 'react';
import styles from '../Messenger.module.css';
import ChatWindow from './ChatWindow';
import EmptyChatWindow from './EmptyChatWindow';

const RightPanel = ({ selectedChat }) => {
  return (
    <div className={styles.rightPanel}>
      {selectedChat ? (
        <ChatWindow chat={selectedChat} />
      ) : (
        <EmptyChatWindow />
      )}
    </div>
  );
};

export default RightPanel;