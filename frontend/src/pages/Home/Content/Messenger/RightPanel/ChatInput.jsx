import React, { useState, useCallback } from 'react';
import styles from '../Messenger.module.css';
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';

const ChatInput = ({ onSendMessage }) => {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [messageContent, setMessageContent] = useState('');

  const handleEmojiSelect = useCallback((emoji) => {
    setMessageContent(prevContent => prevContent + emoji.native);
  }, []);

  const handleInputChange = (e) => {
    const value = e.target.value;
    if (value.length <= 100) {
      setMessageContent(value);
    }
  };

  const handleSendMessage = () => {
    if (messageContent.trim()) {
      onSendMessage(messageContent);
      setMessageContent('');
    }
  };

  return (
    <div className={styles.chatInput}>
      <div className={styles.inputWrapper}>
        <input
          type="text"
          value={messageContent}
          onChange={handleInputChange}
          placeholder="메시지를 입력하세요..."
          className={styles.textInput}
        />
        <button onClick={() => setShowEmojiPicker(!showEmojiPicker)} className={styles.emojiButton}>😀</button>
        {showEmojiPicker && (
          <div className={styles.emojiPicker}>
            <Picker data={data} onEmojiSelect={handleEmojiSelect} />
          </div>
        )}
      </div>
      <button onClick={handleSendMessage} className={styles.sendButton}>전송</button>
    </div>
  );
};

export default ChatInput;