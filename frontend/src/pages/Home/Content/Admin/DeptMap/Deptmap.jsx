import axios from "axios";
import { useEffect, useState } from "react";
import styles from './Deptmap.module.css'
import { BaseUrl } from "../../../../../commons/config";
import { FaRegPlusSquare, FaSearch } from "react-icons/fa";
import { useLocation } from "react-router-dom";
import { Folderdept } from "./Folderdept";
import { Pagination } from "../../../../../components/Pagination/Pagination";
import { Modal } from "../../../../../components/Modal/Modal";
import { ModalDept } from "./ModalDept/ModalDept";

export const Deptmap=()=>{
    
    const [folderData, setFolderData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedItem, setSelectedItem] = useState({ children: {} });
    const [searchInput, setSearchInput] = useState('');
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [selectedFolder, setSelectedFolder] = useState(null);
    const [selectedChild, setSelectedChild] = useState(null);
 // Pagingation
 const PER_PAGE = 8; // 한 페이지에 보여줄 목록 수 
//  const pageCount = Math.ceil(selectedFolder.children.length / PER_PAGE); // (총 갯수 / PER_PAGE) = 페이지 몇 개 나올지 계산  
 const [currentPage, setCurrentPage] = useState(0);
 const handlePageChange = ({selected}) => {
    setCurrentPage(selected);
    window.scrollTo(0,320); // 페이지 변경 시 스크롤 맨 위로 이동
};


    const location = useLocation();
    const state = location.state;
    console.log("headerTxt"+ state?.type)
  
    // 상태에 따라 header 내용 설정
    const headerText = state?.type || '조직도';
  
    useEffect(() => {
        setIsLoading(true);
        axios.get(`${BaseUrl()}/adminmember/organization`).then((resp) => {
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
    
    useEffect(() => {
        if (selectedFolder) {
            setCurrentPage(0); 
        }
    }, [selectedFolder]);

    


    const handleSearchData = (e) => {
        setSearchInput(e.target.value);
    }

    const handleFolderClick = (folder) => {
        setSelectedFolder(folder);
    };

    const handleItemClick = (item) => {
        const parentFolder = folderData.find(folder => folder.children.some(child => child.seq === item.seq));
        if (parentFolder) {
            setSelectedFolder(parentFolder);
        }
    };


    useEffect(() => {
        const filterFolders = (data, query) => {
            if (!query) return data;
            return data
                .map(folder => {
                    // 폴더 이름이 undefined일 수 있는 경우를 대비하여 기본값을 설정
                    const folderName = folder.name || '';
                    const folderMatches = folderName.toLowerCase().includes(query.toLowerCase());

                    // 자식 항목의 필터링
                    const filteredChildren = folder.children.filter(child => {
                        const childName = child.name || '';
                        const childRole = child.role || '';
                        return childName.toLowerCase().includes(query.toLowerCase()) ||
                            childRole.toLowerCase().includes(query.toLowerCase());
                    });
                    // const folderMatches = folder.name.toLowerCase().includes(query.toLowerCase());
                    // const filteredChildren = folder.children.filter(child =>
                    //     child.name.toLowerCase().includes(query.toLowerCase()) 
                    //     // ||
                    //     // child.role.toLowerCase().includes(query.toLowerCase())
                    // );
                    
                    
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

    const handleDeptAdded = (newDept) => {
        // 새로운 부서가 추가되면 기존 부서 목록에 새 부서를 추가합니다.
        setFolderData(prevData => {
            // 새로운 부서를 기존 부서 데이터에 추가
            const updatedData = [...prevData, newDept];
            setFilteredData(updatedData); // 필터링된 데이터도 업데이트
            return updatedData;
        });
    };

// 페이지네이션을 위해 selectedFolder가 null이 아닐 때만 계산
const pageCount = selectedFolder ? Math.ceil(selectedFolder.children.length / PER_PAGE) : 0;

 // 모달))----------------------------------------------------
     const [ isModalOpen, setIsModalOpen ] = useState(false);
     const openModal = () => setIsModalOpen(true);
     const closeModal = () => setIsModalOpen(false);
    // 부서 추가 
    const handleAddDept =()=>{
        openModal(); 
    }
  

    return (
        <div className={styles.container}>
            <div className={styles.header}><h3 className={styles.headerText}>{headerText}</h3></div>
            <div className={styles.content}>
                <div className={styles.searchBox}>
                    <div className={styles.addDept} onClick={handleAddDept}>
                        부서 &nbsp;<FaRegPlusSquare size={20}/> 
                    </div>
                    <div className={styles.searchLine}>
                        <div className={styles.inputBox}>
                            <input
                                type='text'
                                className={styles.input}
                                placeholder='이름 또는 직위 검색'
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
                                <Folderdept
                                    key={index}
                                    folder={adjustFolderProps(folder)}
                                    onItemClick={handleItemClick}
                                    onFolderClick={handleFolderClick}
                                    selectedItem={selectedFolder}
                                    isFiltered={!!searchInput}
                                />
                            ))
                        ) : (
                            <p>데이터가 없습니다.</p>
                        )}
                    </div>
                </div>
                <div className={styles.deptlist}>
                    {selectedFolder && (
                        <div className={styles.tableBox}>
                            <h4>{selectedFolder.name} 팀</h4>
                            <table>
                                <thead>
                                    <tr>
                                        <th></th>
                                        <th>이름</th>
                                        <th>직위</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {selectedFolder.children
                                    .slice(currentPage * PER_PAGE, (currentPage +1) * PER_PAGE)
                                    .map(child => (
                                        <tr key={child.seq}>
                                            <td><img src={child.avatar} alt={child.name} width="50" /></td>
                                            <td>{child.name}</td>
                                            <td>{child.role}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                    <div className={styles.pagination}>
                        {/* 페이지네이션 */}
                        {pageCount > 0 && (
                            <Pagination
                            pageCount={pageCount}
                            onPageChange={handlePageChange}
                            currentPage={currentPage}
                            />
                            )}
                    </div>
                </div>
                
            </div>
            <Modal isOpen={isModalOpen} onClose={closeModal}>
                <div className={styles.modalForm}>
                   <ModalDept setIsModalOpen={setIsModalOpen} onDeptAdded={handleDeptAdded}/>
                </div>
            </Modal>
        </div>
    );
    


}