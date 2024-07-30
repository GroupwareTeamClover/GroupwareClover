import React, { useState } from 'react';
import styles from '../Messenger.module.css';
import { Folder } from '../../../../../components/Folder/Folder';

const UserSelectModal = ({ onClose }) => {

    // {
    //     name: "영업부부(26)",
    //     children: [
    //       { name: "김상후 대표이사" },
    //       { name: "구정모 사장" },
    //       { name: "이재오 전무" },
    //       { name: "마장동 상무" },
    //       { name: "허각 이사" },
    //     ]
    //   }

  // 검색 내용 가져오기
  const [searchTerm, setSearchTerm] = useState('');


  

  // 데이터 가져오기
  const [folderData, setFolderData] = ([]);


  // 선택된 유저 가져오기 
  const [selectedUsers, setSelectedUsers] = useState([]);
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