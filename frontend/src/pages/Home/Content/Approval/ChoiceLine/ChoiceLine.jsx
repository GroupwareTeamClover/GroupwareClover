import styles from './ChoiceLine.module.css'
import { FaSearch} from "react-icons/fa";
import { useState, useEffect } from 'react';

export const ChoiceLine= () =>{


    //검색내용가져오기
    const [searchInput, setSearchInput]=useState('');
        const handleSearchData=(e)=>{
        setSearchInput(e.target.value);
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
                                <input type='text' className={styles.input} placeholder='양식선택' onChange={handleSearchData}></input>
                                </div>
                            <div className={styles.iconBox}><FaSearch/></div>
                        </div>
                        <div className={styles.searchContent}>
                            {/* {filteredData.map((folder, index) => (
                                <Folder key={index} folder={folder}  onItemClick={handleItemClick} selectedItem={selectedItem} />
                            ))} */}
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