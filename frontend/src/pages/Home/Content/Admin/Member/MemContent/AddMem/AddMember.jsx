import { useNavigate } from "react-router-dom";
import styles from './AddMember.module.css';
import { useEffect, useRef, useState } from "react";
import axios from 'axios';
import { Modal } from "../../../../../../../components/Modal/Modal";
import { ModalAdd } from "./ModalAdd/ModalAdd";
import { BaseUrl } from "../../../../../../../commons/config";
import { useMemStore } from "../../../../../../../store/store";
import {Pagination} from '../../../../../../../components/Pagination/Pagination';
import {format} from 'date-fns';


export const AddMember = ()=>{

    const navi = useNavigate();
    const {storemembers, setstoremembers} = useMemStore();
    const [newMem, setNewMem] = useState([{ }]);
    const [filtered, setFiltered] = useState(newMem);
    const [waitingNum, setWaitingNum] = useState([]);
    const [finishNum, setFinishNum] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);


    // axios로 출력받기 emp table - joindate가 이번달인 사람들....  
    useEffect(()=>{
        axios.get(`${BaseUrl()}/adminaddmem`).then((resp)=>{
            console.log(resp.data)
            setNewMem(resp.data);
            setFiltered(resp.data);
            setstoremembers(false);

            // empStateCode가 1인 갯수(승인완료)
            const countState1 = resp.data.filter(mem => mem.empStateCode === 1).length;
            setFinishNum(countState1);
            // empStateCode가 0인 갯수(승인대기)
            const countState0 = resp.data.filter(mem => mem.empStateCode === 0).length;
            setWaitingNum(countState0);
        })
    },[storemembers])

    // Pagingation
    const PER_PAGE = 10; // 한 페이지에 보여줄 목록 수 
    const pageCount = Math.ceil(filtered.length / PER_PAGE); // (총 갯수 / PER_PAGE) = 페이지 몇 개 나올지 계산  
    console.log(pageCount + " 페이지 수 ")
    const handlePageChange = ({selected}) =>{
        setCurrentPage(selected);
        window.scrollTo(0,320);     // 페이지 변경 시 스크롤 맨 위로 이동시키기. 
    }

   
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
        const clickEmp = e.target.value;
        // setCheckedMems();
        console.log(e.target.value);
        console.log(clickEmp)
        console.log("값 비교 " + newMem);
        openModal();
    }
   
    //날짜 변환
   

    
    return(
        <div className={styles.container}>
            <div className={styles.member_info}>
                {/* emp table에서 state가 0인 사람 갯수. select count(state) from emp where state=0; */}
                <div className={styles.member_total}>
                    <div className={styles.member_emoji}>
                    👥
                    </div>
                    <div className={styles.member_box}>
                        승인대기중  : {waitingNum} 명
                        <div className={styles.member_complete}>이번 달 승인완료 : {finishNum} 명 </div>
                    </div>
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
                                <td className={styles.theadtd}>부서</td>
                                <td className={styles.theadtd}>직위</td>
                                <td className={styles.theadtd}>사용자그룹 </td>
                                <td className={styles.theadtd}>가입날짜</td>
                                <td className={styles.theadtd}>상태</td>
                            </tr>
                        </thead>
                        <tbody className={styles.tbody}>
                            {/* 데이터영역 */}
                            { filtered.slice(currentPage * PER_PAGE, (currentPage +1) * PER_PAGE).map((mem,i)=>{
                                return(
                                        <tr key={i}>
                                            <td className={styles.theadtd}>
                                                {mem.empStateCode ===0 ? (
                                                    <input type="checkbox" name="emp_seq" value={mem.empSeq} onClick={handleCheckBox} ref={data=> checkboxRef.current[i]=data}></input>
                                                ) : (
                                                    <input type="checkbox" disabled></input>
                                                    )
                                                }
                                            </td>
                                            <td className={styles.theadtd}>{mem.empName} </td>
                                            <td className={styles.theadtd}>
                                                {
                                                    mem.deptCode === 1 ? '총무' : 
                                                    mem.deptCode === 2 ? '인사' : 
                                                    mem.deptCode === 3 ? '사무' : 
                                                    mem.deptCode === 4 ? '유통' : 
                                                    mem.deptCode === 5 ? '경영' : '미정'
                                                } 
                                            </td>
                                            <td className={styles.theadtd}>
                                                {
                                                    mem.roleCode === 1 ? '사장' :
                                                    mem.roleCode === 2 ? '부사장' :
                                                    mem.roleCode === 3 ? '이사' :
                                                    mem.roleCode === 4 ? '부장' :
                                                    mem.roleCode === 5 ? '차장' :
                                                    mem.roleCode === 6 ? '과장' :
                                                    mem.roleCode === 7 ? '대리' :
                                                    mem.roleCode === 8 ? '사원' :
                                                    mem.roleCode === 9 ? '인턴' : '미정'
                                                } 
                                            </td>
                                            <td className={styles.theadtd}>
                                                {
                                                    mem.workerStateCode === 0 ? '관리자' :
                                                    mem.workerStateCode === 1 ? '정규직' :
                                                    mem.workerStateCode === 2 ? '비정규직' :
                                                    mem.workerStateCode === 3 ? '계약직' : '미정'
                                                } 
                                            </td>
                                            <td className={styles.theadtd}>
                                                {format(new Date(mem.joinDate), 'yyyy.MM.dd')}
                                            </td>
                                            <td className={styles.theadtd}> 
                                                {mem.empStateCode ===0  ? (
                                                        <button className={styles.statusBtn} onClick={handleModalChange} value={mem.empSeq}> 대기중 </button> 
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

        </div>
        <div className={styles.pagination}>
         {/* 페이지네이션 */}
         {pageCount > 0 && (
            <Pagination
            pageCount={pageCount}
            onPageChange={handlePageChange}
            currentPage={currentPage}
            />
            )}
        </div>

        <Modal isOpen={isModalOpen} onClose={closeModal}>
                <div className={styles.modalForm}>
                    <ModalAdd checkedMems={checkedMems}  isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen}/>
                </div>
        </Modal>
      </div>
    )
}