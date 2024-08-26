import React, { useState, useEffect } from 'react';
import styles from '../Messenger.module.css';
import { useChatStore } from '../../../../../store/messengerStore';
import { sendMessage } from '../../../../../commons/websocket';
import { format } from 'date-fns';

const SearchBar = ({ onSearch }) => {
  return (
    <div className={styles.searchBar}>
      <input 
        type="text" 
        placeholder="대화방, 마지막 메시지 검색" 
        onChange={(e) => onSearch(e.target.value)}
      />
    </div>
  );
};

const ChatList = ({ chatRooms, onChatSelect, updateChatRoom }) => {
  const { markMessageAsRead } = useChatStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredChatRooms, setFilteredChatRooms] = useState(chatRooms);

  useEffect(() => {
    const filtered = chatRooms.filter(chat => 
      (chat.customRoomName?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false) ||
      (chat.roomName?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false) ||
      (chat.lastMessage?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false)
    );
    setFilteredChatRooms(filtered);
  }, [searchTerm, chatRooms]);

  const handleChatSelect = async (chat) => {
    onChatSelect(chat);
    const sessionUser = JSON.parse(sessionStorage.getItem('sessionUser'));
    sendMessage("/app/chat.addUser", {
      roomSeq: chat.roomSeq,
      messageType: 'JOIN',
      senderSeq: sessionUser.empSeq,
      senderName: sessionUser.empName
    });

    markMessageAsRead(chat.roomSeq, sessionUser.empSeq);
    updateChatRoom(chat.roomSeq, { unreadCount: 0 });
  };

  const formatMessageTime = (time) => {
    if (!time) return '';
    const messageDate = new Date(time);
    const now = new Date();
    if (messageDate.toDateString() === now.toDateString()) {
      return format(messageDate, 'HH:mm');
    } else {
      return format(messageDate, 'MM/dd');
    }
  };

  const currentUserSeq = JSON.parse(sessionStorage.getItem('sessionUser'))?.empSeq;

  return (
    <>
      <SearchBar onSearch={setSearchTerm} />
      <div className={styles.chatList}>
        {filteredChatRooms.map((chat) => (
          <div
            key={chat.roomSeq}
            className={styles.chatItem}
            onClick={() => handleChatSelect(chat)}
          >
            <div className={chat.roomType === 'group' ? styles.groupAvatar : styles.avatar}>
              {chat.roomType === 'group' ? (
                chat.roomAvatar?.split(',').slice(0, 4).map((avatar, index) => (
                  <img key={index} src={avatar.trim()} alt={`Member ${index + 1}`} />
                ))
              ) : (
                <img src={chat.customRoomAvatar || chat.roomAvatar} alt="Avatar" />
              )}
            </div>
            <div className={styles.chatInfo}>
              <h4>{chat.customRoomName || chat.roomName}</h4>
              <p>
                {chat.lastMessage ? (
                  chat.lastMessage.length > 8
                     ? `${chat.lastMessage.substring(0, 8)}...`
                     : chat.lastMessage
                ) : ''}
              </p>
            </div>
            <div className={styles.chatMeta}>
              <span className={styles.time}>{formatMessageTime(chat.lastMessageTime)}</span>
              {chat.unreadCount > 0 && chat.lastMessage?.senderSeq !== currentUserSeq && (
                <span className={styles.unreadCount}>{chat.unreadCount}</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default ChatList;