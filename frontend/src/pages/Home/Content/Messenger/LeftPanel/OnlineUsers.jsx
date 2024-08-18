import React, { useEffect, useRef, useState } from 'react';
import styles from './onlineUsers.module.css';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { useMemberStore } from '../../../../../store/store';

const OnlineUsers = ({ onlineUsers, onProfileSelect }) => {
    const [showLeftArrow, setShowLeftArrow] = useState(false);
    const [showRightArrow, setShowRightArrow] = useState(false);
    const userListRef = useRef(null);

    const { sessionData } = useMemberStore(); // sessionData에서 empSeq를 가져옴

    useEffect(() => {
        checkArrows();
        console.log('onlineUsers:', onlineUsers);
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
            <h3>온라인 사용자 ({onlineUsers.length -1})</h3>
            {showLeftArrow && (
                <FaChevronLeft className={`${styles.arrow} ${styles.arrowLeft}`} onClick={() => scroll('left')} />
            )}
            <div className={styles.userList} ref={userListRef}>
                {onlineUsers
                    .filter(user => user.EMP_SEQ !== sessionData.empSeq) // 본인의 아바타를 필터링
                    .map((user) => (
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
                                <span className={styles.userName}>{user.EMP_NAME}</span>
                            </div>
                        </div>
                    ))}
            </div>
            {showRightArrow && (
                <FaChevronRight className={`${styles.arrow} ${styles.arrowRight}`} onClick={() => scroll('right')} />
            )}
        </div>
    );
};

export default OnlineUsers;
