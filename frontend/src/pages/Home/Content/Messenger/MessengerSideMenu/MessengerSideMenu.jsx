import React, { useState } from 'react';
import styles from '../Messenger.module.css';
import { Modal } from '../../../../../components/Modal/Modal';
import { useMemberStore } from '../../../../../store/store';
import IndividualOrganization from './IndividualOrganization';
import GroupOrganization from './GroupOrganization';
import { FaUserFriends } from 'react-icons/fa';
import { FaUsers } from 'react-icons/fa';

const MessengerSideMenu = () => {
  const [isIndividualModalOpen, setIsIndividualModalOpen] = useState(false);
  const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);
  const { sessionData } = useMemberStore();

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
      </div>
      <Modal isOpen={isIndividualModalOpen} onClose={() => setIsIndividualModalOpen(false)}>
        <IndividualOrganization onClose={() => setIsIndividualModalOpen(false)} />
      </Modal>
      <Modal isOpen={isGroupModalOpen} onClose={() => setIsGroupModalOpen(false)}>
        <GroupOrganization onClose={() => setIsGroupModalOpen(false)} />
      </Modal>
    </div>
  );
};

export default MessengerSideMenu;