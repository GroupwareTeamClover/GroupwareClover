import React from 'react';
import styles from '../Messenger.module.css';
import { useChatStore } from '../../../../../store/messengerStore';
import { sendMessage } from '../../../../../commons/websocket';
import { format } from 'date-fns';

const ChatList = ({ chatRooms, onChatSelect, updateChatRoom }) => {
  const { markMessageAsRead } = useChatStore(); // 읽음 처리용 함수 가져오기

  const handleChatSelect = async (chat) => {
    onChatSelect(chat);
    const sessionUser = JSON.parse(sessionStorage.getItem('sessionUser'));
    sendMessage("/app/chat.addUser", {
      roomSeq: chat.roomSeq,
      messageType: 'JOIN',
      senderSeq: sessionUser.empSeq,
      senderName: sessionUser.empName
    });

    // 선택한 채팅방에 대해 읽음 처리
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

  const currentUserSeq = JSON.parse(sessionStorage.getItem('sessionUser')).empSeq;

  return (
    <div className={styles.chatList}>
      {chatRooms.map((chat) => (
        <div
          key={chat.roomSeq}
          className={styles.chatItem}
          onClick={() => handleChatSelect(chat)}
        >
          <div className={chat.roomType === 'group' ? styles.groupAvatar : styles.avatar}>
            {chat.roomType === 'group' ? (
              chat.roomAvatar.split(',').slice(0, 4).map((avatar, index) => (
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
            {chat.unreadCount > 0 && chat.lastMessage.senderSeq !== currentUserSeq && (
              <span className={styles.unreadCount}>{chat.unreadCount}</span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ChatList;
