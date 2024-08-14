import styles from './TempMenu.module.css';
import { MdOutlineCancel } from "react-icons/md";
import { MdEmergency } from "react-icons/md";
import { BsPencilSquare, BsDownload } from "react-icons/bs";
import { useState, useEffect } from 'react';

export const TempMenu=({setIsTempInsert, setIsTempEmergency, setIsTempTemp, setIsTempCancle})=>{

    //결재요청 클릭시 각 양식에서 상태확인
    const handleTempInsert= () =>{
        // console.log('Insert button clicked'); // 디버깅용
        setIsTempInsert(true);
    }

    // 긴급여부 체크박스 상태
    const handleTempEmergencyChange = (e) => {
        if(e.target.checked){
            setIsTempEmergency('y');
        }else{
            setIsTempEmergency('n');
        }
    }

    //임시저장
    const handleTempTemp=()=>{
        setIsTempTemp(true);
    }

    //취소
    const handleTempCancle =()=>{
        setIsTempCancle(true);
    }

    return(
        <div className={styles.container}>
            <span className={styles.menuspancenter} onClick={handleTempInsert}><BsPencilSquare size={19}  className={styles.menuright}/>결재요청</span>
            <span className={styles.menuspancenter} onClick={handleTempTemp}><BsDownload size={19} className={styles.menuright}/>변경저장</span>
            <span className={styles.menuspancenter} onClick={handleTempCancle}><MdOutlineCancel size={20} className={styles.menuright}/>삭제</span>
            <span className={styles.menuspancenter}><MdEmergency className={styles.menuright}/>긴급여부<input type="checkbox" className={styles.inputcheck} onChange={handleTempEmergencyChange}></input></span>
        </div>
    )
}