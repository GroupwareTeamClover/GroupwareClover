import React, { useEffect, useRef, useState } from 'react';
import styles from '../Messenger.module.css';

const OnlineUsers = ({ onlineUsers, onProfileSelect }) => {
    const [showLeftArrow, setShowLeftArrow] = useState(false);
    const [showRightArrow, setShowRightArrow] = useState(false);
    const userListRef = useRef(null);

    useEffect(() => {
        checkArrows();
    }, [onlineUsers]);

    const checkArrows = () => {
        if (userListRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = userListRef.current;
            setShowLeftArrow(scrollLeft > 0);
            setShowRightArrow(scrollLeft < scrollWidth - clientWidth);
        }
    };

    const scroll = (direction) => {
        if (userListRef.current) {
            const scrollAmount = direction === 'left' ? -240 : 240;
            userListRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
            setTimeout(checkArrows, 300);
        }
    };

    const handleProfileClick = (user) => {
        onProfileSelect(user);
    };

    return (
        <div className={styles.onlineUsers}>
            <h3>온라인 사용자 ({onlineUsers.length})</h3>
            {showLeftArrow && (
                <div className={`${styles.arrow} ${styles.arrowLeft}`} onClick={() => scroll('left')}></div>
            )}
            <div className={styles.userList} ref={userListRef}>
                {onlineUsers.map((user) => (
                    <div 
                        key={user.emp_seq} 
                        className={styles.userItem}
                        onClick={() => handleProfileClick(user)}
                    >
                        <div className={styles.avatarWrapper}>
                            <img 
                                src={user.EMP_AVATAR} 
                                alt={user.EMP_NAME} 
                                className={styles.avatar}
                            />
                        </div>
                        <span className={styles.userName}>{user.emp_name}</span>
                    </div>
                ))}
            </div>
            {showRightArrow && (
                <div className={`${styles.arrow} ${styles.arrowRight}`} onClick={() => scroll('right')}></div>
            )}
        </div>
    );
};

export default OnlineUsers;