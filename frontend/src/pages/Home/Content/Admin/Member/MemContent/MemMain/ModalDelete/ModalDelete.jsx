import { useState } from 'react';
import styles from './ModalDelete.module.css';

export const ModalDelete = ({checkedMems, setIsModalOpen})=>{

    const closeModal = () => setIsModalOpen(false);
    const handleChangeStatus =(e)=>{
        const {name,value} = e.target;
    }
    return(
        <div className={styles.container}>
            <div className={styles.title}>
                선택 사원 {checkedMems.emp_state}명을 삭제하시겠습니까?
            </div>
            <div className={styles.subtitle}>
                    선택한 사원 삭제 시, 해당 멤버(들)의 모든 자료가 함께 삭제되며 삭제 후 복구할 수 없습니다. 
            </div>
            
            <div className={styles.btnstyle}>
                <button className={styles.delete}>삭제</button>
                <button className={styles.cancel} onClick={closeModal}>취소</button>
            </div>
        </div>
    
        )
    }

