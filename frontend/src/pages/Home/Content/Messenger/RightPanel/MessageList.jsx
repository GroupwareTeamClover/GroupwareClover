import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';
import styles from '../Messenger.module.css';

const MessageList = ({ messages, chat, currentUserSeq, searchTerm }) => {
  const highlightSearchTerm = (content, term) => {
    if (!term) return content;
    const parts = content.split(new RegExp(`(${term})`, 'gi'));
    return parts.map((part, index) => 
      part.toLowerCase() === term.toLowerCase() ? <mark key={index}>{part}</mark> : part
    );
  };

  const renderMessage = (message, index) => {
    const isCurrentUser = message.senderSeq === currentUserSeq;
    return (
      <div
        key={message.messageSeq || index}
        className={`${styles.messageContainer} ${isCurrentUser ? styles.sent : styles.received}`}
      >
        {!isCurrentUser && (
          <div className={styles.senderInfo}>
            <img 
              src={message.senderAvatar || 'https://groupwareteamclover.s3.ap-northeast-2.amazonaws.com/profile/profile3.png'} 
              alt={message.senderName} 
              className={styles.senderAvatar}
            />
          </div>
        )}
        <div className={styles.messageWrapper}>
          {!isCurrentUser && chat.roomType === 'group' && (
            <span className={styles.senderName}>{message.senderName}</span>
          )}
          <div className={styles.messageContent}>
            {highlightSearchTerm(message.messageContent, searchTerm)}
          </div>
          <span className={styles.messageTime}>
            {formatDistanceToNow(new Date(message.sendTime), { addSuffix: true, locale: ko })}
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className={styles.messages}>
      {messages.map(renderMessage)}
    </div>
  );
};

export default MessageList;