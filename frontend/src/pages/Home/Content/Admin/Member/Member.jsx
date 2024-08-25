
import { useLocation, useNavigate } from 'react-router-dom';
import styles from './Member.module.css';
import { MemMain } from './MemContent/MemMain/MemMain';
import {Route, Routes} from "react-router-dom";
import { AddMember } from './MemContent/AddMem/AddMember';
import { Address } from '../../Address/Address';
import {AttendMem} from '../Member/MemContent/AttendMem/AttendMem';
import { useMemberStore } from '../../../../../store/store';


export const Member = () => {

  const location = useLocation();
  const state = location.state;
  const {admin} = useMemberStore();

  // 상태에 따라 header 내용 설정
  const headerText = state?.type || '통합사원목록';


    const navi = useNavigate();

    return (
      <div className={styles.container}>
        <div className={styles.header}><h3 className={styles.headerText}>{headerText}</h3></div>
        {!admin ? <div>관리자 전용임</div> :
        <div className={styles.detail}>
          <Routes>
            <Route path="/*" element={ <MemMain /> } />
            <Route path="/addmem/*" element={<AddMember/>}/>
            <Route path="/attend/*" element={<AttendMem/>}/>

          </Routes>
        </div>
        }
      </div>
    );
  }