import { useState } from 'react';
import styles from './ModalPosition.module.css';


export const ModalPosition = ({modalState})=>{
    
    const [members, setMembers]= useState(2);

    const handleChangeStatus =(e)=>{
        const {name,value} = e.target;
    }
    return(
        <div class={styles.container}>
            <div className={styles.title}>
                멤버 정보 수정
            </div>
            <div className={styles.subtitle}>
                    선택된 사원 {members}명에 대해서, 
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
                            <option>인사팀</option> 
                            <option>회계팀</option> 
                            <option>영업팀</option> 
                        </select>
                        </>
                    }
                    {modalState === "직위변경" &&
                        <>
                        <select name={modalState} onChange={handleChangeStatus}>
                            <option value="">직위</option>
                            <option>사장</option> 
                            <option>과장</option> 
                            <option>대리</option> 
                            <option>사원</option> 
                        </select>
                        </>
                    }
                    {modalState === "사용자그룹변경" &&
                        <>
                        <select name={modalState} onChange={handleChangeStatus}>
                            <option value="">사용자그룹</option>
                            <option>정규직</option> 
                            <option>계약직</option> 
                            <option>관리자</option> 
                        </select>
                        </>
                    }
                    {modalState === "계정상태변경" &&
                        <>
                        <select name={modalState} onChange={handleChangeStatus}>
                            <option value="">계정상태</option>
                            <option>정상</option> 
                            <option>휴면</option> 
                            <option>중지</option> 
                        </select>
                        </>
                    }
                  
                </div>
            </div>
            <div className={styles.btnstyle}>
                <button className={styles.save}>저장</button>
                <button className={styles.cancel}>취소</button>
            </div>
        </div>

    )
}