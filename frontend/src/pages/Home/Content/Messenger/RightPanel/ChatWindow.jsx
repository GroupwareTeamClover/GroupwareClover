import React, { useState, useEffect } from 'react';
import { BaseUrl } from '../../../../../commons/config';
import styles from '../Messenger.module.css';

const ChatWindow = ({ chat, socket }) => {
  // 메시지 목록을 저장하는 상태
  const [messages, setMessages] = useState([]);
  // 입력 필드의 값을 저장하는 상태
  const [inputMessage, setInputMessage] = useState('');

  useEffect(() => {
    // 채팅방이 변경될 때마다 메시지 목록을 가져옴
    fetchMessages();

    // WebSocket이 연결되었을 때 메시지 수신 이벤트 리스너 설정
    if (socket) {
      socket.onmessage = (event) => {
        const message = JSON.parse(event.data);
        // 현재 채팅방의 메시지인 경우에만 추가
        if (message.roomSeq === chat.roomSeq) {
          setMessages(prevMessages => [...prevMessages, message]);
        }
      };
    }
  }, [chat, socket]);

  // 서버로부터 메시지 목록을 가져오는 함수
  const fetchMessages = async () => {
    try {
      const response = await fetch(`${BaseUrl()}/chat/rooms/${chat.roomSeq}/messages`);
      const data = await response.json();
      setMessages(data);
    } catch (error) {
      console.error('메시지를 가져오는 중 오류 발생:', error);
      // 오류 로직 추가시 사용
    }
  };

  // 메시지를 전송하는 함수
  const sendMessage = () => {
    if (inputMessage.trim() && socket) {
      const message = {
        roomSeq: chat.roomSeq,
        messageContent: inputMessage,
        messageType: 'CHAT',
        senderSeq: 1  // 로그인 되면 변경
      };
      // WebSocket을 통해 메시지 전송
      socket.send(JSON.stringify(message));
      // 입력 필드 초기화
      setInputMessage('');
    }
  };

  return (
    <div className={styles.chatWindow}>
      <div className={styles.messages}>
        {/* 메시지 목록 렌더링 */}
        {messages.map((message, index) => (
          <div key={index} className={`${styles.message} ${message.senderSeq === 1 ? styles.sent : ''}`}>
            <div className={styles.messageContent}>{message.messageContent}</div>
          </div>
        ))}
      </div>
      <div className={styles.chatInput}>
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          // 이벤트에 대해선 좀 나중에
          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
        />
        <button onClick={sendMessage}>전송</button>
      </div>
    </div>
  );
};

export default ChatWindow;