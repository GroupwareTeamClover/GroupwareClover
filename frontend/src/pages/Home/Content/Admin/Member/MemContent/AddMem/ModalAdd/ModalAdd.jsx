import { useEffect, useState } from 'react';
import { useMemStore } from '../../../../../../../../store/store';
import styles from './ModalAdd.module.css';

export const ModalAdd = ({setIsModalOpen, checkedMems})=>{
    const {storemembers, setstoremembers} = useMemStore();
    const [members, setMembers]= useState([]);  
    const [updatedStatus, setUpdatedStatus] = useState({});
    const closeModal = () => setIsModalOpen(false);
    const checkedCount = checkedMems.length;

    useEffect(()=>{
        setMembers(checkedMems)
    },[checkedMems])

    const handleChangeStatus = (e)=>{
        const {name, value} = e.target;
        setUpdatedStatus(prev=>({...prev, [name]:value}))
    }
    console.log(updatedStatus)
    console.log(members)
    
    const handleSave = () => {
        const param ={
            updatedStatus,
            empSeqList: members
        }
       
        if(updatedStatus.dept ===''|| updatedStatus.role === '' || updatedStatus.worker_state === ''
        ){
            alert("모든 필드 선택해라")
        }else{alert("귯.")}

    }
    return(
        <div className={styles.container}>
            <div className={styles.title}>
                사원 가입 승인
            </div>
            <div className={styles.subtitle}>
                    선택된 사원 {checkedCount}명에 대해서, 
            </div>
            <div className={styles.changeStatus}>
                <div className={styles.statusTitle}>
                   부서
                </div>
                <div className={styles.statusSelect}>
                    {
                        <select name='dept' onChange={handleChangeStatus}>
                            <option value=''>부서</option>
                            <option value='1'>총무</option> 
                            <option value='2'>인사</option> 
                            <option value='3'>사무</option> 
                            <option value='4'>유통</option> 
                            <option value='5'>경영</option> 
                            <option value='99'>미정</option> 
                        </select>
                    
                    }
                  
                </div>
            </div>
            <div className={styles.changeStatus}>
                <div className={styles.statusTitle}>
                   직위
                </div>
                <div className={styles.statusSelect}>
                    {
                        <select name='role' onChange={handleChangeStatus}>
                            <option value=''>직위</option>
                            <option value='1'>사장</option> 
                            <option value='2'>부사장</option> 
                            <option value='3'>이사</option> 
                            <option value='4'>부장</option> 
                            <option value='5'>차장</option> 
                            <option value='6'>과장</option> 
                            <option value='7'>대리</option> 
                            <option value='8'>사원</option> 
                            <option value='9'>인턴</option> 
                            <option value='99'>미정</option> 
                        </select>
                    }
                </div>
            </div>
            <div className={styles.changeStatus}>
                <div className={styles.statusTitle}>
                   사용자그룹
                </div>
                <div className={styles.statusSelect}>
                    {
                        <select name='worker_state' onChange={handleChangeStatus}>
                            <option value=''>사용자그룹</option>
                            <option value='1'>정규직</option> 
                            <option value='2'>비정규직</option> 
                            <option value='3'>계약직</option> 
                            <option value='0'>관리자</option> 
                        </select>
                    }
                </div>
            </div>
            <div className={styles.btnstyle}>
                <button className={styles.save} onClick={handleSave}>저장</button>
                <button className={styles.cancel} onClick={closeModal}>취소</button>
            </div>
        </div>

    )
}