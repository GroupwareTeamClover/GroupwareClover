import styles from './Card.module.css'

export const Card= () =>{
    return(
        <div className={styles.container}>
             <div className={styles.card}> 
                    <div className={styles.stateBox}>
                        <span className={styles.state}>진행중</span>
                    </div>

                    <div className={styles.titleBox}>
                        <span className={styles.title}>휴가신청서</span>
                    </div>

                    <div className={styles.drafterBox}>
                        <span className={styles.drafter}>{`기안자: 박새미`}</span>
                    </div>

                    <div className={styles.drafterDateBox}>
                        <span className={styles.drafterDate}>{`기안일: 2024-07-26`}</span>
                    </div>

                    <div className={styles.approvalBox}>
                        <div className={styles.approvalBtn}>결재하기</div>
                    </div>
                </div>
        </div>
    );
}