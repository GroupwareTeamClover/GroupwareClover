import React, { useState, useEffect } from 'react';
import styles from '../Messenger.module.css';
import { Modal } from '../../../../../components/Modal/Modal';
import { Folder } from '../../../../../components/Folder/Folder';

import UserSelectModal from '../Modals/UserSelectModal';
import { useChatStore } from '../../../../../store/messengerStore';
import axios from 'axios';
import { BaseUrl } from '../../../../../commons/config';

const AddChat = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { onlineUsers, setOnlineUsers, addChatRoom, setSelectedChat } = useChatStore();

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    return (
        <div className={styles.addChat}>
            <button className={styles.addUserButton} onClick={openModal}> 추가 </button>

            <Modal isOpen={isModalOpen} onClose={closeModal}>
                <UserSelectModal onClose={closeModal} />
            </Modal>
        </div>
    )


}

export default AddChat;