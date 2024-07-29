import { useLocation, useNavigate } from 'react-router-dom';
import styles from './MemMain.module.css';
import { useRef, useState } from 'react';
import axios from 'axios';
import { Modal } from '../../../../../../../components/Modal/Modal';
import { ModalPosition } from '../ModalPosition/ModalPosition';
import { ModalGroup } from '../ModalGroup/ModalGroup';





export const MemMain = () => {

    const navi = useNavigate();

    const [status, setStatus] = useState({status:''});
    const [member, setMember] = useState();
    const [members, setMembers] = useState([
        {seq:1, name:'김일일', dept:'인사팀',position:'대리', group:'정규직',email:'jeesu@naver.com',status:'정상'},
        {seq:2, name:'정일일', dept:'영업팀',position:'과장', group:'정규직',email:'abc@naver.com',status:'정상'},
        {seq:3, name:'최일일', dept:'영업팀',position:'대리', group:'계약직',email:'abc1@naver.com',status:'중지'}
    ]);
    // useEffect(()=>{
    //     axios.get(`{baseUrl}/`)
    // })

    // ----전체 체크박스 클릭
    const checkboxRef = useRef([]);
    const handleCheckAll = (e)=>{
        const checked = e.target.checked;
        checkboxRef.current.forEach(checkbox => {
            if(checkbox){
                checkbox.checked = checked;
            }
        })
    }

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
        openModal();
    }

    // axios로 출력받기 emp table - state가 0인 상태인 것. 
    const handleGetNew = ()=>{
        axios.get(`{baseUrl}/member`).them((resp)=>{
            setMembers(resp.data);
        })
    }
    return (
      <div className={styles.container}>
         
        <div className={styles.member_info}>
                <div className={styles.member_total}>
                    사원 수 : "멤버 N" 명
                </div>
                <div className={styles.member_detail}>
                    정상("멤버 M"명 / 휴면 "M-m"명) 중지 "N-M"명
                </div>
        </div>
        <div className={styles.funcBtn}>
            <div className={styles.col_button}>
                    <button>사원삭제</button>
                    <select name='status' onChange={handleSelectChange}>
                        <option value="none">상태변경</option>
                        <option value="position">직위변경</option>
                        <option value="group">사용자그룹변경</option>
                        <option value="status">계정상태변경</option>
                    </select>
                    <button onClick={handleModalChange} name='ModalForm' value={status.status}>변경</button>
                </div>
                <div className={styles.col_search}>

            </div>
        </div>
        <div className={styles.body}>
            {/* ---------------------------------------------------------- */}
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
                                <td className={styles.theadtd}>이메일</td>
                                <td className={styles.theadtd}>
                                    <select>
                                        <option value="none">계정상태</option>
                                        <option>정상</option>
                                        <option>휴면</option>
                                        <option>중지</option>
                                    </select>
                                </td>
                            </tr>
                        </thead>
                        <tbody className={styles.tbody}>
                            {/* 데이터영역 */}
                            {
                                members.map((mem, i)=>{
                                    return(
                                        <tr key={mem.seq}>
                                            <td className={styles.theadtd}><input type="checkbox" ref={data=> checkboxRef.current[i]=data}></input></td>
                                            <td className={styles.theadtd}>{mem.name}</td>
                                            <td className={styles.theadtd}>
                                                {mem.dept}
                                            </td>
                                            <td className={styles.theadtd}>
                                                {mem.position}
                                            </td>
                                            <td className={styles.theadtd}>
                                                {mem.group}
                                            </td>
                                            <td className={styles.theadtd}>
                                                {mem.email}
                                            </td>
                                            <td className={styles.theadtd}>
                                                {mem.status}
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
                    {modalState === 'position' &&
                        <>
                        <ModalPosition/>
                        </>
                    }
                    {modalState === 'group' &&
                        <>
                        <ModalGroup/>
                        </>
                    }
                    
                </div>
        </Modal>
        
      </div>
    );
  }