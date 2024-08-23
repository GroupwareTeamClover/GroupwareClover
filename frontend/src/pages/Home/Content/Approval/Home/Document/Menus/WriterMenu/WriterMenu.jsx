import styles from './WriterMenu.module.css';
import { MdOutlineCancel } from "react-icons/md";
import { MdEmergency } from "react-icons/md";
import { BsPencilSquare, BsDownload } from "react-icons/bs";
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {smallConfirmAlert} from '../../../../../../../../commons/common'

export const WriterMenu=({setIsInsert, setIsEmergency, setIsTemp})=>{

    const navi = useNavigate();

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

    //임시저장
    const handleTemp=()=>{
        setIsTemp(true);
    }

    //취소
    const handleInsertCancle=()=>{
        smallConfirmAlert("작성중이던 내용은 모두 사라집니다. 취소하시겠습니까?").then((result)=>{
            if(result.isConfirmed){
                navi('/approval');
            }
        })
    }

    return(
        <div className={styles.container}>
            <span className={styles.menuspancenter} onClick={handleInsert}><BsPencilSquare size={19}  className={styles.menuright}/>결재요청</span>
            <span className={styles.menuspancenter} onClick={handleTemp}><BsDownload size={19} className={styles.menuright}/>임시저장</span>
            <span className={styles.menuspancenter} onClick={handleInsertCancle}><MdOutlineCancel size={20} className={styles.menuright}/>취소</span>
            <span className={styles.menuspancenter}><MdEmergency className={styles.menuright}/>긴급여부<input type="checkbox" className={styles.inputcheck} onChange={handleEmergencyChange}></input></span>
        </div>
    )
}