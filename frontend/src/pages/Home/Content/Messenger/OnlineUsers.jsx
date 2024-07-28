import React, { useState } from 'react';
import styles from './Messenger.module.css';
import { Modal } from '../../../../components/Modal/Modal';
import { Folder } from '../../../../components/Folder/Folder';
import UserSelectModal from './UserSelectModal';

const OnlineUsers = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
  
    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);
  
    return (
      <div className={styles.onlineUsers}>
        <h3>Online Now <span>6</span></h3>
        <div className={styles.userList}>
          <div className={styles.userIcon}></div>
          <div className={styles.userIcon}></div>
          <div className={styles.userIcon}></div>
          <div className={styles.userIcon}></div>
        </div>
        <button className={styles.addUserButton} onClick={openModal}>+</button>
  
        <Modal isOpen={isModalOpen} onClose={closeModal}>
          <UserSelectModal onClose={closeModal} />
        </Modal>
      </div>
    );
  };
  
  export default OnlineUsers;