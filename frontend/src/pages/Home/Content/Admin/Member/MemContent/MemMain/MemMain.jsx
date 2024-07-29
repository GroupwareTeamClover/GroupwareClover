import { useLocation, useNavigate } from 'react-router-dom';
import styles from './MemMain.module.css';
import { useState } from 'react';
import axios from 'axios';





export const MemMain = () => {

    const navi = useNavigate();

    const [status, setStatus] = useState('');
    const [member, setMember] = useState();
    const [members, setMembers] = useState([]);
    // useEffect(()=>{
    //     axios.get(`{baseUrl}/`)
    // })
    
    const handleModal=()=>{

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
                    <button onClick={()=>{navi("/member/addmem")}}>사원추가</button>
                    <button>사원삭제</button>
                    <select name='ch_status' onClick={handleModal}>
                        <option value="none">상태변경</option>
                        <option value="role">직위변경</option>
                        <option value="worker_state">사용자그룹변경</option>
                        <option value="state">계정상태변경</option>
                    </select>
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
                                <td className={styles.theadtd}><input type="checkbox"></input></td>
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
                            <tr>
                                <td className={styles.theadtd}><input type="checkbox"></input></td>
                                <td className={styles.theadtd}>정뚜리</td>
                                <td className={styles.theadtd}>
                                    인사팀
                                </td>
                                <td className={styles.theadtd}>
                                    대리
                                </td>
                                <td className={styles.theadtd}>
                                    관리자
                                </td>
                                <td className={styles.theadtd}>jeesu31@naver.com</td>
                                <td className={styles.theadtd}>
                                    정상
                                </td>
                            </tr>
                            {/* {
                                newMem.map((mem, i)=>{
                                    return(
                                        <tr key={i}>
                                            <td>{mem.name} </td>
                                            <td>{mem.dept} </td>
                                            <td>{mem.position} </td>
                                            <td>{mem.group} </td>
                                            <td>{mem.joindate} </td>
                                            <td>{mem.status} </td>
                                        </tr>
                                    )
                                })
                            } */}
                        </tbody>
                    </table>
                </div>              
            {/* ---------------------------------------------------------- */}
           
            <div className={styles.pagination}>
                1 2 3 4 5
            </div>
        </div>
      </div>
    );
  }