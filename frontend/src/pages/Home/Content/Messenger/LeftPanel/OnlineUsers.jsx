import React, { useState, useEffect } from 'react';
import styles from '../Messenger.module.css';
import UserSelectModal from './UserSelectModal';
import { useChatStore } from '../../../../../store/messengerStore';
import axios from 'axios';
import { BaseUrl } from '../../../../../commons/config';

const OnlineUsers = () => {
    const { onlineUsers, setOnlineUsers, addChatRoom, setSelectedChat } = useChatStore();


    // useEffect(() => {
    //     // 온라인 사용자 목록을 가져오는 함수
    //     const fetchOnlineUsers = async () => {
    //         try {
    //             const response = await axios.get(`${BaseUrl()}/chat/online-users`);
    //             console.log("온라인 사용자 목록", response.data)
    //             setOnlineUsers(response.data);
    //         } catch (error) {
    //             console.error('온라인 사용자 목록 조회 중 오류 발생:', error);
    //         }
    //     };

    //     fetchOnlineUsers();
    //     // 주기적으로 온라인 사용자 목록 업데이트 (선택사항)
    //     const interval = setInterval(fetchOnlineUsers, 60000); // 1분마다 업데이트

    //     return () => clearInterval(interval);
    // }, [setOnlineUsers]);

    const createPrivateChat = async (targetUserId) => {
        try {
            const response = await axios.post(`${BaseUrl()}/chat/rooms`, targetUserId);
            const newRoom = response.data;
            addChatRoom(newRoom);
            setSelectedChat(newRoom);
        } catch (error) {
            console.error('1:1 채팅방 생성 중 오류 발생:', error);
        }
    };

    return (
        <div className={styles.onlineUsers}>
            <h3>Online Now <span>{onlineUsers.length}</span></h3>
            <div className={styles.userList}>
                {onlineUsers.map(user => (
                    <div 
                        key={user.empSeq} 
                        className={styles.userIcon}
                        onClick={() => createPrivateChat(user.empSeq)}
                    >
                        <img 
                            src={user.empAvatar} 
                            alt={user.empName} 
                            title={user.empName}
                        />
                    </div>
                ))}
            </div>

        </div>
    );
};

export default OnlineUsers;