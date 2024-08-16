import React, { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';
import { BaseUrl } from '../../../../../commons/config';
import styles from '../Messenger.module.css';
import { formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';
import { useChatStore } from '../../../../../store/messengerStore';
import { sendMessage, subscribeToRoom } from '../../../../../commons/websocket';
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';

const ChatWindow = ({ chat }) => {
  const { messages, setMessages, addMessage } = useChatStore();
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [messageContent, setMessageContent] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);  // 파일 상태 추가
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);

  const currentMessages = messages[chat.roomSeq] || [];

  const scrollToBottom = useCallback(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  }, []);

  const fetchMessages = useCallback(async () => {
    try {
      const response = await axios.get(`${BaseUrl()}/chat/rooms/${chat.roomSeq}/messages`);
      setMessages(chat.roomSeq, response.data);
      setTimeout(scrollToBottom, 0);
    } catch (error) {
      console.error('메시지를 가져오는 중 오류 발생:', error);
    }
  }, [chat.roomSeq, setMessages, scrollToBottom]);

  useEffect(() => {
    if (chat.roomSeq) {
      fetchMessages();
      const unsubscribe = subscribeToRoom(chat.roomSeq, (message) => {
        addMessage(chat.roomSeq, message);
      });

      return () => {
        if (unsubscribe) unsubscribe();
      };
    }
  }, [chat.roomSeq, fetchMessages, addMessage]);

  useEffect(() => {
    scrollToBottom();
  }, [currentMessages, scrollToBottom]);

  const sendChatMessage = useCallback(async () => {
    let message = {
      roomSeq: chat.roomSeq,
      messageContent,
      messageType: 'CHAT',
      senderSeq: JSON.parse(sessionStorage.getItem('sessionUser')).empSeq,
      sendTime: new Date().toISOString()
    };

    if (selectedFile) {
      const formData = new FormData();
      formData.append('file', selectedFile);

      try {
        const response = await axios.post(`${BaseUrl()}/attachment/upload`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        message.attachmentUrl = response.data.url; // 업로드된 파일 URL 추가
        message.attachmentName = selectedFile.name; // 파일 이름 추가
        setSelectedFile(null);  // 파일 전송 후 초기화
      } catch (error) {
        console.error('파일 업로드 실패:', error);
      }
    }

    if (messageContent.trim() || message.attachmentUrl) {
      sendMessage("/app/chat.sendMessage", message);
      setMessageContent('');  // 메시지 전송 후 입력창 비우기
    }
  }, [chat.roomSeq, messageContent, selectedFile]);

  const handleEmojiSelect = useCallback((emoji) => {
    setMessageContent(prevContent => prevContent + emoji.native);
  }, []);

  const handleInputChange = (e) => {
    const value = e.target.value;
    if (value.length <= 100) {
      setMessageContent(value);
    }
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);  // 선택한 파일 상태 업데이트
  };

  const renderMessage = (message, index) => {
    const isCurrentUser = message.senderSeq === JSON.parse(sessionStorage.getItem('sessionUser')).empSeq;
    return (
      <div
        key={message.messageSeq || index}
        className={`${styles.messageContainer} ${isCurrentUser ? styles.sent : styles.received}`}
      >
        {!isCurrentUser && (
          <div className={styles.senderInfo}>
            <img 
              src={chat.customRoomAvatar || '/default-avatar.png'} 
              alt={chat.customRoomName} 
              className={styles.senderAvatar}
            />
          </div>
        )}
        <div className={styles.messageWrapper}>
          {!isCurrentUser && (
            <span className={styles.senderName}>{chat.customRoomName}</span>
          )}
          <div className={styles.messageContent}>
            {message.messageContent}
            {message.attachmentUrl && (
              <div>
                <a href={message.attachmentUrl} download={message.attachmentName} target="_blank" rel="noopener noreferrer">
                  {message.attachmentName} 다운로드
                </a>
              </div>
            )}
          </div>
          <span className={styles.messageTime}>
            {formatDistanceToNow(new Date(message.sendTime), { addSuffix: true, locale: ko })}
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className={styles.chatWindow}>
      <div className={styles.chatHeader}>
        <img className={styles.avatar} src={chat.customRoomAvatar || chat.roomAvatar} alt="Avatar" />
        <h2>{chat.customRoomName || chat.roomName}</h2>
        <span className={styles.status}>Active</span>
      </div>

      <div className={styles.messages} ref={messagesContainerRef}>
        {currentMessages.map(renderMessage)}
        <div ref={messagesEndRef} />
      </div>

      <div className={styles.chatInput}>
        <div className={styles.inputWrapper}>
          <input
            type="text"
            value={messageContent}
            onChange={handleInputChange}
            placeholder="메시지를 입력하세요..."
            className={styles.textInput}
          />
          <input type="file" onChange={handleFileChange} className={styles.fileInput} /> {/* 파일 입력 필드 추가 */}
          <button onClick={() => setShowEmojiPicker(!showEmojiPicker)} className={styles.emojiButton}>😀</button>
          {showEmojiPicker && (
            <div className={styles.emojiPicker}>
              <Picker data={data} onEmojiSelect={handleEmojiSelect} />
            </div>
          )}
        </div>
        <button onClick={sendChatMessage} className={styles.sendButton}>전송</button>
      </div>
    </div>
  );
};

export default React.memo(ChatWindow);
