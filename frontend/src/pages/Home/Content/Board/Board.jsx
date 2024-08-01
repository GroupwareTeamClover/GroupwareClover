import { Route, Routes } from 'react-router-dom';
import styles from './Board.module.css';
import Sidebar from './Sidebar/Sidebar';
import CreateBoard from './CreateBoard/CreateBoard';
import ManageBoard from './ManageBoard/ManageBoard';
import ModifyBoard from './ModifyBoard/ModifyBoard';
import MainBoard from './MainBoard/MainBoard';
import WriteBoard from './WriteBoard/WriteBoard';

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
                <Route path="/writeBoard" element={<WriteBoard />}/>
            </Routes>
        </div>
    );
}

export default Board;