import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './Messenger.module.css';

const ChatWindow = () => {
  const [messages, setMessages] = useState([]); // 메시지 목록을 저장
  const [inputMessage, setInputMessage] = useState(''); // 입력 필드 값 저장
  
  const [socket, setSocket] = useState(null); // 웹소켓 연결을 저장
  const [currentRoom, setCurrentRoom] = useState(null); // 현재 활성화된 채팅방 ID 저장

  // 컴포넌트가 마운트될 때 WebSocket 연결을 설정하기 위해
  useEffect(() => {
    // 새로운 웹 소켓 연결 생성
    const newSocket = new WebSocket('ws://localhost:80/chat');
    setSocket(newSocket);

    // 메시지를 수신했을 때 실행되는 이벤트 핸들러
    newSocket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      setMessages(prevMessages => [...prevMessages, message]); // 새 메시지를 기존 메시지 목록에 추가
    };

    // 컴포넌트가 언마운트 될 때 WebSocket 연결을 종료하기 위해
    return () => newSocket.close();
  }, []);

  // 메시지 전송용 함수
  const handleSendMessage = () => {
    if (inputMessage.trim() !== '' && socket && currentRoom) {
        // 메시지 객체 생성
      const message = {
        messageContent: inputMessage,
        messageType: 'CHAT',
        roomSeq: currentRoom,
        senderSeq: 1 // 임시 사용자 ID
      };
      socket.send(JSON.stringify(message));
      setInputMessage('');
    }
  };

  // 새로운 채팅방 생성 함수, 추후 이동해야함.
  const createRoom = async () => {
    try {
      const response = await axios.post('/api/chat/rooms', {
        roomName: 'New Room',
        roomType: 'private',
        empSeq: 1
      });
      // 생성된 채팅방의 ID를 현재 채팅방으로 설정
      setCurrentRoom(response.data.roomSeq);
    } catch (error) {
      console.error('Error creating room:', error);
    }
  };

  return (
    <div className={styles.chatWindow}>
      <div className={styles.chatHeader}>
        <div className={styles.profileInfo}>
          <div className={styles.avatar}></div>
          <h2>정경호 <span className={styles.status}>Active</span></h2>
        </div>
      </div>
      <div className={styles.messages}>
        {messages.map((message) => (
          <div key={message.messageSeq} className={`${styles.message} ${message.senderSeq === 1 ? styles.sent : ''}`}>
            <div className={styles.messageContent}>{message.messageContent}</div>
            <div className={styles.messageTime}>{new Date(message.sendTime).toLocaleString()}</div>
          </div>
        ))}
      </div>
      <div className={styles.chatInput}>
        <input
          type="text"
          placeholder="메시지를 입력해 주세요"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
        />
        <button onClick={handleSendMessage}>전송</button>
      </div>
      <button onClick={createRoom}>Create Room</button>
    </div>
  );
};

export default ChatWindow;