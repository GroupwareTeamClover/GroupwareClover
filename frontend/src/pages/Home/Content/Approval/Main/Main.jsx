import styles from './Main.module.css'

export const Main= () =>{
    return(
        <div className={styles.container}>
            <div className={styles.header}></div>
            <div className={styles.cardBox}>
                <div className={styles.card}> 
                    <div className={styles.stateBox}>
                        <span className={styles.state}>진행중</span>
                    </div>

                    <div className={styles.titleBox}>
                        <span className={styles.title}>제목이당</span>
                    </div>

                    <div className={styles.drafterBox}>
                        <span className={styles.text}>기안자: 박새미</span>
                    </div>

                    <div className={styles.drafterDateBox}>
                        <span className={styles.text}>기안일: 2024-07-26</span>
                    </div>

                    <div className={styles.approvalBox}>
                        <div className={styles.approvalDiv}>결재하기</div>
                    </div>
                </div>
            </div>
            <div className={styles.ingBox}></div>
            <div className={styles.completeBox}></div>
        </div>
    )

}