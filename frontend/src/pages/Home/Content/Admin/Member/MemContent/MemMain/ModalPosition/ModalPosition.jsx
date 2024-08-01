import { useEffect, useState } from 'react';
import styles from './ModalPosition.module.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BaseUrl } from '../../../../../../../../commons/config';
import { useMemStore } from '../../../../../../../../store/store';


export const ModalPosition = ({modalState, setIsModalOpen,checkedMems })=>{
    
    const {storemembers, setstoremembers} = useMemStore();
    const [members, setMembers]= useState([]);  // 선택한 사원 관련 정보들
    const [newValue, setNewValue] = useState('');
    const [updateMems, setUpdateMems] = useState({stateCode:'', joinTable:'', valueCol:''})
    const closeModal = () => setIsModalOpen(false);
    const checkedCount = checkedMems.length;
    useEffect(()=>{
        if(modalState === '부서변경'){setUpdateMems({stateCode:'dept_code', joinTable:'department', valueCol:'dept_name'}) }
        else if(modalState === '직위변경'){setUpdateMems({stateCode:'role_code', joinTable:'role', valueCol:'role_name'}) }
        else if(modalState === '사용자그룹변경' ){setUpdateMems({stateCode:'worker_state_code', joinTable:'worker_state', valueCol:'worker_state_name'}) }
        else if(modalState === '계정상태변경'){setUpdateMems({stateCode:'emp_state_code', joinTable:'employee_state', valueCol:'emp_state_name'}) }
        setMembers(checkedMems)
    },[modalState, checkedMems, members])
    // console.log("modalstate-setStatename: "+updateMems.stateCode +" jointable: "+ updateMems.joinTable +" members : "+members)


    const handleChangeStatus =(e)=>{
        const { value } = e.target;
        setNewValue(value);         // select에서 선택한 옵션명
    }
    
    const handleSave = () => {
        const param = {
            updateMems,
            newValue,
            empSeqList: members
        };      
        
        
        if(newValue !==''){
                         // 선택한 상태 변경할 목록(예. 직위), 변경할 항목(예. 대리), 변경할 사원번호(예. 32)
                        console.log("update axios param: " +param.updateMems.stateCode +" "+ param.empSeqList)
            axios.put(`${BaseUrl()}/adminmember`, param)    //수정하기
            .then(
                setstoremembers(true),
                closeModal()
            )
        }
    };
        
   
    return(
        <div className={styles.container}>
            <div className={styles.title}>
                멤버 정보 수정
            </div>
            <div className={styles.subtitle}>
                    선택된 사원 {checkedCount}명에 대해서, 
            </div>
            <div className={styles.changeStatus}>
                <div className={styles.statusTitle}>
                    {modalState}
                </div>
                <div className={styles.statusSelect}>
                    {modalState === "부서변경" &&
                        <>
                        <select name={modalState} onChange={handleChangeStatus}>
                            <option value="">부서</option>
                            <option>총무</option> 
                            <option>인사</option> 
                            <option>사무</option> 
                            <option>유통</option> 
                            <option>경영</option> 
                            <option>미정</option> 
                        </select>
                        </>
                    }
                    {modalState === "직위변경" &&
                        <>
                        <select name={modalState} onChange={handleChangeStatus}>
                            <option value="">직위</option>
                            <option>사장</option> 
                            <option>과장</option> 
                            <option>대리</option> 
                            <option>사원</option> 
                            <option>미정</option> 
                        </select>
                        </>
                    }
                    {modalState === "사용자그룹변경" &&
                        <>
                        <select name={modalState} onChange={handleChangeStatus}>
                            <option value="">사용자그룹</option>
                            <option>정규직</option> 
                            <option>계약직</option> 
                            <option>관리자</option> 
                        </select>
                        </>
                    }
                    {modalState === "계정상태변경" &&
                        <>
                        <select name={modalState} onChange={handleChangeStatus}>
                            <option value="">계정상태</option>
                            <option>정상</option> 
                            <option>휴면</option> 
                            <option>중지</option> 
                        </select>
                        </>
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