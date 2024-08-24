import styles from './ChoiceLine.module.css'
import axios from 'axios';
import { useState, useEffect } from 'react';

//
import { BaseUrl } from '../../../../../../commons/config';
import { useApprovalStore } from '../../../../../../store/approvalStore';
import { DragFolder } from './DragFolder/DragFolder';

//아이콘
import { CiTrash } from "react-icons/ci";
import { FaSearch } from "react-icons/fa";
import { smallAlert } from "../../../../../../commons/common";
import { Loading } from '../../../../../../components/Loading/Loading';

export const ChoiceLine = () => {

    const { selectedEmpInfo, setSelectedEmpInfo } = useApprovalStore();
    const [folderData, setFolderData] = useState([]);
    const [isLoading, setIsLoading] = useState(true); // 로딩 상태 추가

    useEffect(() => {
        setIsLoading(true); // 로딩 시작
        axios.get(`${BaseUrl()}/api/approval/line`).then((resp) => {
            const data = resp.data;
            // 부서별로 데이터를 그룹화
            const departmentMap = data.reduce((acc, current) => {
                const { DEPT, NAME, SEQ, ROLE } = current;
                if (!acc[DEPT]) {
                    acc[DEPT] = { name: DEPT, children: [] };
                }
                acc[DEPT].children.push({ name: NAME, seq: SEQ, role: ROLE });
                return acc;
            }, {});

            // 객체를 배열로 변환
            const newFolderData = Object.values(departmentMap);
            setFolderData(newFolderData);
            setIsLoading(false); // 로딩 완료
        }).catch(() => {
            setIsLoading(false); // 오류 시 로딩 완료
        });
    }, []);

    // 검색내용 가져오기
    const [searchInput, setSearchInput] = useState('');
    const handleSearchData = (e) => {
        setSearchInput(e.target.value);
    }

    // 검색 필터 설정
    const [filteredData, setFilteredData] = useState(folderData);
    useEffect(() => {
        const filterFolders = (data, query) => {
            if (!query) {
                return data;
            }
            return data
                .map(folder => {
                    const folderMatches = folder.name.toLowerCase().includes(query.toLowerCase());
                    const filteredChildren = folder.children.filter(child =>
                        child.name.toLowerCase().includes(query.toLowerCase())
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

    const handleItemClick = (item) => {
        if (item) {
            folderData.forEach((data) => {
                data.children.forEach((child) => {
                    if (child.seq === item.seq) {
                        setSelectedEmpInfo((prevInfo) => ({
                            ...prevInfo,
                            name: data.name,
                            children: item
                        }));
                    }
                });
            });
        }
    };

    /***********드래그 관련 코드***********/
    const [isDragging, setIsDragging] = useState(false); 
    const [draggingItem, setDraggingItem] = useState(); 

    const handleDrop = (event, type) => {
        event.preventDefault();
        const data = JSON.parse(event.dataTransfer.getData('application/json'));
        const { item, department } = data;

        setSelectedEmpInfo(prev => {
            const existingItems = prev[type] || [];
            const isDuplicate = existingItems.some(existingItem => existingItem.seq === item.seq);

            if ((type !== 'apvchoice' && prev.apvchoice && prev.apvchoice.some(existingItem => existingItem.seq === item.seq))
                || (type !== 'refchoice' && prev.refchoice && prev.refchoice.some(existingItem => existingItem.seq === item.seq))
                || (type !== 'viechoice' && prev.viechoice && prev.viechoice.some(existingItem => existingItem.seq === item.seq))) {
                smallAlert("이미 다른 결재라인에 포함되어 있는 직원입니다.");
                return prev;
            }

            if (isDuplicate) {
                smallAlert("이미 포함된 직원입니다.");
                return prev;
            }

            if (selectedEmpInfo[type].length >= 3) {
                smallAlert("최대 3명까지 설정가능합니다.");
                return prev;
            }

            return {
                ...prev,
                [type]: [...existingItems, { ...item, department }]
            };
        });
    };

    const handleDragOver = (event) => {
        event.preventDefault();
        setIsDragging(false);
        setDraggingItem(null); 
        event.target.style.opacity = '1';
        event.target.style.border = 'none';
    };

    const handleDelete = (type, seq) => {
        setSelectedEmpInfo((prev) => ({
            ...prev,
            [type]: prev[type].filter(line => line.seq !== seq)
        }));
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h4 className={styles.headerText}>결재라인 선택</h4>
            </div>
            <div className={styles.content}>
                {/* 왼쪽 */}
                <div className={styles.lineData}>
                    <div className={styles.searchBox}>
                        <div className={styles.searchLine}>
                            <div className={styles.inputBox}>
                                <input type='text' className={styles.input} placeholder='직원 검색' onChange={handleSearchData}></input>
                            </div>
                            <div className={styles.iconBox}><FaSearch /></div>
                        </div>
                        <div className={styles.searchContent}>
                            {isLoading ? (
                                <Loading /> // 데이터 로딩 중일 때만 로딩 컴포넌트 표시
                            ) : (
                                filteredData.map((folder, index) => (
                                    <DragFolder key={index} folder={folder} onItemClick={handleItemClick} selectedItem={selectedEmpInfo} setSelectedItem={setSelectedEmpInfo}
                                        setDraggingItem={setDraggingItem} isDragging={isDragging} setIsDragging={setIsDragging} />
                                ))
                            )}
                        </div>
                    </div>
                </div>
                {/* 오른쪽 */}
                <div className={styles.lineChoice}>
                    <div className={styles.lineBox}>
                        <div className={styles.apvline} onDrop={(event) => handleDrop(event, 'apvchoice')} onDragOver={handleDragOver}>
                            <div className={styles.apvheader}>결재자</div>
                            <div className={styles.apvchoice}>
                                {(selectedEmpInfo.apvchoice || []).map((item, index) => (
                                    <div key={index} className={styles.choiceText}>
                                        {item.name} ({item.department})
                                        <span className={styles.trashcan}>
                                            <CiTrash onClick={() => handleDelete('apvchoice', item.seq)} />
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className={styles.refline} onDrop={(event) => handleDrop(event, 'refchoice')} onDragOver={handleDragOver}>
                            <div className={styles.refheader}>참조자</div>
                            <div className={styles.refchoice}>
                                {(selectedEmpInfo.refchoice || []).map((item, index) => (
                                    <div key={index} className={styles.choiceText}>
                                        {item.name} ({item.department})
                                        <span className={styles.trashcan}>
                                            <CiTrash onClick={() => handleDelete('refchoice', item.seq)} />
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className={styles.vieline} onDrop={(event) => handleDrop(event, 'viechoice')} onDragOver={handleDragOver}>
                            <div className={styles.vieheader}>열람자</div>
                            <div className={styles.viechoice}>
                                {(selectedEmpInfo.viechoice || []).map((item, index) => (
                                    <div key={index} className={styles.choiceText}>
                                        {item.name} ({item.department})
                                        <span className={styles.trashcan}>
                                            <CiTrash onClick={() => handleDelete('viechoice', item.seq)} />
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
