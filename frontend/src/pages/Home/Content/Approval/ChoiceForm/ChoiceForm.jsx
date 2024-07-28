import { useState, useEffect } from 'react';
import styles from './ChoiceForm.module.css'
import { FaSearch} from "react-icons/fa";
import { Folder } from '../../../../../components/Folder/Folder';
import { BaseIP } from '../../../../../commons/members';
import axios from 'axios';
import { Modal } from '../../../../../components/Modal/Modal';

export const ChoiceForm= () =>{
    //데이터 모습
    // const folderData=[
    //     {
    //         name: "일반",
    //         children: [{name :"업무기안"}]
    //     },
    // ]

    //데이터 가져오기
    const [folderData, setFolderData]=useState([]);

    useEffect(()=>{
        axios.get(`${BaseIP()}/docCode`).then((resp)=>{
            const newFolderData=resp.data.map((line)=>({
                name: line.CODE,
                children: [{name: line.NAME}]
            }))
            setFolderData(newFolderData);
        })
    },[])

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

    //양식선택
    const [selectedItem, setSelectedItem] = useState(null);

    const handleNextClick = () => {
        console(selectedItem);
        if (selectedItem) {
            setIsModalOpen(true);
        } else {
            alert("항목을 선택하세요.");
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


    //콜백함수로 전달받은 선택한 양식 이름
    const handleItemClick = (item) => {
        setSelectedItem(item);
        console.log(item)
    };



    return(
        <div className={styles.container}>
            <div className={styles.header}>
                <h4 className={styles.headerText}>결재양식 선택</h4>
            </div>
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
                            <Folder key={index} folder={folder}  onItemClick={handleItemClick} selectedItem={selectedItem} />
                        ))}
                    </div>
                </div>
            </div>
           
            {isModalOpen && (
                <Modal 
                    item={selectedItem} 
                    onClose={() => setIsModalOpen(false)} 
                />
            )}
        </div>
    )
}




