import styles from './ChoiceLine.module.css'
import { FaSearch} from "react-icons/fa";
import { useState, useEffect } from 'react';
import axios from 'axios';
import { baseUrl } from '../../../../../api/members';
import { Folder } from '../../../../../components/Folder/Folder';

export const ChoiceLine= ({selectedDocCode, selectedEmpInfo, setSelectedEmpInfo}) =>{

    console.log(`라인컴포넌트: ${selectedDocCode.children.name}`)

    const [folderData, setFolderData] = useState([]);

    useEffect(() => {
        axios.get(`${baseUrl()}/apvLine`).then((resp) => {
            const data = resp.data;

            // 부서별로 데이터를 그룹화
            const departmentMap = data.reduce((acc, current) => {
                const { DEPT, NAME, ROLE } = current;
                if (!acc[DEPT]) {
                    acc[DEPT] = { name: DEPT, children: [] };
                }
                acc[DEPT].children.push({ name: NAME, role: ROLE });
                return acc;
            }, {});

            // 객체를 배열로 변환
            const newFolderData = Object.values(departmentMap);
            setFolderData(newFolderData);
        });
    }, []);


    //검색내용가져오기
    const [searchInput, setSearchInput]=useState('');
        const handleSearchData=(e)=>{
        setSearchInput(e.target.value);
    }

     //검색필터설정
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



    const handleItemClick = (item) => { //이름
        //찾기
        folderData.map((data,index)=>{
            data.children.map((children,index)=>{
                if(children.name===item.name){
                    console.log('접근 확인');
                    setSelectedEmpInfo({name: data.name, children: item})
                }
            })
        })
    };


    return(
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
                                <input type='text' className={styles.input} placeholder='라인선택' onChange={handleSearchData}></input>
                                </div>
                            <div className={styles.iconBox}><FaSearch/></div>
                        </div>
                        <div className={styles.searchContent}>
                            {filteredData.map((folder, index) => (
                                <Folder key={index} folder={folder}  onItemClick={handleItemClick} selectedItem={selectedEmpInfo} setSelectedItem={setSelectedEmpInfo}/>
                            ))}
                        </div>
                    </div>
                </div>
                {/* 오른쪽 */}
                <div className={styles.lineChoice}>
                    <div className={styles.lineBox}>
                        <div className={styles.apvline}>
                            <div className={styles.apvheader}>결재자</div>
                            <div className={styles.apvchoice}></div>
                        </div>
                        <div className={styles.recline}>
                            <div className={styles.recheader}>수신자</div>
                            <div className={styles.recchoice}></div>
                        </div>
                        <div className={styles.refline}>
                            <div className={styles.refheader}>참조자</div>
                            <div className={styles.refchoice}></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}