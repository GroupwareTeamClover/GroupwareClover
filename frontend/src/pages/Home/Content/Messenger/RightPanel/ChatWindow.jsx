import React, { useEffect, useCallback, useState, useRef } from 'react';
import axios from 'axios';
import { BaseUrl } from '../../../../../commons/config';
import styles from '../Messenger.module.css';
import { useChatStore } from '../../../../../store/messengerStore';
import { sendMessage, subscribeToRoom, leaveRoom, clearChatHistory, toggleNotifications } from '../../../../../commons/websocket';
import ChatHeader from './ChatHeader';
import MessageList from './MessageList';
import ChatInput from './ChatInput';

const ChatWindow = ({ chat }) => {
  const { messages, setMessages, addMessage, setChatRooms, setSelectedChat } = useChatStore();
  const messagesContainerRef = useRef(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredMessages, setFilteredMessages] = useState([]);

  const currentMessages = messages[chat.roomSeq] || [];
  const currentUserSeq = JSON.parse(sessionStorage.getItem('sessionUser')).empSeq;

  const scrollToBottom = useCallback(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  }, []);

  const fetchMessages = useCallback(async () => {
    try {
      // URL을 새로운 API 구조에 맞게 수정
      const response = await axios.get(`${BaseUrl()}/chat/messages/${chat.roomSeq}`);
      setMessages(chat.roomSeq, response.data);
      setTimeout(scrollToBottom, 0);
    } catch (error) {
      console.error('메시지를 가져오는 중 오류 발생:', error);
    }
  }, [chat.roomSeq, setMessages, scrollToBottom]);

  useEffect(() => {
    if (chat.roomSeq) {
      fetchMessages();
      const unsubscribe = subscribeToRoom(chat.roomSeq, handleReceivedMessage);
      return () => {
        if (unsubscribe) unsubscribe();
      };
    }
  }, [chat.roomSeq, fetchMessages]);

  useEffect(() => {
    scrollToBottom();
  }, [currentMessages, scrollToBottom]);

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

  const handleLeaveChat = async () => {
    if (window.confirm("정말로 채팅방을 나가시겠습니까?")) {
      try {
        await axios.post(`${BaseUrl()}/chat/rooms/leave/${chat.roomSeq}`);
        leaveRoom(chat.roomSeq);
        setChatRooms(prevRooms => prevRooms.filter(room => room.roomSeq !== chat.roomSeq));
        setSelectedChat(null);
      } catch (error) {
        console.error('채팅방 나가기 오류:', error);
      }
    }
  };

  const handleClearChat = async () => {
    if (window.confirm("대화 내용을 삭제하시겠습니까? (서버에서도 삭제됩니다)")) {
      try {
        // URL을 새로운 API 구조에 맞게 수정
        await axios.delete(`${BaseUrl()}/chat/messages/clear/${chat.roomSeq}`);
        clearChatHistory(chat.roomSeq);
        setMessages(chat.roomSeq, []);
      } catch (error) {
        console.error('대화 내용 삭제 오류:', error);
      }
    }
  };

  const handleToggleNotifications = async (enabled) => {
    try {
      await axios.post(`${BaseUrl()}/chat/notifications/${chat.roomSeq}`, { enabled });
      toggleNotifications(chat.roomSeq, enabled);
      console.log(`알림 ${enabled ? '켜기' : '끄기'}`);
    } catch (error) {
      console.error('알림 설정 변경 오류:', error);
    }
  };

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