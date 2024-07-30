import React from 'react';
import styles from '../Messenger.module.css';
import SearchBar from './SearchBar';
import OnlineUsers from './OnlineUsers';
import ChatList from './ChatList';

const LeftPanel = ({ onChatSelect }) => {
  return (
    <div className={styles.leftPanel}>
      <SearchBar />
      <OnlineUsers />
      <ChatList onChatSelect={onChatSelect} />
    </div>
  );
};

export default LeftPanel;