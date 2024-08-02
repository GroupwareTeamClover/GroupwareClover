import styles from './MemMain.module.css';
import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { Modal } from '../../../../../../../components/Modal/Modal';
import { ModalPosition } from './ModalPosition/ModalPosition';
import {BaseUrl} from '../../../../../../../commons/config';
import { ModalDelete } from './ModalDelete/ModalDelete';
import { useMemStore } from '../../../../../../../store/store';
import {Pagination} from '../../../../../../../components/Pagination/Pagination';



export const MemMain = () => {

    const {storemembers, setstoremembers} = useMemStore();

    const [status, setStatus] = useState({status:''});
    const [members, setMembers] = useState([]);
    const [filtered, setFiltered] = useState(members);
    const [countMem, setCountMem] = useState([{COUNT:0, EMP_STATE_CODE:0}])
    const [checkedMems, setCheckedMems] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);

    //  사원 수 
    const processCountData = (data) => {
        const counts = { prev: 0, normal: 0, rest: 0, stop: 0, out: 0 };
        data.forEach(item => {
            switch(item.EMP_STATE_CODE) {
                case 0:  // 가입대기
                    counts.prev = item['COUNT(*)'];
                    break;
                case 1:     //재직중 (정상1)
                    counts.normal = item['COUNT(*)'];
                    break;
                case 2:     //퇴사
                    counts.out = item['COUNT(*)'];
                    break;
                case 3:     //휴직 (정상2)
                    counts.rest = item['COUNT(*)'];
                    break;
                default:
                    break;
            }
        });

        return counts;
    };
 

    // ======= 출력할거 store로 하면 되나...?
    useEffect(()=>{
        
        axios.get(`${BaseUrl()}/adminmember`).then((resp)=>{
            console.log(resp)
            // setstoremembers(resp.data)
            setMembers(resp.data);
            setFiltered(resp.data)
            setstoremembers(false)
            console.log("filtered.lenth:" +filtered.length)
        })
    },[storemembers])

    useEffect(()=>{
        axios.get(`${BaseUrl()}/adminmember/countmem`).then((resp)=>{
            const processedData = processCountData(resp.data);
            setCountMem(processedData);
            
        })
    },[])

    const checkboxRef = useRef([]);
    //==========================================================================
    // Pagingation
    const PER_PAGE = 10; // 한 페이지에 보여줄 목록 수 
    const pageCount = Math.ceil(filtered.length / PER_PAGE); // (총 갯수 / PER_PAGE) = 페이지 몇 개 나올지 계산  
    console.log(pageCount + " 페이지 수 ")
    const handlePageChange = ({selected}) =>{
        setCurrentPage(selected);
        window.scrollTo(0,320);     // 페이지 변경 시 스크롤 맨 위로 이동시키기. 
    }
    //==========================================================================
    

  
    // ----전체 체크박스 클릭
    // filtered.slice(currentPage * PER_PAGE, (currentPage +1) * PER_PAGE)
    //                            .map((mem,i)=>{
                                    
    const handleCheckAll = (e)=>{
        const checked = e.target.checked;
        // const allValues = members.map(mem => mem.EMP_SEQ);
        const allValues = filtered.slice(currentPage*PER_PAGE, (currentPage+1)*PER_PAGE).map(mem => mem.EMP_SEQ);
        checkboxRef.current.forEach(checkbox => {
            if(checkbox){
                checkbox.checked = checked;
            }
        })
        setCheckedMems(checked ? allValues : [])
 
    }
      // ============= 체크박스 클릭 ==================
    const handleCheckBox =(e)=>{
        const {value, checked} = e.target;
        setCheckedMems(prev=> {
            if(checked){
                return [...prev, value];
            }else{
                return prev.filter(prev => prev != value); 
                
            }
        })
    }
    console.log(members.EMP_STATE_NAME +" EMP_STATE_NAME는?")
   
    console.log("checkedMem: "+checkedMems +" 갯수: " + checkedMems.length)
    


    // ------------- 모달----------------------------------------
    const [ modalState, setModalState ] = useState("");
    const [ isModalOpen, setIsModalOpen ] = useState(false);
    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    // 모달) select 설정시---------------------------------
    const handleSelectChange=(e)=>{
        const {name,value} = e.target;
        setStatus(prev =>({...prev, [name]:value}))
    }
    // 모달) 변경 버튼 클릭시 
    const handleModalChange = (e) => {
        const modalName = e.target.value;
        setModalState(modalName);
        if (modalName !== '' && checkedMems.length !== 0) {
            openModal();
          }
        else if(modalName !=='' && checkedMems.length ==0){alert("변경할 사원을 선택해주세요.")}
        else if(modalName =='' && checkedMems.length !==0){alert("상태변경을 선택해주세요.")}
    }



    const handleSearch =(e)=>{
        const {name,value} = e.target;
        const result = members.filter((data)=>data[name].includes(value))
        setFiltered(result);
    }

    return (
      <div className={styles.container}>
        <div className={styles.member_info}>
            <div className={styles.member_total}>
                사원 수 : {members.length} 명
            </div>
            <div className={styles.member_detail}>
                <h1>{countMem.normal + countMem.rest} 명</h1>
                (정상{countMem.normal}명 / <span className={styles.smallText}> 퇴사 {countMem.out}명</span>) 
                <h3>가입대기 {countMem.prev}명</h3>
            </div>
        </div>
        <div className={styles.funcBtn}>
            <div className={styles.col_button}>
                <button className={styles.delMemBtn } onClick={handleModalChange} name='ModalForm' value='deleteMem'>사원삭제</button>
                <select name='status' onChange={handleSelectChange}>
                    <option value="">상태변경</option>
                    <option value="부서변경">부서변경</option>
                    <option value="직위변경">직위변경</option>
                    <option value="사용자그룹변경">사용자그룹변경</option>
                    <option value="계정상태변경">계정상태변경</option>
                </select>
                <button className={styles.changeBtn} onClick={handleModalChange} name='ModalForm' value={status.status}>변경</button>
            </div>         
        </div>
        <div className={styles.body}>
            <div className={styles.tableWrapper}>
                    <table className={styles.table}>
                        <thead className={styles.thead}>
                            <tr>
                                <td className={styles.theadtd}><input type="checkbox" name='checkedAll' onClick={handleCheckAll}></input></td>
                                <td className={styles.theadtd}>이름</td>
                                <td className={styles.theadtd}>
                                    <select name='DEPT_NAME' onChange={handleSearch}>
                                        <option value="">부서</option>
                                        <option>사무</option> 
                                        <option>인사</option> 
                                        <option>총무</option> 
                                        <option>미정</option> 
                                    </select>
                                </td>
                                <td className={styles.theadtd}>
                                    <select name='ROLE_NAME' onChange={handleSearch}>
                                        <option value="">직위</option>
                                        <option>사장</option> 
                                        <option>대리</option> 
                                        <option>사원</option> 
                                        <option>인턴</option> 
                                        <option>미정</option> 
                                    </select>   
                                </td>
                                <td className={styles.theadtd}>
                                    <select name="WORKER_STATE_NAME" onChange={handleSearch}>
                                        <option value=''>사용자그룹</option>
                                        <option>정규직</option> 
                                        <option>계약직</option> 
                                        <option>관리자</option> 
                                    </select>
                                </td>
                                <td className={styles.theadtd}>이메일</td>
                                <td className={styles.theadtd}>
                                    <select name='EMP_STATE_NAME' onChange={handleSearch}>
                                        <option value="">계정상태</option>
                                        <option>정상</option>
                                        <option>휴면</option>
                                        <option>퇴사</option>
                                        <option>가입대기</option>
                                    </select>
                                </td>
                            </tr>
                        </thead>
                        <tbody className={styles.tbody}>
                            {/* 페이지네이션  데이터 영역 */}
                            { filtered.slice(currentPage * PER_PAGE, (currentPage +1) * PER_PAGE).map((mem,i)=>{
                                return(
                                    <tr key={i}>
                                        <td className={styles.theadtd}>
                                            {mem.EMP_STATE_NAME === '가입대기' ? (
                                                <input type="checkbox" disabled></input>
                                            ) : (
                                                <input type="checkbox" name="emp_seq" value={mem.EMP_SEQ} onClick={handleCheckBox} ref={data=> checkboxRef.current[i]=data}></input>
                                                )
                                            }
                                        </td>
                                        <td className={styles.theadtd}>
                                            {mem.EMP_NAME}
                                        </td>
                                        <td className={styles.theadtd}>
                                            {mem.DEPT_NAME}
                                        </td>
                                        <td className={styles.theadtd}>
                                            {mem.ROLE_NAME}
                                        </td>
                                        <td className={styles.theadtd}>
                                            {mem.WORKER_STATE_NAME}
                                        </td>
                                        <td className={styles.theadtd}>
                                            {mem.EMP_EMAIL}
                                        </td>
                                        <td className={styles.theadtd}>
                                            {mem.EMP_STATE_NAME}
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
                { modalState === status.status &&
                    <ModalPosition modalState={modalState} checkedMems={checkedMems}  isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen}/>
                }
                { modalState === 'deleteMem' &&
                    <ModalDelete checkedMems={checkedMems} setIsModalOpen={setIsModalOpen}/>
                }
            </div>
        </Modal>
        
      </div>
    );
  }