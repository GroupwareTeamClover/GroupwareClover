import { useState, useEffect } from 'react';
import styles from './ChoiceForm.module.css'
import { FaSearch} from "react-icons/fa";
import { Folder } from '../../../../../components/Folder/Folder';


export const ChoiceForm= () =>{


    const folderData=[
        {
            name: "일반",
            children: [{name :"업무기안"}]
        },
        {
            name: "인사",
            children: [{name: "휴가신청서"},{name:"연차신청서"}]
        }
    ]

    
    const [searchInput, setSearchInput]=useState('');
    const [filteredData, setFilteredData] = useState(folderData);

    const handleSearchData=(e)=>{
        setSearchInput(e.target.value);
    }

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
    }, [searchInput]);


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
                            <Folder key={index} folder={folder} />
                        ))}
                    </div>
                
                </div>
                <div className={styles.infoBox}></div>
            </div>
        </div>
    )
}




