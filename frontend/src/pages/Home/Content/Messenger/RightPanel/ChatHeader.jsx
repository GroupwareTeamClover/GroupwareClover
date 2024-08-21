import React, { useState, useRef, useEffect } from 'react';
import styles from './ChatWindow.module.css';
import { FaSearch, FaEllipsisV, FaTimes, FaBell, FaBellSlash } from 'react-icons/fa';

const ChatHeader = ({ chat, onSearch, onLeaveChat, onClearChat, onToggleNotifications }) => {
  const [showMenu, setShowMenu] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const searchInputRef = useRef(null);

  useEffect(() => {
    if (isSearching) {
      searchInputRef.current.focus();
    }
  }, [isSearching]);

  useEffect(() => {
    console.log('ChatHeader - chat 객체:', chat);
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
    onToggleNotifications(newState);
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
            {chat.isOnline ? '온라인' : '오프라인'}
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
          {notificationsEnabled ? <FaBell /> : <FaBellSlash />}
        </button>
        <div className={styles.menuContainer}>
          <button onClick={() => setShowMenu(!showMenu)} className={styles.iconButton}>
            <FaEllipsisV />
          </button>
          {showMenu && (
            <div className={styles.dropdownMenu}>
              <button onClick={onLeaveChat}>채팅방 나가기</button>
              <button onClick={onClearChat}>대화내용 삭제</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatHeader;