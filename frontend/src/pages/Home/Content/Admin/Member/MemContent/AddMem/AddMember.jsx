import { useNavigate } from "react-router-dom";
import styles from './AddMember.module.css';
import { useEffect, useRef, useState } from "react";
import axios from 'axios';



export const AddMember = ()=>{

    const navi = useNavigate();

    const [newMem, setNewMem] = useState([
        {seq:1, name:'김추가', dept:'인사팀',position:'대리', group:'정규직',joindate:'2024.07.11', status:'대기중'},
        {seq:2, name:'정추가', dept:'영업팀',position:'과장', group:'정규직',joindate:'2024.07.01', status:'승인완료'},
        {seq:3, name:'최추가', dept:'영업팀',position:'대리', group:'계약직',joindate:'2024.07.28', status:'대기중'}
    ]);
    const [newMemCount, setNewMemCount] = useState(3);

    // axios로 출력받기 emp table - joindate가 이번달인 사람들....  
    useEffect(()=>{
        // axios.get(`{baseUrl}/member`).then((resp)=>{
            //     setNewMem(resp.data);
            // })

        // axios.get(`{baseUrl}/member`).then((resp)=>{
            // setNewMemCount(resp.data);  // 승인대기중 사원 수 select count(state) from emp where state=0;
            // })
    },[])


    // axios 수정update하기  emp table - state가 0인 상태인 것 -> 1로 업데이트
    const handleAddMem =(e)=>{
        // 모달창 뜨게...
    }
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
    
    return(
        <div className={styles.container}>
            <div className={styles.member_info}>
                {/* emp table에서 state가 0인 사람 갯수. select count(state) from emp where state=0; */}
                    승인대기중  : {newMemCount} 명
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
                                        <tr key={mem.seq}>
                                            <td className={styles.theadtd}>
                                                {mem.status ==='대기중' ? (
                                                    <input type="checkbox" ref={data=> checkboxRef.current[i]=data}></input>
                                                ) : (
                                                    <input type="checkbox" disabled checked ></input>
                                                    )
                                                }
                                            </td>
                                            <td className={styles.theadtd}>{mem.name} </td>
                                            <td className={styles.theadtd}>{mem.dept} </td>
                                            <td className={styles.theadtd}>{mem.position} </td>
                                            <td className={styles.theadtd}>{mem.group} </td>
                                            <td className={styles.theadtd}>{mem.joindate} </td>
                                            <td className={styles.theadtd}> 
                                                {mem.status ==='대기중' ? (
                                                        <button className={styles.statusBtn} onClick={handleAddMem}>{mem.status} </button> 
                                                    ) : (
                                                        <button className={styles.statusBtn2}>{mem.status} </button> 
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
      </div>
    )
}