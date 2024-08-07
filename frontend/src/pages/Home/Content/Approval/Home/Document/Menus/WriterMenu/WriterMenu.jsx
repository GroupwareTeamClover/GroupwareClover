import styles from './WriterMenu.module.css';
import { MdOutlineCancel } from "react-icons/md";
import { MdEmergency } from "react-icons/md";
import { BsPencilSquare, BsDownload } from "react-icons/bs";
import { useState, useEffect } from 'react';

export const WriterMenu=({setIsInsert, setIsEmergency})=>{

    //결재요청 클릭시 각 양식에서 상태확인
    const handleInsert= () =>{
        // console.log('Insert button clicked'); // 디버깅용
        setIsInsert(true);
    }

    // 긴급여부 체크박스 상태
    const handleEmergencyChange = (e) => {
        if(e.target.checked){
            setIsEmergency('y');
        }else{
            setIsEmergency('n');
        }
    }


    return(
        <div className={styles.container}>
            <span className={styles.menuspancenter} onClick={handleInsert}><BsPencilSquare size={19}  className={styles.menuright}/>결재요청</span>
            <span className={styles.menuspancenter}><BsDownload size={19} className={styles.menuright}/>임시저장</span>
            <span className={styles.menuspancenter}><MdOutlineCancel size={20} className={styles.menuright}/>취소</span>
            <span className={styles.menuspancenter}><MdEmergency className={styles.menuright}/>긴급여부<input type="checkbox" className={styles.inputcheck} onChange={handleEmergencyChange}></input></span>
        </div>
    )
}