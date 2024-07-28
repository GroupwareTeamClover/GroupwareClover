import React from 'react';
// import styles from './ChatMain.module.css';
import styles from './Messenger.module.css';
import ChatList from './ChatList';
import ChatWindow from './ChatWindow';
import OnlineUsers from './OnlineUsers';
import SearchBar from './SearchBar';
import { baseUrl } from '../../../../api/members';

export const ChatMain = () => {
    return (
      <div className={styles.container}>
        <div className={styles.leftPanel}>
          <SearchBar />
          <OnlineUsers />
          <ChatList />
        </div>
        <div className={styles.rightPanel}>
          <ChatWindow />
        </div>
      </div>
    );
  };