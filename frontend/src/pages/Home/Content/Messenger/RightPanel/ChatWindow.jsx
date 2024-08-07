import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { BaseUrl } from '../../../../../commons/config';
import styles from '../Messenger.module.css';
import { formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';
import { useChatStore } from '../../../../../store/messengerStore';
import { sendMessage } from '../../../../../commons/websocket';

const ChatWindow = ({ chat }) => {
  const { messages, setMessages, markMessageAsRead, unreadCounts, addMessage, setUnreadCounts } = useChatStore();
  const [inputMessage, setInputMessage] = useState('');

  useEffect(() => {
    if (chat) {
      markMessageAsRead(chat.roomSeq);
      fetchMessages();
    }
  }, [chat]);

  const sendChatMessage = useCallback(() => {
    if (inputMessage.trim()) {
      const message = {
        roomSeq: chat.roomSeq,
        messageContent: inputMessage,
        messageType: 'CHAT',
        senderSeq: JSON.parse(sessionStorage.getItem('sessionUser')).empSeq, 
        sendTime: new Date().toISOString() 
      };

      // 서버로 메시지 전송
      sendMessage("/app/chat.sendMessage", message);
      console.log("메시지 확인", message);

      // 로컬 상태 즉시 업데이트
      addMessage(chat.roomSeq, message);

      setInputMessage('');
    } else {
      console.error('메시지가 비어 있습니다.');
    }
  }, [chat.roomSeq, inputMessage, addMessage]);

  const fetchMessages = useCallback(async () => {
    try {
      const response = await axios.get(`${BaseUrl()}/chat/rooms/${chat.roomSeq}/messages`);
      setMessages(chat.roomSeq, response.data);
    } catch (error) {
      console.error('메시지를 가져오는 중 오류 발생:', error);
    }
  }, [chat.roomSeq, setMessages]);

  return (
    <div className={styles.chatWindow}>
      <div className={styles.chatHeader}>
        <img className={styles.avatar} src={chat.roomAvatar} alt="Room Avatar" />
        <h2>{chat.roomName}</h2>
        <span className={styles.status}>Active</span>
      </div>

      <div className={styles.messages}>
        {messages[chat.roomSeq]?.map((message, index) => (
          <div 
            key={index} 
            className={`${styles.message} ${message.senderSeq === JSON.parse(sessionStorage.getItem('sessionUser')).empSeq ? styles.sent : ''}`}
          >
            <div className={styles.messageWrapper}>
              <div className={styles.messageContent}>{message.messageContent}</div>
              <span className={styles.messageTime}>
                {formatDistanceToNow(new Date(message.sendTime), { addSuffix: true, locale: ko })}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className={styles.chatInput}>
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && sendChatMessage()}
          placeholder="메시지를 입력하세요..."
        />
        <button onClick={sendChatMessage}>전송</button>
      </div>
    </div>
  );
};

export default ChatWindow;
