import { useNavigate } from "react-router-dom";
import styles from './AddMember.module.css';


export const AddMember = ()=>{

    const navi = useNavigate();


    return(
        <div className={styles.container}>
        <div className={styles.header}>
            조직관리 승인 
        </div>
        <div>
            <div className={styles.member_info}>
                <div className={styles.member_total}>
                    승인대기중  : "N" 명
                </div>
               
            </div>
        </div>
        <div className={styles.body}>
            <div className={styles.row_header}>
              <div className={styles.checkbox}><input type="checkbox"></input></div>
              <div className={styles.name}>이름</div>
              <div className={styles.dept}>
                <select>
                    <option>인사팀</option> 
                    <option>회계팀</option> 
                    <option>영업팀</option> 
                </select>
               </div>
                <div>
                    <select>
                        <option>사장</option> 
                        <option>대리</option> 
                        <option>사원</option> 
                    </select>
                </div>
                <div>
                    <select>
                        <option>정규직</option> 
                        <option>계약직</option> 
                        <option>관리자</option> 
                    </select>
                </div> 
                <div>
                    가입날짜
                </div>  
                <div>
                    상태
                </div>
            </div>
            <div className={styles.row_body}>

            </div>
            <div className={styles.pagination}>

            </div>
        </div>
      </div>
    )
}