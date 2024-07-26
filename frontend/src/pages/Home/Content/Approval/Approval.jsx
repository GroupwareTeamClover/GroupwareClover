import styles from './Approval.module.css'

export const Approval = () =>{
    return(
        <div className={styles.container}>
            <div className={styles.side}>
                <div className={styles.sidebox}>
                    <div className={styles.sidetext}>전자결재</div>
                    <div className={styles.newapp}>    
                        <button className={styles.newappbtn}>새 결재 진행</button>
                    </div>
                    <div className={styles.proceeding}>
                        <div className={styles.proceedingBox}>
                            <div>진행중 문서</div>
                            <div>기안 진행</div>
                            <div>결재 대기</div>
                            <div>결재 예정</div>
                            <div>결재 수신</div>
                            <div>참조/열람 대기</div>
                        </div>
                    </div>
                    <div className={styles.document}>
                        <div className={styles.documentBox}>
                            <div>문서함</div>
                            <div>기안 문서함</div>
                            <div>임시 문서함</div>
                            <div>결재 문서함</div>
                            <div>수신 문서함</div>
                            <div>참조/열람 문서함</div>
                        </div>
                    </div>
                </div>
            </div>
            <div className={styles.home}></div>
        </div>
    );
} 