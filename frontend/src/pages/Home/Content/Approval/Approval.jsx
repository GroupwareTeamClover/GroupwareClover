import styles from './Approval.module.css'
import {Side} from './Side/Side'
import {Main} from './Main/Main'
import { Route, Routes, useLocation } from "react-router-dom";
import { WriteForm } from './WriteForm/WriteForm';


export const Approval = () =>{
    return(
        <div className={styles.container}>
              <div className={styles.side}>
                <Side/>
              </div>
            <div className={styles.main}>
                <Routes>
                    <Route path="/*" element={<Main/>}></Route>
                    <Route path="/write/:formType" element={<WriteForm />} />
                </Routes>
            </div>
        </div>
    );
} 