import styles from './Approval.module.css'
import {Side} from './Side/Side';
import {Home} from './Home/Home';

//현재 url approval/*

export const Approval = () =>{
    return(
        <div className={styles.container}>
              <div className={styles.side}>
                <Side/>
              </div>
            <div className={styles.home}>
                <Home/>
            </div>
        </div>
    );
} 