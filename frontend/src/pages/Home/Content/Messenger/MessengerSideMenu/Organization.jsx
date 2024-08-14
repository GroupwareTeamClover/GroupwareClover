import React, { useEffect, useState } from 'react';
import styles from './Organization.module.css';
import { Folder } from '../../../../../components/Folder/Folder';
import { BaseUrl } from '../../../../../commons/config';
import axios from 'axios';
import { FaSearch } from "react-icons/fa";
import EmployeeModal from './EmployeeModal';
import GroupChatModal from '../Modals/GroupChatModal';
import { createGroupChat } from '../utils/chat-utils';

const Organization = ({ onClose }) => {
    // 상태 변수들 정의
    const [folderData, setFolderData] = useState([]); // 폴더 구조의 데이터
    const [filteredData, setFilteredData] = useState([]); // 검색 필터링된 데이터
    const [isLoading, setIsLoading] = useState(true); // 로딩 상태
    const [selectedItem, setSelectedItem] = useState({ children: {} }); // 선택된 항목
    const [searchInput, setSearchInput] = useState(''); // 검색어
    const [isModalOpen, setIsModalOpen] = useState(false); // 모달 열림 상태
    const [selectedEmployee, setSelectedEmployee] = useState(null); // 선택된 직원
    const [selectedEmployees, setSelectedEmployees] = useState([]); // 그룹 채팅을 위해 선택된 직원들
    const [isGroupChatModalOpen, setIsGroupChatModalOpen] = useState(false); // 그룹 채팅 모달 열림 상태

    // 초기 데이터 로딩
    useEffect(() => {
        setIsLoading(true);
        axios.get(`${BaseUrl()}/chat/organization`).then((resp) => {
            const data = resp.data;
            // 부서별로 데이터를 그룹화
            const departmentMap = data.reduce((acc, current) => {
                const { DEPT_NAME, EMP_NAME, ROLE_NAME, EMP_SEQ, EMP_AVATAR } = current;
                if (!acc[DEPT_NAME]) {
                    acc[DEPT_NAME] = { name: DEPT_NAME, children: [] };
                }
                acc[DEPT_NAME].children.push({ name: EMP_NAME, role: ROLE_NAME, seq: EMP_SEQ, avatar: EMP_AVATAR });
                return acc;
            }, {});

            // 객체를 배열로 변환
            const newFolderData = Object.values(departmentMap);
            setFolderData(newFolderData);
            setFilteredData(newFolderData);
            setIsLoading(false);
        });
    }, []);

    // 검색어 입력 핸들러
    const handleSearchData = (e) => {
        setSearchInput(e.target.value);
    }

    // 직원 선택 핸들러
    const handleItemClick = (item) => {
        setSelectedItem({ children: item });
        setSelectedEmployee({
            seq: item.seq,
            name: item.name,
            role: item.role,
            avatar: item.avatar
        });
        setIsModalOpen(true);

        // 그룹 채팅을 위한 직원 선택 로직
        const isSelected = selectedEmployees.some(emp => emp.seq === item.seq);
        if (isSelected) {
            setSelectedEmployees(selectedEmployees.filter(emp => emp.seq !== item.seq));
        } else {
            setSelectedEmployees([...selectedEmployees, item]);
        }
    };

    // 검색 필터링 로직
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

    // Folder 컴포넌트에 전달할 props 조정
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

    // 모달 닫기 핸들러
    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedEmployee(null);
    };

    // 그룹 채팅 생성 핸들러
    const handleCreateGroupChat = async (roomName) => {
        if (selectedEmployees.length < 2) {
            alert("그룹 채팅을 생성하려면 최소 2명 이상의 사원을 선택해야 합니다.");
            return;
        }
        try {
            await createGroupChat(roomName, selectedEmployees);
            setIsGroupChatModalOpen(false);
            onClose(); // Organization 모달을 닫습니다.
        } catch (error) {
            console.error('그룹 채팅방 생성 중 오류2:', error);
            alert('그룹 채팅방 생성에 실패했습니다.');
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h4 className={styles.headerText}>직원 목록</h4>
            </div>
            <div className={styles.content}>
                <div className={styles.searchBox}>
                    {/* 검색 입력 필드 */}
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
                    {/* 폴더 구조 표시 */}
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
            {/* 직원 상세 정보 모달 */}
            {isModalOpen && selectedEmployee && (
                <EmployeeModal 
                    employee={selectedEmployee} 
                    onClose={closeModal} 
                />
            )}
            {/* 그룹 채팅 생성 모달 */}
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

export default Organization;