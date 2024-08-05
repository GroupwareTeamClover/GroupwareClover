import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import styles from './PopupWindow.module.css';
import { BaseUrl } from '../../../../../../../commons/config';

export const PopupWindow = () => {
    const navi = useNavigate();
    const { popSeq } = useParams();
    const contentRef = useRef(null);
    const [post, setPost] = useState({});
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [showPopup, setShowPopup] = useState(true);

    useEffect(() => {
        axios.get(`${BaseUrl()}/adminpopup/postInfo/${popSeq}`).then(resp => {
            const data = resp.data;
            setPost(data);
            setTitle(data.popTitle || '');
            setContent(data.popContent || '');
            if (contentRef.current) {
                contentRef.current.innerHTML = data.popContent || '';
            }
        });
    }, [popSeq]);

    const handleDismiss = () => {
        setShowPopup(false);
    };

    const handleNeverShow = () => {
        // '더 이상 보지 않기' 기능을 구현하는 로직을 추가하세요.
        localStorage.setItem('popupDismissed', 'true');
        handleDismiss();
    };

    const handleTodayOnly = () => {
        // '오늘 하루 보지 않기' 기능을 구현하는 로직을 추가하세요.
        const today = new Date().toDateString();
        localStorage.setItem('popupDismissedUntil', today);
        handleDismiss();
    };

    if (!showPopup) return null;

    return (
        <div className={styles.overlay}>
            <div className={styles.modal}>
                <button className={styles.closeBtn} onClick={handleDismiss}>닫기</button>
                <h3>{title}</h3>
                <div className={styles.content} ref={contentRef}></div>
                <div className={styles.actions}>
                    <button className={styles.dismissBtn} onClick={handleNeverShow}>더 이상 보지 않기</button>
                    <button className={styles.dismissBtn} onClick={handleTodayOnly}>오늘 하루 보지 않기</button>
                </div>
            </div>
        </div>
    );
};
