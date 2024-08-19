import React, { useEffect, useState } from 'react';
import styles from './Organization.module.css';
import { Folder } from '../../../../../components/Folder/Folder';
import { BaseUrl } from '../../../../../commons/config';
import axios from 'axios';
import { FaSearch } from "react-icons/fa";
import GroupChatModal from '../Modals/GroupChatModal';
import { createGroupChat } from '../utils/chat-utils';

const GroupOrganization = ({ onClose }) => {
    const [folderData, setFolderData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedItem, setSelectedItem] = useState({ children: {} });
    const [searchInput, setSearchInput] = useState('');
    const [selectedEmployees, setSelectedEmployees] = useState([]);
    const [isGroupChatModalOpen, setIsGroupChatModalOpen] = useState(false);

    useEffect(() => {
        setIsLoading(true);
        axios.get(`${BaseUrl()}/chat/organization`).then((resp) => {
            const data = resp.data;
            const departmentMap = data.reduce((acc, current) => {
                const { DEPT_NAME, EMP_NAME, ROLE_NAME, EMP_SEQ, EMP_AVATAR } = current;
                if (!acc[DEPT_NAME]) {
                    acc[DEPT_NAME] = { name: DEPT_NAME, children: [] };
                }
                acc[DEPT_NAME].children.push({ name: EMP_NAME, role: ROLE_NAME, seq: EMP_SEQ, avatar: EMP_AVATAR });
                return acc;
            }, {});

            const newFolderData = Object.values(departmentMap);
            setFolderData(newFolderData);
            setFilteredData(newFolderData);
            setIsLoading(false);
        });
    }, []);

    const handleSearchData = (e) => {
        setSearchInput(e.target.value);
    }

    const handleItemClick = (item) => {
        const isSelected = selectedEmployees.some(emp => emp.seq === item.seq);
        if (isSelected) {
            setSelectedEmployees(selectedEmployees.filter(emp => emp.seq !== item.seq));
        } else {
            setSelectedEmployees([...selectedEmployees, item]);
        }
    };

    useEffect(() => {
        const filterFolders = (data, query) => {
            if (!query) return data;
            return data
                .map(folder => {
                    const folderMatches = folder.name.toLowerCase().includes(query.toLowerCase());
                    const filteredChildren = folder.children.filter(child =>
                        child.name.toLowerCase().includes(query.toLowerCase()) ||
                        child.role.toLowerCase().includes(query.toLowerCase())
                    );
                    
                    if (folderMatches || filteredChildren.length) {
                        return { ...folder, children: filteredChildren.length ? filteredChildren : folder.children, isOpen: true };
                    }
                    return null;
                })
                .filter(folder => folder !== null);
        };

        setFilteredData(filterFolders(folderData, searchInput));
    }, [searchInput, folderData]);

    const adjustFolderProps = (folder) => {
        return {
            ...folder,
            children: folder.children.map(child => ({
                ...child,
                name: child.name,
                children: []
            }))
        };
    };

    const handleCreateGroupChat = async (roomName) => {
        if (selectedEmployees.length < 2) {
            alert("그룹 채팅을 생성하려면 최소 2명 이상의 사원을 선택해야 합니다.");
            return;
        }
        try {
            await createGroupChat(roomName, selectedEmployees);
            setIsGroupChatModalOpen(false);
            onClose();
        } catch (error) {
            console.error('그룹 채팅방 생성 중 오류:', error);
            alert('그룹 채팅방 생성에 실패했습니다.');
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h4 className={styles.headerText}>그룹 대화 생성</h4>
            </div>
            <div className={styles.content}>
                <div className={styles.searchBox}>
                    <div className={styles.searchLine}>
                        <div className={styles.inputBox}>
                            <input
                                type='text'
                                className={styles.input}
                                placeholder='이름 또는 역할 검색'
                                onChange={handleSearchData}
                                value={searchInput}
                            />
                        </div>
                        <div className={styles.iconBox}><FaSearch /></div>
                    </div>
                    <div className={styles.searchContent}>
                        {isLoading ? (
                            <p>로딩 중...</p>
                        ) : filteredData.length > 0 ? (
                            filteredData.map((folder, index) => (
                                <Folder
                                    key={index}
                                    folder={adjustFolderProps(folder)}
                                    onItemClick={handleItemClick}
                                    selectedItem={selectedItem}
                                    setSelectedItem={setSelectedItem}
                                />
                            ))
                        ) : (
                            <p>데이터가 없습니다.</p>
                        )}
                    </div>
                </div>
            </div>
            <div className={styles.footer}>
                <button 
                    onClick={() => setIsGroupChatModalOpen(true)} 
                    disabled={selectedEmployees.length < 2}
                    className={styles.createGroupButton}
                >
                    그룹 채팅 생성 ({selectedEmployees.length})
                </button>
            </div>
            {isGroupChatModalOpen && (
                <GroupChatModal 
                    selectedEmployees={selectedEmployees}
                    onClose={() => setIsGroupChatModalOpen(false)}
                    onCreateGroupChat={handleCreateGroupChat}
                />
            )}
        </div>
    );
}
export default GroupOrganization;
