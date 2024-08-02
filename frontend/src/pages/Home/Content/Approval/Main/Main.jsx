import { Route, Routes, useLocation } from "react-router-dom";
import styles from './Main.module.css';
import {Proceeding} from '../Proceeding/Proceeding'
import {DetailMain} from '../DetailMain/DetailMain'


export const Main = () => {
    const location = useLocation();
    const state = location.state;

    // 상태에 따라 header 내용 설정
    const headerText = state?.type || '전자결재';

    return (
        <div className={styles.container}>
            <div className={styles.header}><h3 className={styles.headerText}>{headerText}</h3></div>
            <div className={styles.detail}>
                <Routes>
                    <Route path="/" element={<DetailMain/>} />
                    <Route path="/proceeding" element={<Proceeding />} />
                    <Route path="/waiting"/>
                    <Route path="/planning"/>
                    <Route path="/receiving" />
                    <Route path="/participating" />
                    <Route path="/drafting" />
                    <Route path="/temp" />
                    <Route path="/complete" />
                    <Route path="/received" />
                    <Route path="/participated" />
                </Routes>
            </div>
        </div>
    );
};
