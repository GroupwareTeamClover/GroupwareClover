import { Route, Routes } from 'react-router-dom';
import styles from './Board.module.css';
import Sidebar from './Sidebar/Sidebar';
import CreateBoard from './CreateBoard/CreateBoard';
import ManageBoard from './ManageBoard/ManageBoard';
import ModifyBoard from './ModifyBoard/ModifyBoard';
import MainBoard from './MainBoard/MainBoard';
import WritePost from './WritePost/WritePost';
import DetilBoard from './DetailBoard/DetailBoard';
import ModifyPost from './ModifyPost/ModifyPost';
import NotFound from './NotFound/NotFound';

const Board = () => {
    return (
        <div className={styles.container}>
            <Sidebar />
            <Routes>
                <Route path="/" element={<MainBoard/>} />
                <Route path="/board/:boardlistSeq" element={<MainBoard />} />
                <Route path="/createBoard" element={<CreateBoard />} />
                <Route path="/manageBoard" element={<ManageBoard />} />
                <Route path="/manageBoard/modifyBoard" element={<ModifyBoard />} />
                <Route path="/writePost" element={<WritePost />}/>
                <Route path="/board/:boardlistSeq/detail/:boardSeq" element={<DetilBoard/>}/>
                <Route path="/modifyPost" element={<ModifyPost/>}/>
                <Route path="*" element={<NotFound/>}/>
            </Routes>
        </div>
    );
}

export default Board;