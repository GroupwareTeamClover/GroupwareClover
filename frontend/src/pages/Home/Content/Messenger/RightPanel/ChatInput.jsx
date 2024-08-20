import React, { useState, useCallback, useRef, useEffect } from 'react';
import styles from './ChatWindow.module.css';
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';
import { FaSmile, FaPaperclip, FaPaperPlane } from 'react-icons/fa';

const ChatInput = ({ onSendMessage, onFileUpload }) => {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [messageContent, setMessageContent] = useState('');
  const inputRef = useRef(null);
  const emojiPickerRef = useRef(null);

  const handleEmojiSelect = useCallback((emoji) => {
    const newContent = messageContent + emoji.native;
    setMessageContent(newContent);
    inputRef.current.textContent = newContent;
    setCaretToEnd(inputRef.current);
    setShowEmojiPicker(false);
  }, [messageContent]);

  const setCaretToEnd = (element) => {
    const range = document.createRange();
    const selection = window.getSelection();
    range.selectNodeContents(element);
    range.collapse(false);
    selection.removeAllRanges();
    selection.addRange(range);
    element.focus();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleInput = () => {
    const content = inputRef.current.textContent;
    if (content.length > 300) {
      inputRef.current.textContent = content.slice(0, 300);
    }
    setMessageContent(inputRef.current.textContent);
  };

  const handleSendMessage = () => {
    if (messageContent.trim()) {
      onSendMessage(messageContent);
      inputRef.current.textContent = '';
      setMessageContent('');
    }
  };

  // const handleFileUpload = (e) => {
  //   const file = e.target.files[0];
  //   if (file) {
  //     onFileUpload(file);
  //   }
  // };

  const toggleEmojiPicker = (e) => {
    e.stopPropagation();
    setShowEmojiPicker(!showEmojiPicker);
  };

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }

    const handleClickOutside = (event) => {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target)) {
        setShowEmojiPicker(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className={styles.chatInput}>
      <div className={styles.inputWrapper}>
        <div
          ref={inputRef}
          contentEditable
          onInput={handleInput}
          onKeyDown={handleKeyDown}
          className={styles.textInput}
          placeholder="메시지를 입력하세요...!"
        />
      </div>
      <div className={styles.buttonWrapper}>
        <div className={styles.emojiPickerContainer}>
          <button onClick={toggleEmojiPicker} className={styles.iconButton}>
            <FaSmile />
          </button>
          {showEmojiPicker && (
            <div ref={emojiPickerRef} className={styles.emojiPicker}>
              <Picker data={data} onEmojiSelect={handleEmojiSelect} />
            </div>
          )}
        </div>
        {/* <label htmlFor="fileUpload" className={styles.iconButton}>
          <FaPaperclip />
          <input
            id="fileUpload"
            type="file"
            onChange={handleFileUpload}
            style={{ display: 'none' }}
          />
        </label> */}
        <button onClick={handleSendMessage} className={styles.sendButton}>
          <FaPaperPlane />
        </button>
      </div>
    </div>
  );
};

export default ChatInput;