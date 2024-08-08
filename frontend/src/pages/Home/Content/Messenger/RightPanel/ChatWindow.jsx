import React, { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';
import { BaseUrl } from '../../../../../commons/config';
import styles from '../Messenger.module.css';
import { formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';
import { useChatStore } from '../../../../../store/messengerStore';
import { sendMessage, subscribeToRoom } from '../../../../../commons/websocket';

const ChatWindow = ({ chat }) => {
  const { messages, setMessages, addMessage } = useChatStore();
  const [inputMessage, setInputMessage] = useState('');
  const messagesEndRef = useRef(null);

  const currentMessages = messages[chat.roomSeq] || [];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
    console.log('Messages updated:', currentMessages);
  }, [currentMessages]);

  const fetchMessages = useCallback(async () => {
    try {
      const response = await axios.get(`${BaseUrl()}/chat/rooms/${chat.roomSeq}/messages`);
      console.log('Fetched messages:', response.data);
      setMessages(chat.roomSeq, response.data);
    } catch (error) {
      console.error('메시지를 가져오는 중 오류 발생:', error);
    }
  }, [chat.roomSeq, setMessages]);

  useEffect(() => {
    if (chat.roomSeq) {
      fetchMessages();
      // 채팅방 구독
      const unsubscribe = subscribeToRoom(chat.roomSeq, (message) => {
        console.log('Received message:', message);
        addMessage(chat.roomSeq, message);
      });

      // 컴포넌트 언마운트 시 구독 해제
      return () => {
        if (unsubscribe) unsubscribe();
      };
    }
  }, [chat.roomSeq, fetchMessages, addMessage]);

  const sendChatMessage = useCallback(() => {
    if (inputMessage.trim()) {
      const message = {
        roomSeq: chat.roomSeq,
        messageContent: inputMessage,
        messageType: 'CHAT',
        senderSeq: JSON.parse(sessionStorage.getItem('sessionUser')).empSeq,
        sendTime: new Date().toISOString()
      };

      sendMessage("/app/chat.sendMessage", message);
      console.log("Sending message:", message);

      setInputMessage('');
    }
  }, [chat.roomSeq, inputMessage]);

  console.log('Current chat room:', chat.roomSeq);
  console.log('Message list:', currentMessages);

  return (
    <div className={styles.chatWindow}>
      <div className={styles.chatHeader}>
        <img className={styles.avatar} src={chat.roomAvatar} alt="Room Avatar" />
        <h2>{chat.roomName}</h2>
        <span className={styles.status}>Active</span>
      </div>

      <div className={styles.messages}>
        {currentMessages.map((message, index) => (
          <div
            key={message.messageSeq || index}
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
        <div ref={messagesEndRef} />
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
export default React.memo(ChatWindow);
