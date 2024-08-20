import axios from "axios";
import { useEffect, useState } from "react";
import styles from './Deptmap.module.css'
import { BaseUrl } from "../../../../../commons/config";
import { FaSearch } from "react-icons/fa";
import { Folder } from "../../../../../components/Folder/Folder";
import { useLocation } from "react-router-dom";

export const Deptmap=()=>{
    
    const [folderData, setFolderData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedItem, setSelectedItem] = useState({ children: {} });
    const [searchInput, setSearchInput] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState(null);


    const location = useLocation();
    const state = location.state;
    console.log("headerTxt"+ state?.type)
  
    // 상태에 따라 header 내용 설정
    const headerText = state?.type || '접속 로그 관리';
  
  

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
        setSelectedItem({ children: item });
        setSelectedEmployee({
            seq: item.seq,
            name: item.name,
            role: item.role,
            avatar: item.avatar
        });
        // setIsModalOpen(true);
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

 

    return (
       
        // 
        <div className={styles.container}>
             <div className={styles.header}><h3 className={styles.headerText}>{headerText}</h3></div>
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
           
        </div>
    );


}