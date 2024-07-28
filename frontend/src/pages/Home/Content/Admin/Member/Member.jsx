
import { useNavigate } from 'react-router-dom';
import styles from './Member.module.css';
import { MemMain } from './MemContent/MemMain/MemMain';
import {Route, Routes} from "react-router-dom";
import { AddMember } from './MemContent/AddMem/AddMember';
import { Side } from './Side/Side';



export const Member = () => {

    const navi = useNavigate();

    return (
      <div className={styles.container}>
       
        
         <Routes>
          <Route path="/" element={ <MemMain /> } />
          <Route path="/addmem" element={<AddMember/>}/>
        </Routes>
      </div>
    );
  }