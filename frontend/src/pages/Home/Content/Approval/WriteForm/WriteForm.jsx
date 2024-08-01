import { Route, Routes, useLocation } from "react-router-dom";
import styles from './WriteForm.module.css';
import {Proceeding} from '../Proceeding/Proceeding'
import {DetailMain} from '../DetailMain/DetailMain'


export const WriteForm = () => {
    const location = useLocation();
    const state = location.state;
    console.log(state.type);
    console.log(state.data);

    // 양식에 따라 header 내용 설정
    const headerText = state?.type || '양식명';

    return (
        <div className={styles.container}>
            <div className={styles.header}><h3 className={styles.headerText}>{headerText}</h3></div>
            <div className={styles.detail}>
                <Routes>
                    {/* 업무 기안 폼 */}
                    <Route path="/business"/>
                    {/* 휴가 신청서 폼 */}
                    <Route path="/dayoff"/>
                </Routes>
            </div>
        </div>
    );
};
