import React, { useEffect, useRef } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';
import styles from '../Messenger.module.css';
import { useChatStore } from '../../../../../store/messengerStore';
import { sendMessage } from '../../../../../commons/websocket';

const MessageList = ({ messages, chat, currentUserSeq, searchTerm }) => {
  const { markMessageAsRead, updateMessageUnreadCount } = useChatStore();
  const lastMessageSeqRef = useRef(null);

  useEffect(() => {
    if (chat && messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      
      // 마지막 메시지가 수신되었을 때, 이를 읽음 처리
      if (lastMessage.senderSeq !== currentUserSeq || chat.roomType === 'group') {
        sendMessage("/app/chat.readMessages", { 
          roomSeq: chat.roomSeq,
          messageSeq: lastMessage.messageSeq
        });
        markMessageAsRead(chat.roomSeq, lastMessage.messageSeq);
        lastMessageSeqRef.current = lastMessage.messageSeq;
      }
    }
  }, [messages, chat, currentUserSeq, markMessageAsRead]);

  const highlightSearchTerm = (content, term) => {
    if (!term) return content;
    const parts = content.split(new RegExp(`(${term})`, 'gi'));
    return parts.map((part, index) =>
      part.toLowerCase() === term.toLowerCase() ? <mark key={index}>{part}</mark> : part
    );
  };

  const renderMessage = (message, index) => {
    const isCurrentUser = message.senderSeq === currentUserSeq;
    const unreadCount = message.unreadCount || 0; // 서버에서 받아온 읽지 않은 사용자 수

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
          <div className={styles.messageMeta}>
            <span className={styles.messageTime}>
              {formatDistanceToNow(new Date(message.sendTime), { addSuffix: true, locale: ko })}
            </span>
            {unreadCount > 0 && (
              <span className={styles.unreadCount2}>
                {unreadCount}명이 읽지 않음
              </span>
            )}
          </div>
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
