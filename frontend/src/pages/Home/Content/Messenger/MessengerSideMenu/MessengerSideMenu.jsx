
import React, { useState } from 'react';
import styles from '../Messenger.module.css';
import { Modal } from '../../../../../components/Modal/Modal';
import { useMemberStore } from '../../../../../store/store';
import Organization from './Organization';

const MessengerSideMenu = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const {sessionData} = useMemberStore();

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  console.log(sessionData.empAvatar);

  return (
    <div>
        <div className={styles.userIcon}>
            <img src={sessionData.empAvatar} ></img>        
        </div>
        <div>
        <button className={styles.organization}onClick={openModal}> 사원목록 </button>
            <Modal isOpen={isModalOpen} onClose={closeModal}>
                <Organization onClose={closeModal}/>
            </Modal>
        </div>
         
    </div>
  );
};

export default MessengerSideMenu;