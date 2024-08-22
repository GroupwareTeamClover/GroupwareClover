import styles from './Approval.module.css'
import {Side} from './Side/Side';
import {Home} from './Home/Home';
import { Routes, Route, useLocation  } from "react-router-dom";

//현재 url approval/*

export const Approval = () =>{
    return(
        <div className={styles.container}>
              <div className={styles.side}>
                <Side/>
              </div>
            <div className={styles.home}>
                <Routes>
                    <Route path="/*" element={<Home/>}/>
                </Routes>
            </div>
        </div>
    );
} 