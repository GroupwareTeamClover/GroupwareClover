import styles from './Main.module.css'
import { Card } from './Card/Card'

export const Main=()=>{
    return(
        <div className={styles.container}>
            <div className={styles.header}><h3>전자결재</h3></div>
            <div className={styles.cardWrapper}>
                <div className={styles.cardBox}>
                    <Card/>
                    <Card/>
                    <Card/>
                    <Card/>
                    <Card/>
                </div>
                <div className={styles.cardLine}></div>
            </div>
            <div className={styles.ingBox}>
                <div className={styles.listheader}><h4 className={styles.headerText}>기안 진행 문서</h4></div>
                <div className={styles.tableWrapper}>
                    <table className={styles.table}>
                        <thead className={styles.thead}>
                            <tr>
                                <td className={styles.theadtd}>기안일</td>
                                <td className={styles.theadtd}>결재양식</td>
                                <td className={styles.theadtd}>긴급</td>
                                <td className={styles.theadtd}>제목</td>
                                <td className={styles.theadtd}>첨부</td>
                                <td className={styles.theadtd}>결재상태</td>
                            </tr>
                        </thead>
                        <tbody className={styles.tbody}>
                            {/* 데이터영역 */}
                        </tbody>
                    </table>
                </div>                
            </div>
        </div>
    )
}