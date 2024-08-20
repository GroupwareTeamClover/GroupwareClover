import { Address } from '../Home/Content/Address/Address';
import { Dashboard } from '../Home/Content/Admin/Dashboard/Dashboard';
import Board from '../Home/Content/Board/Board';
import styles from '../Home/Content/Content.module.css'
import {Route, Routes} from "react-router-dom";
import { ChatMain } from '../Home/Content/Messenger/ChatMain';
import { Approval } from '../Home/Content/Approval/Approval';
import { Member } from '../Home/Content/Admin/Member/Member';
import { Popup } from '../Home/Content/Admin/PopupBoard/Popup';
import { Log } from '../Home/Content/Admin/Log/Log';
import {Calendar} from '../Home/Content/Calendar/Calendar';


export const AdminContent = () => {

  return(
    <div className={styles.container}>
        <Routes>
          <Route path="/" element={ <Dashboard /> } />
          <Route path="/address/*" element={ <Address /> } />
          <Route path="/calendar/*" element={ <Calendar /> } />
          <Route path="/community/*" element={<Board/> }></Route>
          <Route path="/chat/*" element={ <ChatMain /> } />
          <Route path="/approval/*" element={<Approval/>}/>
          <Route path="/member/*" element={<Member/>}/>
          <Route path="/popup/*" element={<Popup/>}/>
          <Route path="/log/*" element={<Log/>}/>
        </Routes>
    </div>
  );
}