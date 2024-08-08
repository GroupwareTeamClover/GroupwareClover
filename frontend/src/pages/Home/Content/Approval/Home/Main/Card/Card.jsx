import styles from './Card.module.css'
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';

export const Card= ({stateName, title, drafterName, writeDate, egcYn, seq, detailName}) =>{
    const navi = useNavigate();
    // 날짜 변환 함수
    const formatDate = (date) => {
        if (!date) return '-';
        return format(new Date(date), 'yyyy-MM-dd');
    };

    const handleDetail=()=>{
        navi(`/approval/document/${seq}?type=${detailName}`);
    }
    
    return(
        <div className={styles.container}>
             <div className={styles.card}> 
                    <div className={styles.stateBox}>
                        <span className={styles.state}>{stateName}</span>
                    </div>

                    <div className={styles.titleBox}>
                        <span className={styles.title}>{title}</span>
                    </div>

                    <div className={styles.drafterBox}>
                        <span className={styles.drafter}>{`기안자: ${drafterName}`}</span>
                    </div>

                    <div className={styles.drafterDateBox}>
                        <span className={styles.drafterDate}>{`기안일: ${formatDate(writeDate)}`}</span>
                    </div>

                    <div className={styles.approvalBox}>
                        <div className={styles.approvalBtn} onClick={handleDetail}>결재하기</div>
                    </div>
                </div>
        </div>
    );
}