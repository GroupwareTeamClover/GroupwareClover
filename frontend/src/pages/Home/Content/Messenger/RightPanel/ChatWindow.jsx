import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { BaseUrl } from '../../../../../commons/config';
import styles from '../Messenger.module.css';
import { formatDistanceToNow } from 'date-fns'; 
import { ko } from 'date-fns/locale'; 
import { useChatStore } from '../../../../../store/messengerStore'; // Zustand 스토어 경로 수정

const ChatWindow = ({ chat }) => {
  // Zustand 스토어에서 필요한 상태와 액션을 가져옴
  const { messages, addMessage } = useChatStore();
  // 입력 메시지를 관리하는 로컬 상태
  const [inputMessage, setInputMessage] = useState('');

  // 채팅방이 변경될 때마다 메시지를 불러옵니다.
  useEffect(() => {
    if (!messages[chat.roomSeq]) {
      fetchMessages();
    }
  }, [chat.roomSeq, messages]);

  // 서버에서 메시지를 불러오는 함수
  const fetchMessages = useCallback(async () => {
    try {
      const response = await axios.get(`${BaseUrl()}/chat/rooms/${chat.roomSeq}/messages`);
      // 받아온 메시지를 Zustand 스토어에 추가합니다.
      response.data.forEach(message => addMessage(chat.roomSeq, message));
    } catch (error) {
      console.error('메시지를 가져오는 중 오류 발생:', error);
      // TODO: 사용자에게 오류 메시지 표시
    }
  }, [chat.roomSeq, addMessage]);

  // 메시지를 전송하는 함수
  const sendMessage = useCallback(async () => {
    if (inputMessage.trim()) {
      try {
        const response = await axios.post(`${BaseUrl()}/chat/rooms/${chat.roomSeq}/messages`, {
          messageContent: inputMessage,
          messageType: 'CHAT'
        });
        // 전송한 메시지를 Zustand 스토어에 추가합니다.
        addMessage(chat.roomSeq, response.data);
        setInputMessage(''); // 입력 필드를 비웁니다.
      } catch (error) {
        console.error('메시지 전송 중 오류 발생:', error);
        // TODO: 사용자에게 오류 메시지 표시
      }
    }
  }, [chat.roomSeq, inputMessage, addMessage]);

  return (
    <div className={styles.chatWindow}>
      <div className={styles.chatHeader}>
        <h2>{chat.roomName}</h2>
        <span className={styles.status}>Active</span>
      </div>
      <div className={styles.messages}>
        {/* 현재 채팅방의 메시지를 렌더링합니다. */}
        {messages[chat.roomSeq]?.map((message, index) => (
          <div key={index} className={`${styles.message} ${message.senderSeq === chat.empSeq ? styles.sent : ''}`}>
            <div className={styles.messageWrapper}>
              <div className={styles.messageContent}>{message.messageContent}</div>
              <span className={styles.messageTime}>
                {/* 메시지 전송 시간을 상대적 시간으로 표시합니다. */}
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
          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          placeholder="메시지를 입력하세요..."
        />
        <button onClick={sendMessage}>전송</button>
      </div>
    </div>
  );
};

export default ChatWindow;