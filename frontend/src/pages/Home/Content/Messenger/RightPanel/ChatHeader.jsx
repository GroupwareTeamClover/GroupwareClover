import React, { useState, useRef, useEffect } from 'react';
import styles from '../Messenger.module.css';
import { FaSearch, FaEllipsisV, FaTimes, FaBell, FaBellSlash } from 'react-icons/fa';

const ChatHeader = ({ chat, onSearch, onLeaveChat, onClearChat, onToggleNotifications }) => {
  const [showMenu, setShowMenu] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true); // 알림 상태 추가
  const searchInputRef = useRef(null);

  useEffect(() => {
    if (isSearching) {
      searchInputRef.current.focus();
    }
  }, [isSearching]);

  const handleSearchClick = () => {
    setIsSearching(!isSearching);
    if (!isSearching) {
      setSearchTerm('');
    } else {
      onSearch(''); // Clear search when closing
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
        <img className={styles.avatar} src={chat.customRoomAvatar || chat.roomAvatar} alt="Avatar" />
        <h2>{chat.customRoomName || chat.roomName}</h2>
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