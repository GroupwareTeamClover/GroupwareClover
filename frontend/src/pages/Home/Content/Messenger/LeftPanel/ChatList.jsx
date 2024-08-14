import React, { useEffect } from 'react';
import styles from '../Messenger.module.css';
import { useChatStore } from '../../../../../store/messengerStore';
import { sendMessage, connectWebSocket } from '../../../../../commons/websocket';
import { format } from 'date-fns';

const ChatList = ({ chatRooms, onChatSelect }) => {
  const { setSelectedChat, addChatRoom, updateChatRoom } = useChatStore();

  useEffect(() => {
    const handleMessage = (message) => {
      if (message.type === 'NEW_CHAT_ROOM') {
        console.log("새로운 채팅방 생성됨:", message.room);
        addChatRoom(message.room);
      } else if (message.type === 'CHAT') {
        updateChatRoom(message.roomSeq, {
          lastMessage: message.messageContent,
          lastMessageTime: message.sendTime,
          unreadCount: (chatRooms.find(room => room.roomSeq === message.roomSeq)?.unreadCount || 0) + 1
        });
      }
    };

    const disconnect = connectWebSocket(handleMessage);

    return () => {
      if (disconnect) disconnect();
    };
  }, [addChatRoom, updateChatRoom]);

  const handleChatSelect = (chat) => {
    setSelectedChat(chat);
    onChatSelect(chat);
    const sessionUser = JSON.parse(sessionStorage.getItem('sessionUser'));
    sendMessage("/app/chat.addUser", {
      roomSeq: chat.roomSeq,
      messageType: 'JOIN',
      senderSeq: sessionUser.empSeq,
      senderName: sessionUser.empName
    });
    // 읽음 처리
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
            <p>{chat.lastMessage}</p>
          </div>
          <div className={styles.chatMeta}>
            <span className={styles.time}>{formatMessageTime(chat.lastMessageTime)}</span>
            {chat.unreadCount > 0 && (
              <span className={styles.unreadCount}>{chat.unreadCount}</span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ChatList;