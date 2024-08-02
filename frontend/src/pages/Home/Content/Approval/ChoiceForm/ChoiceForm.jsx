import { useState, useEffect } from 'react';
import styles from './ChoiceForm.module.css'
import { FaSearch} from "react-icons/fa";
import { Folder } from '../../../../../components/Folder/Folder';
import { BaseUrl } from '../../../../../commons/config';
import axios from 'axios';
import { useApprovalStore } from '../../../../../store/approvalStore';


export const ChoiceForm= () =>{
    const {selectedDocCode, setSelectedDocCode, setCopySelectedDocCode}=useApprovalStore();

    const [folderData, setFolderData]=useState([]);


    useEffect(() => {
        axios.get(`${BaseUrl()}/docCode`).then((resp) => {
            const data = resp.data;
            // console.log(data)
            // 부서별로 데이터를 그룹화
            const departmentMap = data.reduce((acc, current) => {
                const { CODE, NAME, PERIOD , DETAILCODE } = current;
                if (!acc[CODE]) {
                    acc[CODE] = { name: CODE, children: [] };
                }
                acc[CODE].children.push({ name: NAME, period: PERIOD , detailcode:DETAILCODE});
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

    //콜백함수로 전달받은 선택한 양식 이름을 폴더데이터에서 가져와서 비교해 정보저장
     const handleItemClick = (item) => {
        if(item){
            //찾기
            folderData.map((data,index)=>{
                data.children.map((children,index)=>{
                    if(children.name===item.name){
                        setSelectedDocCode({name: data.name, children: item})
                    }
                })
            })
        }
    };

    


    //다음모달창
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [Page, setPage] = useState(1);

    const handlePageChange = (e) =>{
        setPage(prev => {
          if(e.target.name === "prev") {
            if(prev === 1) return 1;
            else return prev - 1;
          } else {
            if(prev === 2) return 2;
            else return prev + 1;
          }
        });
    }

    const handleNextClick = () => {
        if (selectedDocCode) {
            setIsModalOpen(true);
        } else {
            alert("항목을 선택하세요.");
        }
    };


    return(
        <div className={styles.container}>
            <div className={styles.header}>
                <h4 className={styles.headerText}>결재양식 선택</h4>
            </div>
            <div className={styles.contentWrapper}>
                {/* 왼쪽 */}
                <div className={styles.content}>
                    <div className={styles.searchBox}>
                        <div className={styles.searchLine}>
                            <div className={styles.inputBox}> 
                                <input type='text' className={styles.input} placeholder='양식선택' onChange={handleSearchData}></input>
                                </div>
                            <div className={styles.iconBox}><FaSearch/></div>
                        </div>
                        <div className={styles.searchContent}>
                            {filteredData.map((folder, index) => (
                                <Folder key={index} folder={folder}  onItemClick={handleItemClick} selectedItem={selectedDocCode} setSelectedItem={setSelectedDocCode}  />
                            ))}
                        </div>
                    </div>
                </div>
                {/* 오른쪽 */}
                <div className={styles.choice}>
                    <div className={styles.choiceBox}>
                        <div className={styles.choiceHeader}><span className={styles.choiceHeaderText}>상세정보</span></div>
                        <div className={styles.choiceContent}>
                            <div className={styles.choiceInfoLine}>
                                <span className={styles.choiceContentText}>양식명:</span>
                                &nbsp;  
                                <span  className={styles.choiceText}>{selectedDocCode.children.name ? selectedDocCode.children.name:''}</span>
                            </div>
                            <div className={styles.choiceInfoLine}>
                                <span className={styles.choiceContentText}>양식구분:</span>
                                &nbsp; 
                                <span className={styles.choiceText}>{selectedDocCode.name ? selectedDocCode.name:''}</span>
                            </div>
                            <div className={styles.choiceInfoLine}>
                                <span className={styles.choiceContentText}>보존년한:</span> 
                                &nbsp; 
                                <span  className={styles.choiceText}>{selectedDocCode.children.period ? selectedDocCode.children.period:''}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}




