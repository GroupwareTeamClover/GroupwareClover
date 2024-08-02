import styles from './Business.module.css'
import { BsChevronDoubleLeft } from 'react-icons/bs';

export const Business =({type, docinfo, empinfo})=>{
    
    return(
        <div className={styles.container}>
            <div className={styles.header}>
                <span><h2>{type}</h2></span>
            </div>
            <div className={styles.bigcontent}>
                {/* 내용 첫번째 줄 */}
                <div className={styles.info}> 
                    <div className={styles.docInfo}>
                        <div className={styles.tablebox}>
                            <div className={styles.row1}>
                            <div className={styles.row1col1}>기안자</div>
                            <div className={styles.row1col2}>값</div>
                            </div>
                            <div className={styles.row2}>
                            <div className={styles.row2col1}>소속</div>
                            <div className={styles.row2col2}>값</div>
                            </div>
                            <div className={styles.row3}>
                            <div className={styles.row3col1}>기안일</div>
                            <div className={styles.row3col2}>값</div>
                            </div>
                            <div className={styles.row4}>
                            <div className={styles.row4col1}>문서번호</div>
                            <div className={styles.row4col2}>값</div>
                            </div>
                        </div>
                    </div>
                    <div className={styles.apvlineInfo}></div>
                </div>
                {/* 내용 두번째 줄 */}
                <div className={styles.content}></div>
            </div>
        </div>
    )
}


{/* docinfo내용
    <div className={styles.row1}>
<div className={styles.row1col1}>기안자</div>
<div className={styles.row1col2}>값</div>
</div>
<div className={styles.row2}>
<div className={styles.row2col1}>소속</div>
<div className={styles.row2col2}>값</div>
</div>
<div className={styles.row3}>
<div className={styles.row3col1}>기안일</div>
<div className={styles.row3col2}>값</div>
</div>
<div className={styles.row4}>
<div className={styles.row4col1}>문서번호</div>
<div className={styles.row4col2}>값</div>
</div> */}