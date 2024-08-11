import { useEffect } from 'react';
import styles from './ApprovalMenu.module.css'
import { BsPencilSquare} from "react-icons/bs";
import { FaArrowRightLong } from "react-icons/fa6";
import { TfiTime } from "react-icons/tfi";

export const ApprovalMenu=({setIsApproval, isReject, setIsReject, setIsHoldoff,
    setModalState, openModal, modalState, setPage
})=>{

    const handleApproval =()=>{
        setIsApproval(true);
    }

    const handleReject=()=>{
        setModalState("ModalForm");
        setPage(1);
        setIsReject(true);
    }

    //반려일 때 모달창 열기
    useEffect((e)=>{
        console.log(modalState)
       if(isReject){
            openModal();
       }
    },[isReject])

    const handleHoldoff=()=>{
        setIsHoldoff(true);
    }
 
    return(
        <div className={styles.container}>
            <span className={styles.menuspancenter} onClick={handleApproval}><BsPencilSquare size={19}  className={styles.menuright} />결재</span>
            <span className={styles.menuspancenter} onClick={handleReject} ><FaArrowRightLong size={19} className={styles.menuright} />반려</span>
            <span className={styles.menuspancenter} onClick={handleHoldoff}><TfiTime  size={20} className={styles.menuright} />보류</span>
        </div>
    )
}