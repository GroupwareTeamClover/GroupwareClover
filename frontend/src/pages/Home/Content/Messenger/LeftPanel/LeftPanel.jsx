import React from 'react';
import styles from '../Messenger.module.css';
import SearchBar from './SearchBar';
import OnlineUsers from './OnlineUsers';
import ChatList from './ChatList';
import AddChat from './AddChat';

const LeftPanel = ({ onChatSelect }) => {
  return (
    <div className={styles.leftPanel}>

      <OnlineUsers />
      <ChatList onChatSelect={onChatSelect} />
      <AddChat/>  
    </div>
  );
};

export default LeftPanel;