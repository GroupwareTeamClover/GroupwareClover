import styles from './ChoiceLine.module.css'
import { FaSearch} from "react-icons/fa";
import { useState, useEffect } from 'react';
import axios from 'axios';
import { BaseUrl } from '../../../../../commons/config';
import { DragFolder } from '../DragFolder/DragFolder';
import { CiTrash } from "react-icons/ci";
import { useApprovalStore } from '../../../../../store/approvalStore';


export const ChoiceLine= () =>{

    // console.log(`라인컴포넌트: ${selectedDocCode.children.name}`)
    const {selectedEmpInfo, setSelectedEmpInfo} = useApprovalStore();
    const [folderData, setFolderData] = useState([]);

    useEffect(() => {
        axios.get(`${BaseUrl()}/employee`).then((resp) => {
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
        if(item){
            folderData.map((data) => {
                data.children.map((children) => {
                    if(children.seq === item.seq){
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

    /***********드래그 관련 코드*********** */ 
    //드래그중인 상태 저장
    const [isDragging, setIsDragging] = useState(false); 
    // 드래그 중인 아이템을 저장하는 상태
    const [draggingItem, setDraggingItem] = useState(); 

    const handleDrop = (event, type) => {
        event.preventDefault();
        const data = JSON.parse(event.dataTransfer.getData('application/json'));
        const { item, department } = data;
        // console.log(item, department);

        setSelectedEmpInfo(prev => ({
            ...prev,
            [type]: [...(prev[type] || []), { ...item, department }]
        }));

        // console.log(selectedEmpInfo);

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

    //결재라인 선택 중에 결재라인 삭제하기
    const handleDelete =(type, seq)=>{
        // console.log(name);

        //포함된 결재라인에서 삭제하기
        setSelectedEmpInfo((prev)=>({
            ...prev,
            [type]: prev[type].filter(line => line.seq !== seq)
        }))
    }

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
                        <div className={styles.refline}  onDrop={(event) => handleDrop(event, 'refchoice')} onDragOver={handleDragOver}>
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