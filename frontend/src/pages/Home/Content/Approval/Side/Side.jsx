import styles from './Side.module.css'

export const Side= () =>{
    return(
      
        <div className={styles.sideBox}>
            <div className={styles.textBox}>전자결재</div>
            <div className={styles.btnBox}>
                <button className={styles.addBtn}>새 결재 진행하기</button>
            </div>
            <div className={styles.proceedingBox}>
                <div className={styles.boxtext}>진행중 문서</div>
                <div className={styles.menutext}>
                    <div className={styles.menu}>기안진행</div>
                    <div className={styles.menu}>결재대기</div>
                    <div className={styles.menu}>결재예정</div>
                    <div className={styles.menu}>결재수신</div>
                    <div className={styles.menu}>참조/열람 대기</div>
                </div>
            </div>
            <div className={styles.docBox}>
                <div className={styles.boxtext}>문서함</div>
                <div className={styles.menutext}>
                    <div className={styles.menu}>기안문서함</div>
                    <div className={styles.menu}>임시문서함</div>
                    <div className={styles.menu}>결재문서함</div>
                    <div className={styles.menu}>수신문서함</div>
                    <div className={styles.menu}>참조/열람 문서함</div>
                </div>
            </div>
         
        </div>

    )
}


{/* <div className={styles.sidetext}>전자결재</div>
<div className={styles.newapp}>    
    <button className={styles.newappbtn}>새 결재 진행</button>
</div>
<div className={styles.proceeding}>
    <div className={styles.proceedingBox}>
        <div className={styles.boxtext}>진행중 문서</div>
        <div className={styles.menutext}>
            <div>기안 진행</div>
            <div>결재 대기</div>
            <div>결재 예정</div>
            <div>결재 수신</div>
            <div>참조/열람 대기</div>
        </div>
    </div>
</div>
<div className={styles.document}>
    <div className={styles.documentBox}>
        <div className={styles.boxtext}>문서함</div>
        <div className={styles.menutext}>
            <div>기안 문서함</div>
            <div>임시 문서함</div>
            <div>결재 문서함</div>
            <div>수신 문서함</div>
            <div>참조/열람 문서함</div>
        </div>
    </div>
</div> */}