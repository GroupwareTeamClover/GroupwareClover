import styles from './Approval.module.css'
import {Side} from './Side/Side'
import {Main} from './Main/Main'

export const Approval = () =>{
    return(
        <div className={styles.container}>
              <div className={styles.side}>
                <Side/>
              </div>
            <div className={styles.main}>
                <Main></Main>
            </div>
        </div>
    );
} 