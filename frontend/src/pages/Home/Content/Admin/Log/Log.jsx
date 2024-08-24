import {useLocation, useNavigate } from "react-router-dom";
import { Loglist } from "./LogList/Logilist";
import styles from './Log.module.css';
import {Route, Routes} from "react-router-dom";
import { useMemberStore } from "../../../../../store/store";


export const Log = () => {

    const location = useLocation();
    const state = location.state;
    const {admin} = useMemberStore();
    // 상태에 따라 header 내용 설정
    const headerText = state?.type || '접속 로그 관리';

  
      const navi = useNavigate();
  
      return (
        <div className={styles.container}>
          <div className={styles.header}><h3 className={styles.headerText}>{headerText}</h3></div>
          {!admin ? <div>관리자 전용임</div> :
          <div className={styles.detail}>
            <Routes>
              <Route path="/" element={ <Loglist/> } />
            </Routes>
          </div>
          }
        </div>
      );
    }