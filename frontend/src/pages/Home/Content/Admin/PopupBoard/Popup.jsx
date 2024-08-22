
import { useLocation, useNavigate } from 'react-router-dom';
import styles from './Popup.module.css';
import {Route, Routes} from "react-router-dom";
import { PopupList } from './PopupContent/PopupList/PopupList';
import { PopupWrite } from './PopupContent/PopupWrite/PopupWrite';
import { PopupDetail } from './PopupContent/PopupDetail/PopupDetail';
import { useMemberStore } from '../../../../../store/store';

export const Popup = () => {

  const location = useLocation();
  const state = location.state;
  console.log("headerTxt"+ state?.type)
  const {admin} = useMemberStore();

  // 상태에 따라 header 내용 설정
  const headerText = state?.type || '팝업공지글 목록';


    const navi = useNavigate();

    return (
      <div className={styles.container}>
        <div className={styles.header}><h3 className={styles.headerText}>{headerText}</h3></div>
        {!admin ? <div>관리자 전용임</div> :
        <div className={styles.detail}>
          <Routes>
            <Route path="/" element={ <PopupList /> } />
            <Route path="/write" element={<PopupWrite/>}/>
            <Route path="/detail/:popSeq" element={<PopupDetail/>}/>
          </Routes>
        </div>
        }
      </div>
    );
  }