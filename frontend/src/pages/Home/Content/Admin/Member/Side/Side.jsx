import styles from './Side.module.css'

export const Side= () =>{
    return(
      <div className={styles.container}>
        <div className={styles.sideBox}>
            {/* <div className={styles.textBox}>조직관리</div> */}
            {/* <div className={styles.btnBox}>
                <button className={styles.addBtn}>새 결재 진행하기</button>
            </div> */}
            <div className={styles.proceedingBox}>
                <div className={styles.boxtext}>사원 관리</div>
                <div className={styles.menutext}>
                    <div className={styles.menu}>통합 사원 목록</div>
                    <div className={styles.menu}>가입 승인 목록</div>
                    <div className={styles.menu}>삭제 사원 목록</div>
                </div>
            </div>
           
         
        </div>
        </div>
    )
}


