import styles from './Content.module.css'
import {Main} from "./Main/Main";
import {Route, Routes} from "react-router-dom";
import {Calendar} from "./Calendar/Calendar";
import {Address} from "./Address/Address";
import Board from './Board/Board';
import { ChatMain } from './Messenger/ChatMain';

export const Content = () => {

  return(
    <div className={styles.container}>
        <Routes>
          <Route path="/" element={ <Main /> } />
          <Route path="/calendar/*" element={ <Calendar /> } />
          <Route path="/address/*" element={ <Address /> } />
          <Route path="/community/*" element={<Board/> }></Route>
          <Route path="/chat/*" element={ <ChatMain /> } />
        </Routes>
    </div>
  );
}