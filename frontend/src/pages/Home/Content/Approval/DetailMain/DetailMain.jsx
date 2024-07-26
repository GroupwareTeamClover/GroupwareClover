import styles from './DetailMain.module.css'
import { Card } from '../Card/Card'

export const DetailMain=()=>{
    return(
        <div className={styles.container}>
            <div className={styles.cardBox}>
                <Card/>
            </div>
            <div className={styles.ingBox}></div>
            <div className={styles.completeBox}></div>
        </div>
    )
}