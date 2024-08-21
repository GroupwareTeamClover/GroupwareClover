import { useEffect, useState } from 'react';
import styles from './ModalPosition.module.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BaseUrl } from '../../../../../../../../commons/config';
import { useMemStore } from '../../../../../../../../store/store';


export const ModalPosition = ({modalState, setIsModalOpen,checkedMems,resetCheckboxes, setCurrentPage, currentPage })=>{
    
    const {storemembers, setstoremembers} = useMemStore();
    const [members, setMembers]= useState([]);  // 선택한 사원 관련 정보들
    const [newValue, setNewValue] = useState('');
    const [updateMems, setUpdateMems] = useState({stateCode:'', joinTable:'', valueCol:''})
    const closeModal = () => setIsModalOpen(false);
    const checkedCount = checkedMems.length;
    const [deptName, setDeptName] = useState([]);
    const [roleName, setRoleName] = useState([]);
    const [workName, setWorkName] = useState([]);
    const [empState, setEmpState] = useState([]);

    useEffect(()=>{
        if(modalState === '부서변경'){setUpdateMems({stateCode:'DEPT_CODE', joinTable:'department', valueCol:'DEPT_CODE'}) }
        else if(modalState === '직위변경'){setUpdateMems({stateCode:'ROLE_CODE', joinTable:'role', valueCol:'ROLE_CODE'}) }
        else if(modalState === '사용자그룹변경' ){setUpdateMems({stateCode:'WORKER_STATE_CODE', joinTable:'worker_state', valueCol:'WORKER_STATE_CODE'}) }
        else if(modalState === '계정상태변경'){setUpdateMems({stateCode:'EMP_STATE_CODE', joinTable:'employee_state', valueCol:'EMP_STATE_CODE'}) }
        setMembers(checkedMems)
    },[modalState, checkedMems, members])

     // 서버에서 부서코드-이름 데이터를 가져옴
     useEffect(()=>{
        axios.get(`${BaseUrl()}/adminmember/deptName`).then((resp)=>{
            setDeptName(resp.data);
            console.log(resp.data)
        });
    },[]);
    useEffect(()=>{
        axios.get(`${BaseUrl()}/adminmember/roleName`).then((resp)=>{
            setRoleName(resp.data);
            console.log(resp.data)
        });
    },[]);
    useEffect(()=>{
        axios.get(`${BaseUrl()}/adminmember/workName`).then((resp)=>{
            setWorkName(resp.data);
            console.log(resp.data)
        });
    },[]);
    useEffect(()=>{
        axios.get(`${BaseUrl()}/adminmember/empState`).then((resp)=>{
            setEmpState(resp.data);
            console.log(resp.data)
        });
    },[]);


    const handleChangeStatus =(e)=>{
        const { value } = e.target;
        setNewValue(value);         // select에서 선택한 옵션명
        console.log(checkedMems)
    }
    
    const handleSave = () => {
        // 변경 안되는 이유
      
        const param = {
            updateMems,
            newValue,
            empSeqList:members            
        };      
        
        console.log(newValue);
        if(newValue !==''){
            console.log("update axios param: " +param.updateMems.stateCode +"dd "+ param.empSeqList) // 선택한 상태 변경할 목록(예. 직위), 변경할 항목(예. 대리), 변경할 사원번호(예. 32)
            axios.put(`${BaseUrl()}/adminmember`, param)    //수정하기
            .then(()=>{
                setstoremembers(true);
                closeModal();
                resetCheckboxes();
                setCurrentPage(currentPage);
        })
        }else{ alert("수정사항을 선택해주세요.")}
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
                            {deptName.map(dept =>(
                                            <option key={dept.DEPT_CODE} value={dept.DEPT_CODE}>
                                                {dept.DEPT_NAME}
                                            </option>
                                        ))}
                        </select>
                        </>
                    }
                    {modalState === "직위변경" &&
                        <>
                        <select name={modalState} onChange={handleChangeStatus}>
                            <option value="">직위</option>
                            {roleName.map(role =>(
                                <option key={role.ROLE_CODE} value={role.ROLE_CODE}>
                                    {role.ROLE_NAME}
                                </option>
                            ))}
                        </select>
                        </>
                    }
                    {modalState === "사용자그룹변경" &&
                        <>
                        <select name={modalState} onChange={handleChangeStatus}>
                            <option value="">사용자그룹</option>
                            {workName.map(work =>(
                                <option key={work.WORKER_STATE_CODE} value={work.WORKER_STATE_CODE}>
                                    {work.WORKER_STATE_NAME}
                                </option>
                            ))}
                        </select>
                        </>
                    }
                    {modalState === "계정상태변경" &&
                        <>
                        <select name={modalState} onChange={handleChangeStatus}>
                            <option value="">계정상태</option>
                            {empState
                            .filter(emp => emp.EMP_STATE_NAME !== '가입대기')  
                            .map(emp =>(
                                            <option key={emp.EMP_STATE_CODE} value={emp.EMP_STATE_CODE}>
                                                {emp.EMP_STATE_NAME}
                                            </option>
                                        ))}
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