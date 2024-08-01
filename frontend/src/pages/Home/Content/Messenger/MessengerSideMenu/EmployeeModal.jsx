import React from 'react';
import styles from './EmployeeModal.module.css';
import { useChatStore } from '../../../../../store/messengerStore';
import axios from 'axios';
import { BaseUrl } from '../../../../../commons/config';

const EmployeeModal = ({ employee, onClose }) => {
    const { addChatRoom, setSelectedChat } = useChatStore();

    const handleStartChat = async () => {
        try {
            const response = await axios.post(`${BaseUrl()}/chat/rooms`, 
                { targetEmpSeq: employee.seq },  // 객체로 감싸서 전송
                {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );
            const newRoom = response.data;
            addChatRoom(newRoom);
            setSelectedChat(newRoom);
            onClose(); // 모달 닫기
        } catch (error) {
            console.error('1:1 채팅방 생성 중 오류 발생:', error);
           
        }
    };

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
                <div className={styles.modalHeader}>
                    <h2>{employee.name}</h2>
                    <button onClick={onClose}>×</button>
                </div>
                <div className={styles.modalBody}>
                    <img 
                        src={employee.avatar || '/default-avatar.png'} 
                        alt={employee.name} 
                        className={styles.modalAvatar}
                    />
                    <div className={styles.employeeDetails}>
                        <p><strong>직위:</strong> {employee.role}</p>
                        <p><strong>사원번호:</strong> {employee.seq}</p>
                        <button className={styles.chatButton} onClick={handleStartChat}>
                            대화하기
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EmployeeModal;