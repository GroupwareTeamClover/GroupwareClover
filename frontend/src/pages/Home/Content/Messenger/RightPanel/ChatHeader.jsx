import React, { useState, useRef, useEffect } from 'react';
import styles from './ChatWindow.module.css';
import { FaSearch, FaTimes, FaBell, FaBellSlash, FaSignOutAlt } from 'react-icons/fa';

const ChatHeader = ({ chat, onSearch, onLeaveChat, onToggleNotifications }) => {
  const [isSearching, setIsSearching] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [notificationsEnabled, setNotificationsEnabled] = useState(chat.notificationsEnabled);
  const searchInputRef = useRef(null);

  useEffect(() => {
    if (isSearching) {
      searchInputRef.current.focus();
    }
  }, [isSearching]);

  useEffect(() => {
    console.log('ChatHeader - chat 객체:', chat);
    setNotificationsEnabled(chat.notificationsEnabled);
  }, [chat]);

  const handleSearchClick = () => {
    setIsSearching(!isSearching);
    if (!isSearching) {
      setSearchTerm('');
    } else {
      onSearch('');
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    onSearch(e.target.value);
  };

  const handleToggleNotifications = () => {
    const newState = !notificationsEnabled;
    setNotificationsEnabled(newState);
    onToggleNotifications(chat.roomSeq, newState);
  };

  const handleLeaveChat = () => {

      onLeaveChat(chat.roomSeq);
  
  };

  return (
    <div className={styles.chatHeader}>
      <div className={styles.chatInfo}>
        {chat.roomType === 'group' ? (
          <div className={styles.groupAvatar}>
            {chat.roomAvatar.split(',').slice(0, 4).map((avatar, index) => (
              <img key={index} src={avatar.trim()} alt={`Member ${index + 1}`} />
            ))}
          </div>
        ) : (
          <img className={styles.avatar} src={chat.customRoomAvatar || chat.roomAvatar} alt="Avatar" />
        )}
        <div className={styles.roomNameContainer}>
          <h2 className={styles.roomName}>{chat.customRoomName || chat.roomName}</h2>
          <span className={chat.isOnline ? styles.onlineStatus : styles.offlineStatus}>
            {chat.isOnline ? '오프라인' : '온라인'}
          </span>
        </div>
      </div>
      <div className={styles.headerControls}>
        <div className={`${styles.searchContainer} ${isSearching ? styles.active : ''}`}>
          {isSearching && (
            <input
              ref={searchInputRef}
              type="text"
              placeholder="메시지 검색"
              value={searchTerm}
              onChange={handleSearchChange}
              className={styles.searchInput}
            />
          )}
        </div>
        <button onClick={handleSearchClick} className={styles.iconButton}>
          {isSearching ? <FaTimes /> : <FaSearch />}
        </button>
        <button onClick={handleToggleNotifications} className={styles.iconButton}>
          {notificationsEnabled ? <FaBellSlash /> : <FaBell />}
        </button>
        <button onClick={handleLeaveChat} className={styles.iconButton} title="채팅방 나가기">
          <FaSignOutAlt />
        </button>
      </div>
    </div>
  );
};

export default ChatHeader;