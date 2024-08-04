import styles from './Home.module.css';
import { Routes, Route, useLocation  } from "react-router-dom";
import { Main } from "../Home/Main/Main";
import { Document } from '../Home/Document/Document';
import { List } from '../Home/List/List';

//현재 url approval/*

export const Home=()=>{
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    //url의 type정보 컴포넌트로 넘겨줌
    const type = queryParams.get('type');

    return(
        <div className={styles.container}>
            <Routes>
                <Route path="/*" element={<Main/>}/>
                <Route path="/document/*" element={<Document type={type}/>}/>
                <Route path="/list/*" element={<List type={type}/>}></Route>
            </Routes>
        </div>
    )
}
