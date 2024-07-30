import styles from './ChoiceLine.module.css'
import { FaSearch} from "react-icons/fa";
import { useState, useEffect } from 'react';
import axios from 'axios';
import { BaseUrl } from '../../../../../commons/config';
import { DragFolder } from '../DragFolder/DragFolder';


export const ChoiceLine= ({selectedDocCode, selectedEmpInfo, setSelectedEmpInfo}) =>{

    // console.log(`라인컴포넌트: ${selectedDocCode.children.name}`)

    const [folderData, setFolderData] = useState([]);


    useEffect(() => {
        axios.get(`${BaseUrl()}/apvLine`).then((resp) => {
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



    const handleItemClick = (item) => { 
        folderData.map((data,index)=>{
            data.children.map((children,index)=>{
                if(children.name===item.name){
                    // console.log('접근 확인');
                    setSelectedEmpInfo({name: data.name, children: item})
                }
            })
        })
    };

    /***********드래그 관련 코드*********** */ 
    //드래그중인 상태 저장
    const [isDragging, setIsDragging] = useState(false); 
    // 드래그 중인 아이템을 저장하는 상태
    const [draggingItem, setDraggingItem] = useState(); 
    //드래그 영역별 정보 저장
    const [dragTypeEmpInfo, setDragTypeEmpInfo] = useState({ apvchoice: [], recchoice: [], refchoice: [] });
    //selectedEmpInfo는 드래그된 전체 정보 저장



    const handleDrop = (event, type) => {
        event.preventDefault();
        const data = JSON.parse(event.dataTransfer.getData('application/json'));
        const { item, department } = data;
        console.log(item, department);

        setSelectedEmpInfo(prev => ({
            ...prev,
            [type]: [...(prev[type] || []), { ...item, department }]
        }));

        //영역별 정보 저장 영역
        // 드래그 영역별 정보 저장
        setDragTypeEmpInfo(prev => ({
            ...prev,
            [type]: [...(prev[type] || []), { ...item, department }]
        }));
    };

    const handleDragOver = (event) => {
        event.preventDefault();

        //드래그 종료 상태로 변경
        setIsDragging(false);
        // 드래그 종료 시 아이템 상태 초기화
        setDraggingItem(null); 

        // 드래그 종료 시 원래 스타일로 복원
        event.target.style.opacity = '1';
        event.target.style.border = 'none';
    };

    console.log(`드래그 상태 ${isDragging}`);
    console.log(`드래그 아이템 ${draggingItem}`);
    
    // 상태가 업데이트될 때마다 로그 확인
    useEffect(() => {
        console.log('선택된 전체정보:', JSON.stringify(selectedEmpInfo, null, 2));
        console.log('선택된 영역별정보:', JSON.stringify(dragTypeEmpInfo, null, 2));
        console.log('폴더 저장정보:', JSON.stringify(folderData, null, 2))
    }, [selectedEmpInfo, dragTypeEmpInfo, folderData]);

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
                                <DragFolder key={index} folder={folder}  onItemClick={handleItemClick} selectedItem={selectedEmpInfo} setSelectedItem={setSelectedEmpInfo}  
                               setDraggingItem={setDraggingItem} isDragging={isDragging} setIsDragging={setIsDragging} />
                            ))}
                        </div>
                    </div>
                </div>
                {/* 오른쪽 */}
                <div className={styles.lineChoice}>
                    <div className={styles.lineBox}>
                        <div className={styles.apvline} onDrop={(event) => handleDrop(event, 'apvchoice')} onDragOver={handleDragOver}>
                            <div className={styles.apvheader}>결재자</div>
                            <div className={styles.apvchoice}>
                                {selectedEmpInfo.apvchoice?.map((item, index) => (
                                        <div key={index}>{item.name} ({item.department})</div>
                                    ))}
                            </div>
                        </div>
                        <div className={styles.recline} onDrop={(event) => handleDrop(event, 'recchoice')} onDragOver={handleDragOver}>
                            <div className={styles.recheader}>수신자</div>
                            <div className={styles.recchoice}>
                                {selectedEmpInfo.recchoice?.map((item, index) => (
                                        <div key={index}>{item.name} ({item.department})</div>
                                    ))} 
                            </div>
                        </div>
                        <div className={styles.refline}  onDrop={(event) => handleDrop(event, 'refchoice')} onDragOver={handleDragOver}>
                            <div className={styles.refheader}>참조자</div>
                            <div className={styles.refchoice}>
                                {selectedEmpInfo.refchoice?.map((item, index) => (
                                        <div key={index}>{`${item.name} (${item.department})`}</div>
                                    ))}
                              
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}