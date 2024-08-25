import React, { useState } from 'react';
import styles from '../Messenger.module.css';
import { Modal } from '../../../../../components/Modal/Modal';
import { useMemberStore } from '../../../../../store/store';
import IndividualOrganization from './IndividualOrganization';
import GroupOrganization from './GroupOrganization';
import { FaUserFriends, FaUsers, FaBullhorn } from 'react-icons/fa';
import { sendNotice } from '../../../../../commons/websocket';

const MessengerSideMenu = () => {
  const [isIndividualModalOpen, setIsIndividualModalOpen] = useState(false);
  const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);
  const [isNoticeModalOpen, setIsNoticeModalOpen] = useState(false);
  const [noticeContent, setNoticeContent] = useState('');
  const { sessionData } = useMemberStore();

  const handleSendNotice = () => {
    if (noticeContent.trim()) {
      const noticeMessage = {
        content: noticeContent,
        senderSeq: sessionData.empSeq,
        senderName: sessionData.empName
      };
      sendNotice(noticeMessage);
      setNoticeContent('');
      setIsNoticeModalOpen(false);
    }
  };

  return (
    <div className={styles.sideMenuContainer}>
      <div className={styles.userIcon}>
        <img src={sessionData.empAvatar} alt="User Avatar" />
      </div>
      <div className={styles.chatButtons}>
        <button className={styles.chatButton} onClick={() => setIsIndividualModalOpen(true)}>
          <FaUserFriends />
          <span>1:1</span>
        </button>
        <button className={styles.chatButton} onClick={() => setIsGroupModalOpen(true)}>
          <FaUsers />
          <span>그룹</span>
        </button>
        <button className={styles.chatButton} onClick={() => setIsNoticeModalOpen(true)}>
          <FaBullhorn />
          <span>공지톡</span>
        </button>
      </div>
      <Modal isOpen={isIndividualModalOpen} onClose={() => setIsIndividualModalOpen(false)}>
        <IndividualOrganization onClose={() => setIsIndividualModalOpen(false)} />
      </Modal>
      <Modal isOpen={isGroupModalOpen} onClose={() => setIsGroupModalOpen(false)}>
        <GroupOrganization onClose={() => setIsGroupModalOpen(false)} />
      </Modal>
      <Modal isOpen={isNoticeModalOpen} onClose={() => setIsNoticeModalOpen(false)}>
        <div className={styles.noticeModal}>
          <h2>공지톡 작성</h2>
          <textarea
            value={noticeContent}
            onChange={(e) => setNoticeContent(e.target.value)}
            placeholder="공지 내용을 입력하세요"
          />
          <button onClick={handleSendNotice}>전송</button>
        </div>
      </Modal>
    </div>
  );
};

export default MessengerSideMenu;