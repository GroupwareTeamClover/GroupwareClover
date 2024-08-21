import { useEffect, useState } from 'react';
import { useMemStore } from '../../../../../../../../store/store';
import styles from './ModalAdd.module.css';
import axios from 'axios';
import { BaseUrl } from '../../../../../../../../commons/config';
import { smallAlert } from '../../../../../../../../commons/common';

export const ModalAdd = ({setIsModalOpen, checkedMems, resetCheckboxes})=>{
    const [deptName, setDeptName] = useState([]);
    const [roleName, setRoleName] = useState([]);
    const [workName, setWorkName] = useState([]);
    const [empState, setEmpState] = useState([]);
    //
    const {storemembers, setstoremembers} = useMemStore();
    const [members, setMembers]= useState([{}]);  
    // const [modalEmail, setModalEmail] = useState([]);
    const [updatedStatus, setUpdatedStatus] = useState({dept:0,role:0,worker_state:0});
    const closeModal = () => setIsModalOpen(false);
    const checkedCount = checkedMems.length;

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

    useEffect(()=>{
        setMembers(checkedMems)
        console.log(checkedMems)
        // setModalEmail(modalEmail)
    },[checkedMems])

    const handleChangeStatus = (e)=>{
        const {name, value} = e.target;
        setUpdatedStatus(prev=>({...prev, [name]:value}))

    }
    
    const handleSave = () => {
      
        console.log(updatedStatus)
        console.log(members)
        const empSeqList = members.map(member => member.EMP_SEQ);
        const empEmailList = members.map(member => member.EMP_EMAIL);
        // console.log(modalEmail)
        const { dept, role, worker_state } = updatedStatus;
        const requestData = {
            dept: updatedStatus.dept,
            role: updatedStatus.role,
            worker_state: updatedStatus.worker_state,
            empSeqList: empSeqList,   // `EMP_SEQ` 리스트
            empEmailList: empEmailList
        };

        if (!dept || !role || !worker_state) {
            smallAlert("선택하세요");
        } else {
            axios.put(`${BaseUrl()}/adminaddmem`, requestData)
            .then((resp)=>{
                console.log("수정 결과: "+resp.data)
                smallAlert("승인되었습니다. ");
                resetCheckboxes();
                setstoremembers(true);
                closeModal();
            }
            )
            .catch((error) => {
                console.error("수정 중 오류 발생:", error);
                smallAlert("승인 처리 중 오류가 발생했습니다.");
            });
        }
        
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
                            {deptName.map(dept =>(
                                            <option key={dept.DEPT_CODE} value={dept.DEPT_CODE}>
                                                {dept.DEPT_NAME}
                                            </option>
                                        ))}
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
                            {roleName.map(role =>(
                                            <option key={role.ROLE_CODE} value={role.ROLE_CODE}>
                                                {role.ROLE_NAME}
                                            </option>
                                        ))}
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
                            {workName.map(work =>(
                                            <option key={work.WORKER_STATE_CODE} value={work.WORKER_STATE_CODE}>
                                                {work.WORKER_STATE_NAME}
                                            </option>
                                        ))}
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