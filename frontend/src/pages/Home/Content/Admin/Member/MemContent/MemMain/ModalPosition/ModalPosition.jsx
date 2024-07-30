import { useEffect, useState } from 'react';
import styles from './ModalPosition.module.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BaseUrl } from '../../../../../../../../commons/config';


export const ModalPosition = ({modalState, setIsModalOpen,checkedMems})=>{
    
    const [members, setMembers]= useState([]);
    const [stateName, setStateName] =useState();
    const [newValue, setNewValue] = useState('');
    
    const closeModal = () => setIsModalOpen(false);

    const checkedCount = checkedMems.length;
    useEffect(()=>{
        console.log("몇개"+checkedCount)
        if(modalState === '부서변경'){setStateName('dept_code')}
        else if(modalState === '직위변경'){setStateName('role_code')}
        else if(modalState === '사용자그룹변경' ){setStateName('worker_state_code')}
        else if(modalState === '계정상태변경'){setStateName('emp_state_code')}
        setMembers(checkedMems)
    },[modalState, checkedMems])
    console.log("modalstate-setStatename: "+stateName)

    const handleChangeStatus =(e)=>{
        const { value } = e.target;
        setNewValue(value);
    }
    
    const handleSave = () => {
        const param = {
            stateName,
            newValue,
            empSeqList: members
        };
            // 선택한 상태 변경할 목록(예. 직위), 변경할 항목(예. 대리), 변경할 사원번호(예. 32)
        console.log("update axios param: " + param.empSeqList)

        // axios.put(`${BaseUrl()}/adminmember`, param)
        //     .then(resp => {
        //         console.log('Update axios: ', resp.data);
                
        //     })
            
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
                            <option>인사팀</option> 
                            <option>회계팀</option> 
                            <option>영업팀</option> 
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