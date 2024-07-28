import React, { useState } from 'react';
import styles from './Messenger.module.css';
import { Folder } from '../../../../components/Folder/Folder';

const UserSelectModal = ({ onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUsers, setSelectedUsers] = useState([]);

  const folderData = [
    {
      name: "영업부부(26)",
      children: [
        { name: "김상후 대표이사" },
        { name: "구정모 사장" },
        { name: "이재오 전무" },
        { name: "마장동 상무" },
        { name: "허각 이사" },
      ]
    },
    // 필요에 따라 더 많은 부서 추가
  ];

  const handleUserSelect = (user) => {
    if (selectedUsers.some(selectedUser => selectedUser.name === user.name)) {
      setSelectedUsers(selectedUsers.filter(selectedUser => selectedUser.name !== user.name));
    } else {
      setSelectedUsers([...selectedUsers, user]);
    }
  };

  return (
    <div className={styles.userSelectModal}>
      <h2>새 대화</h2>
      <input
        type="text"
        placeholder="대화 상대 검색"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className={styles.searchInput}
      />
      <div className={styles.userList}>
        {folderData.map((folder, index) => (
          <Folder 
            key={index} 
            folder={folder} 
            onItemClick={handleUserSelect}
            selectedItem={selectedUsers.find(user => user.name === folder.name)}
          />
        ))}
      </div>
      <div className={styles.selectedUsers}>
        {selectedUsers.map((user, index) => (
          <span key={index} className={styles.selectedUser}>{user.name}</span>
        ))}
      </div>
      <button onClick={onClose} className={styles.confirmButton}>확인</button>
    </div>
  );
};

export default UserSelectModal;