import { useNavigate } from "react-router-dom";
import styles from './AddMember.module.css';
import { useEffect, useState } from "react";
import axios from 'axios';



export const AddMember = ()=>{

    const navi = useNavigate();

    const [newMem, setNewMem] = useState([]);
    // axios로 출력받기 emp table - state가 0인 상태인 것. 
    useEffect(()=>{
        // axios.get(`{baseUrl}/member`).then((resp)=>{
        //     setNewMem(resp.data);
        // })
    },[])
    
    return(
        <div className={styles.container}>
            <div className={styles.member_info}>
                <div className={styles.member_total}>
                    승인대기중  : "N" 명
                </div>
            </div>
        
            <div className={styles.body}>
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
                                            <td>{mem.name} </td>
                                            <td>{mem.dept} </td>
                                            <td>{mem.position} </td>
                                            <td>{mem.group} </td>
                                            <td>{mem.joindate} </td>
                                            <td>{mem.status} </td>
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
      </div>
    )
}