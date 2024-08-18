import React, { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';
import { BaseUrl } from '../../../../../commons/config';
import styles from '../Messenger.module.css';
import { useChatStore } from '../../../../../store/messengerStore';
import { sendMessage, subscribeToRoom } from '../../../../../commons/websocket';
import ChatHeader from './ChatHeader';
import MessageList from './MessageList';
import ChatInput from './ChatInput';

const ChatWindow = ({ chat, onLeaveChat, onClearChat, onToggleNotifications }) => {
  // Zustand 스토어에서 필요한 함수들을 가져옵니다.
  const { messages, setMessages, addMessage } = useChatStore();
  
  // 메시지 컨테이너에 대한 ref를 생성합니다.
  const messagesContainerRef = useRef(null);
  
  // 검색 기능을 위한 상태를 설정합니다.
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredMessages, setFilteredMessages] = useState([]);

  // 현재 채팅방의 메시지와 현재 사용자 정보를 가져옵니다.
  const currentMessages = messages[chat.roomSeq] || [];
  const currentUserSeq = JSON.parse(sessionStorage.getItem('sessionUser')).empSeq;

  // 메시지 목록을 스크롤 맨 아래로 이동시키는 함수입니다.
  const scrollToBottom = useCallback(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  }, []);

  // 서버에서 메시지를 가져오는 함수입니다.
  const fetchMessages = useCallback(async () => {
    try {
      const response = await axios.get(`${BaseUrl()}/chat/messages/${chat.roomSeq}`);
      setMessages(chat.roomSeq, response.data);
      setTimeout(scrollToBottom, 0);
    } catch (error) {
      console.error('메시지를 가져오는 중 오류 발생:', error);
    }
  }, [chat.roomSeq, setMessages, scrollToBottom]);

  // 새로운 메시지를 처리하는 함수입니다.
  const handleReceivedMessage = useCallback((message) => {
    switch (message.messageType) {
      case 'CHAT':
        addMessage(chat.roomSeq, message);
        scrollToBottom();
        break;
      case 'LEAVE':
        console.log(message.messageContent);
        // 채팅방 나가기 처리
        break;
      case 'CLEAR':
        console.log(message.messageContent);
        setMessages(chat.roomSeq, []);
        break;
      default:
        console.log('Unknown message type:', message.messageType);
    }
  }, [chat.roomSeq, addMessage, setMessages, scrollToBottom]);

  // 컴포넌트가 마운트되거나 채팅방이 변경될 때 실행되는 효과입니다.
  useEffect(() => {
    let unsubscribe;
    if (chat.roomSeq) {
      fetchMessages();
      unsubscribe = subscribeToRoom(chat.roomSeq, handleReceivedMessage);
      sendMessage("/app/chat.readMessages", { roomSeq: chat.roomSeq });
    }
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [chat.roomSeq, fetchMessages, handleReceivedMessage]);

  // 메시지 목록이 변경될 때마다 스크롤을 맨 아래로 이동시킵니다.
  useEffect(() => {
    scrollToBottom();
  }, [currentMessages, scrollToBottom]);

  // 채팅 메시지를 전송하는 함수입니다.
  const sendChatMessage = useCallback((messageContent) => {
    const message = {
      roomSeq: chat.roomSeq,
      messageContent,
      messageType: 'CHAT',
      senderSeq: currentUserSeq,
      sendTime: new Date().toISOString()
    };
    sendMessage("/app/chat.sendMessage", message);
  }, [chat.roomSeq, currentUserSeq]);

  // 채팅방 나가기, 대화 내용 삭제, 알림 설정 변경 핸들러
  const handleLeaveChat = () => onLeaveChat(chat.roomSeq);
  const handleClearChat = () => onClearChat(chat.roomSeq);
  const handleToggleNotifications = (enabled) => onToggleNotifications(chat.roomSeq, enabled);

  // 메시지 검색 핸들러
  const handleSearch = (term) => {
    setSearchTerm(term);
    if (term) {
      const filtered = currentMessages.filter(message =>
        message.messageContent.toLowerCase().includes(term.toLowerCase())
      );
      setFilteredMessages(filtered);
    } else {
      setFilteredMessages([]);
    }
  };

  return (
    <div className={styles.chatWindow}>
      <ChatHeader
        chat={chat}
        onSearch={handleSearch}
        onLeaveChat={handleLeaveChat}
        onClearChat={handleClearChat}
        onToggleNotifications={handleToggleNotifications}
      />
      <div className={styles.messageListContainer} ref={messagesContainerRef}>
        <MessageList
          messages={searchTerm ? filteredMessages : currentMessages}
          chat={chat}
          currentUserSeq={currentUserSeq}
          searchTerm={searchTerm}
        />
      </div>
      <ChatInput onSendMessage={sendChatMessage} />
    </div>
  );
};

export default React.memo(ChatWindow);