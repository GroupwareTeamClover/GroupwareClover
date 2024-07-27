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
            <div className={styles.header}><h3>{headerText}</h3></div>
            <div className={styles.detail}>
                <Routes>
                    <Route path="/" element={<DetailMain/>} />
                    <Route path="/approval/proceeding" element={<Proceeding />} />
                    <Route path="/approval/waiting"/>
                    <Route path="/approval/planning" />
                    <Route path="/approval/receiving" />
                    <Route path="/approval/participating" />
                    <Route path="/approval/drafting" />
                    <Route path="/approval/temp" />
                    <Route path="/approval/complete" />
                    <Route path="/approval/received" />
                    <Route path="/approval/participated" />
                </Routes>
            </div>
        </div>
    );
};
