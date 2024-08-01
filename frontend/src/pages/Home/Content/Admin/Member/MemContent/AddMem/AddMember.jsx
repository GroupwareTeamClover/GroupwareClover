import { useNavigate } from "react-router-dom";
import styles from './AddMember.module.css';
import { useEffect, useRef, useState } from "react";
import axios from 'axios';
import { Modal } from "../../../../../../../components/Modal/Modal";
import { ModalAdd } from "./ModalAdd/ModalAdd";
import { BaseUrl } from "../../../../../../../commons/config";



export const AddMember = ()=>{

    const navi = useNavigate();

    const [newMem, setNewMem] = useState([{ }]);

    // axios로 출력받기 emp table - joindate가 이번달인 사람들....  
    useEffect(()=>{
        axios.get(`${BaseUrl()}/adminaddmem`).then((resp)=>{
            console.log(resp)
            setNewMem(resp.data);
            // setFiltered(resp.data)
            
        })

        // axios.get(`${BaseUrl()}/member`).then((resp)=>{
            // setNewMemCount(resp.data);  // 승인대기중 사원 수 select count(state) from emp where state=0;
            // })
    },[])


    const countNewMem = newMem.length;
   
    // ----전체 체크박스 클릭
    const checkboxRef = useRef([]);
    const handleCheckAll = (e)=>{
        const checked = e.target.checked;
        const allValues = newMem.map(mem => mem.EMP_SEQ);
        checkboxRef.current.forEach(checkbox => {
            if(checkbox){
                checkbox.checked = checked;
            }
        })
        setCheckedMems(checked ? allValues : [])
    }
    const [ checkedMems, setCheckedMems] = useState([]);
    const handleCheckBox =(e)=>{
        const {value, checked} = e.target;
        setCheckedMems(prev=> {
            if(checked){
                return [...prev, value];
            }else{
                return prev.filter(el => el !== value);
            }
        })
    }

    // 모달))----------------------------------------------------
    const [ modalState, setModalState ] = useState("");
    const [ isModalOpen, setIsModalOpen ] = useState(false);
    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);
    // 승인버튼
    // 모달) 변경 버튼 클릭시 
    const handleModalChange = (e) => {
        const modalName = e.target.value;
        setModalState(modalName);
        openModal();
    }
   
    // axios 수정update하기  emp table - state가 0인 상태인 것 -> 1로 업데이트
    const handleAddMem =(e)=>{
        // 모달창 뜨게...
    }

    
    return(
        <div className={styles.container}>
            <div className={styles.member_info}>
                {/* emp table에서 state가 0인 사람 갯수. select count(state) from emp where state=0; */}
                    <div className={styles.member_info_box}>
                        승인대기중  : {countNewMem} 명
                    </div>
            </div>
            <div className={styles.funcBtn}>
                {/* <div className={styles.col_button}> */}
                    <button className={styles.addBtn} onClick={handleModalChange} name='ModalForm' >승인</button>
                {/* </div> */}
            </div>
        
            <div className={styles.body}>
                <div className={styles.tableWrapper}>
                    <table className={styles.table}>
                        <thead className={styles.thead}>
                            <tr>
                                <td className={styles.theadtd}><input type="checkbox" onClick={handleCheckAll}></input></td>
                                <td className={styles.theadtd}>이름</td>
                                <td className={styles.theadtd}>
                                    <select>
                                        <option value="none">부서</option>
                                        <option>인사팀</option> 
                                        <option>회계팀</option> 
                                        <option>영업팀</option> 
                                    </select>
                                </td>
                                <td className={styles.theadtd}>
                                    <select>
                                        <option value="none">직위</option>
                                        <option>사장</option> 
                                        <option>대리</option> 
                                        <option>사원</option> 
                                    </select>   
                                </td>
                                <td className={styles.theadtd}>
                                    <select>
                                        <option value="none">사용자그룹</option>
                                        <option>정규직</option> 
                                        <option>계약직</option> 
                                        <option>관리자</option> 
                                    </select>
                                </td>
                                <td className={styles.theadtd}>가입날짜</td>
                                <td className={styles.theadtd}>상태</td>
                            </tr>
                        </thead>
                        <tbody className={styles.tbody}>
                            {/* 데이터영역 */}
                            {
                                newMem.map((mem, i)=>{
                                    return(
                                        <tr key={i}>
                                            <td className={styles.theadtd}>
                                                {mem.empStateCode ===0 ? (
                                                    <input type="checkbox" name="emp_seq" value={mem.empSeq} onClick={handleCheckBox} ref={data=> checkboxRef.current[i]=data}></input>
                                                ) : (
                                                    <input type="checkbox" disabled checked ></input>
                                                    )
                                                }
                                            </td>
                                            <td className={styles.theadtd}>{mem.empName} </td>
                                            <td className={styles.theadtd}>{mem.deptCode} </td>
                                            <td className={styles.theadtd}>{mem.roleCode} </td>
                                            <td className={styles.theadtd}>{mem.workerStateCode} </td>
                                            <td className={styles.theadtd}>{mem.joinDate} </td>
                                            <td className={styles.theadtd}> 
                                                {mem.empStateCode ===0  ? (
                                                        <button className={styles.statusBtn} onClick={handleModalChange}> 대기중 </button> 
                                                    ) : (
                                                        <button className={styles.statusBtn2}> 승인완료 </button> 
                                                    )
                                                }
                                            </td>
                                        </tr>
                                    )
                                })
                            }
                        </tbody>
                    </table>
                </div>            


            {/* ---------------------- */}
            
            <div className={styles.pagination}> 123456789</div>
        </div>

        <Modal isOpen={isModalOpen} onClose={closeModal}>
                <div className={styles.modalForm}>
                   
                        <ModalAdd/>
                    
                </div>
        </Modal>
      </div>
    )
}