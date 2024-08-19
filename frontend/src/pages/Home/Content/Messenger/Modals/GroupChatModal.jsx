import React, { useState } from 'react';
import styles from './GroupChatModal.module.css';

const GroupChatModal = ({ selectedEmployees, onClose, onCreateGroupChat }) => {
    const [roomName, setRoomName] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (roomName.trim()) {
            onCreateGroupChat(roomName);
        }
    };

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
                <h2>그룹 채팅 생성</h2>
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        value={roomName}
                        onChange={(e) => setRoomName(e.target.value)}
                        placeholder="그룹 채팅 이름 입력"
                        required
                    />
                    <div className={styles.selectedEmployees}>
                        {selectedEmployees.map(emp => (
                            <div key={emp.seq} className={styles.employeeTag}>
                            <img 
                                src={emp.avatar || '/default-avatar.png'} 
                                alt={emp.name} 
                                className={styles.employeeAvatar}
                            />
                            <span>{emp.name} ({emp.role})</span>
                        </div>
                        ))}
                    </div>
                    <div className={styles.buttonGroup}>
                        <button type="submit">생성</button>
                        <button type="button" onClick={onClose}>취소</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default GroupChatModal;