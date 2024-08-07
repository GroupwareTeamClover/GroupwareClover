
import { useLocation, useNavigate } from 'react-router-dom';
import styles from './Member.module.css';
import { MemMain } from './MemContent/MemMain/MemMain';
import {Route, Routes} from "react-router-dom";
import { AddMember } from './MemContent/AddMem/AddMember';
import { Address } from '../../Address/Address';


export const Member = () => {

  const location = useLocation();
  const state = location.state;
  console.log("headerTxt"+ state?.type)

  // 상태에 따라 header 내용 설정
  const headerText = state?.type || '전자결재';


    const navi = useNavigate();

    return (
      <div className={styles.container}>
        <div className={styles.header}><h3 className={styles.headerText}>{headerText}</h3></div>
        <div className={styles.detail}>
          <Routes>
            <Route path="/" element={ <MemMain /> } />
            <Route path="/addmem" element={<AddMember/>}/>
            <Route path="/address" element={<Address/>}/>
          </Routes>
        </div>
      </div>
    );
  }