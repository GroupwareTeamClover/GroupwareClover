import React, { useState } from 'react';
import axios from 'axios';
import styles from '../Messenger.module.css';
import { BaseUrl } from '../../../../commons/config';

// 로직 다 바뀌었으니 형태만 가져와서 후에 추가하는 것으로 변경
const CreateChatModal = ({ onClose, onRoomCreated }) => {
  // 채팅방 이름을 저장하는 상태
  const [roomName, setRoomName] = useState('');
  // 채팅방 유형을 저장하는 상태
  const [roomType, setRoomType] = useState('private');
  // 채팅방 설명을 저장하는 상태
  const [description, setDescription] = useState('');

  // 채팅방 생성 함수
  const handleCreateRoom = async () => {
    try {
      const response = await axios.post(`${BaseUrl()}/chat/rooms`, {
        roomName,
        roomType,
        roomDescription: description,
        empSeq: 1 // TODO: 실제 사용자 ID로 변경해야 함
      });
      // 생성된 채팅방 정보를 상위 컴포넌트에 전달
      onRoomCreated(response.data);
      // 모달 닫기
      onClose();
    } catch (error) {
      console.error('채팅방 생성 중 오류 발생:', error);
      
    }
  };

  return (
    <div className={styles.createChatModal}>
      <h2>새 채팅방 생성</h2>
      <input
        type="text"
        placeholder="채팅방 이름"
        value={roomName}
        onChange={(e) => setRoomName(e.target.value)}
      />
      <select value={roomType} onChange={(e) => setRoomType(e.target.value)}>
        <option value="private">개인</option>
        <option value="group">그룹</option>
        <option value="public">공개</option>
      </select>
      <textarea
        placeholder="설명 (선택사항)"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <button onClick={handleCreateRoom}>생성</button>
      <button onClick={onClose}>취소</button>
    </div>
  );
};

export default CreateChatModal;