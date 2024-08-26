import React, { useEffect, useState } from 'react';
import styles from './Organization.module.css';
import { BaseUrl } from '../../../../../commons/config';
import axios from 'axios';
import { FaSearch, FaCheck } from "react-icons/fa";
import GroupChatModal from '../Modals/GroupChatModal';
import { createGroupChat } from '../utils/chat-utils';

const GroupOrganization = ({ onClose }) => {
    const [folderData, setFolderData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchInput, setSearchInput] = useState('');
    const [selectedEmployees, setSelectedEmployees] = useState([]);
    const [isGroupChatModalOpen, setIsGroupChatModalOpen] = useState(false);

    useEffect(() => {
        setIsLoading(true);
        axios.get(`${BaseUrl()}/api/chat/organization`).then((resp) => {
            const data = resp.data;
            const departmentMap = data.reduce((acc, current) => {
                const { DEPT_NAME, EMP_NAME, ROLE_NAME, EMP_SEQ, EMP_AVATAR } = current;
                if (!acc[DEPT_NAME]) {
                    acc[DEPT_NAME] = { name: DEPT_NAME, employees: [] };
                }
                acc[DEPT_NAME].employees.push({ name: EMP_NAME, role: ROLE_NAME, seq: EMP_SEQ, avatar: EMP_AVATAR });
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

    const handleEmployeeSelect = (employee) => {
        setSelectedEmployees(prev => {
            const isSelected = prev.some(emp => emp.seq === employee.seq);
            if (isSelected) {
                return prev.filter(emp => emp.seq !== employee.seq);
            } else {
                return [...prev, employee];
            }
        });
    };

    useEffect(() => {
        const filterFolders = (data, query) => {
            if (!query) return data;
            return data
                .map(folder => {
                    const filteredEmployees = folder.employees.filter(emp =>
                        emp.name.toLowerCase().includes(query.toLowerCase()) ||
                        emp.role.toLowerCase().includes(query.toLowerCase())
                    );
                    
                    if (filteredEmployees.length) {
                        return { ...folder, employees: filteredEmployees };
                    }
                    return null;
                })
                .filter(folder => folder !== null);
        };

        setFilteredData(filterFolders(folderData, searchInput));
    }, [searchInput, folderData]);

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
                </div>
                <div className={styles.employeeList}>
                    {isLoading ? (
                        <p>로딩 중...</p>
                    ) : filteredData.length > 0 ? (
                        filteredData.map((department, index) => (
                            <div key={index} className={styles.department}>
                                <h5 className={styles.departmentName}>{department.name}</h5>
                                {department.employees.map((employee) => (
                                    <div key={employee.seq} className={styles.employeeItem}>
                                        <label className={styles.checkboxLabel}>
                                            <input
                                                type="checkbox"
                                                checked={selectedEmployees.some(emp => emp.seq === employee.seq)}
                                                onChange={() => handleEmployeeSelect(employee)}
                                                className={styles.checkbox}
                                            />
                                            <img src={employee.avatar || '/default-avatar.png'} alt={employee.name} className={styles.avatar} />
                                            <span className={styles.employeeName}>{employee.name}</span>
                                            <span className={styles.employeeRole}>{employee.role}</span>
                                        </label>
                                    </div>
                                ))}
                            </div>
                        ))
                    ) : (
                        <p>데이터가 없습니다.</p>
                    )}
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