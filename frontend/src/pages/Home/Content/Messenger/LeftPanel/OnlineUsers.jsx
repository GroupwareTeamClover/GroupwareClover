import React, { useState, useEffect } from 'react';
import styles from '../Messenger.module.css';
import { useChatStore } from '../../../../../store/messengerStore';
import axios from 'axios';
import { BaseUrl } from '../../../../../commons/config';

const OnlineUsers = () => {
    const { onlineUsers, setOnlineUsers, addChatRoom, setSelectedChat } = useChatStore();



    return (
        <div className={styles.onlineUsers}>
            <h3>Online Now <span>{onlineUsers.length}</span></h3>
            <div className={styles.userList}>
                {onlineUsers.map(user => (
                    <div 
                        key={user.empSeq} 
                        className={styles.userIcon}
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