import { useLocation, useNavigate } from 'react-router-dom';
import styles from './MemMain.module.css';
import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { Modal } from '../../../../../../../components/Modal/Modal';
import { ModalPosition } from './ModalPosition/ModalPosition';
import { ModalGroup } from '../ModalGroup/ModalGroup';
import {BaseUrl} from '../../../../../../../commons/config';
import { ModalDelete } from './ModalDelete/ModalDelete';




export const MemMain = () => {

    const navi = useNavigate();

    const [status, setStatus] = useState({status:''});
    const [members, setMembers] = useState([
        {EMP_SEQ:'', EMP_NAME:'', DEPT_NAME:'', ROLE_NAME:''}
    ]);
    const [filtered, setFiltered] = useState(members);
    const [countMem, setCountMem] = useState([])
    // const [countMem, setCountMem] = useState({total:0, normal:0, rest:0, stop:0 })


    useEffect(()=>{
        axios.get(`${BaseUrl()}/adminmember`).then((resp)=>{
            console.log(resp)
            setMembers(resp.data);
            setFiltered(resp.data)
        })

        axios.get(`${BaseUrl()}/adminmember/countmem`).then((resp)=>{
            setCountMem(resp.data);
            console.log(resp.data);
            console.log("test"+resp.data.EMP_STATE_CODE);
        })
    },[])

    // ============= 체크박스 클릭 ==================
    // ----전체 체크박스 클릭
    const checkboxRef = useRef([]);

    const handleCheckAll = (e)=>{
        const checked = e.target.checked;
        const allValues = members.map(mem => mem.EMP_SEQ);

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
    // console.log("checkedMem: "+checkedMems)
    // const checkedCount = checkedMems.length;
    // console.log("몇개"+checkedCount)

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
        if (modalName !== '') {
            openModal();
          }
          else{alert("상태변경을 선택해주세요.")}
    }

    const handleSearch =(e)=>{
        const {name,value} = e.target;
        const keyword = e.target.value;
        console.log(keyword, name);
        const result = members.filter((data)=>data[name].includes(value))
        console.log(result);
        setFiltered(result);
    }


    return (
      <div className={styles.container}>
         
        <div className={styles.member_info}>
          
                <div className={styles.member_total}>
                    사원 수 : {countMem.total} 명
                </div>
                <div className={styles.member_detail}>
                    {/* 정상({countMem}명 / <span className={styles.smallText}>휴면 {countMem.rest}명</span>) 중지 {countMem.stop}명 */}
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
            {/* ---------------------------------------------------------- */}
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
                            {/* 데이터영역 */}
                            {
                                filtered.map((mem, i)=>{
                                    return(
                                        <tr key={i}>
                                            <td className={styles.theadtd}><input type="checkbox" name="emp_seq" value={mem.EMP_SEQ} onClick={handleCheckBox} ref={data=> checkboxRef.current[i]=data}></input></td>
                                            <td className={styles.theadtd}>{mem.EMP_NAME}</td>
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
            {/* ---------------------------------------------------------- */}
           
            <div className={styles.pagination}>
                1 2 3 4 5
            </div>
        </div>

        <Modal isOpen={isModalOpen} onClose={closeModal}>
                <div className={styles.modalForm}>
                    { modalState === status.status &&
                        <ModalPosition modalState={modalState} checkedMems={checkedMems} isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen}/>
                    }
                    { modalState === 'deleteMem' &&
                        <ModalDelete checkedMems={checkedMems} setIsModalOpen={setIsModalOpen}/>
                    }
                </div>
        </Modal>
        
      </div>
    );
  }