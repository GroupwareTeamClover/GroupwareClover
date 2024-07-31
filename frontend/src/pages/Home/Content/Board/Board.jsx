import { Route, Routes } from 'react-router-dom';
import styles from './Board.module.css';
import BoardContent from './BoardContent/BoardContent';
import Sidebar from './Sidebar/Sidebar';
import CreateBoard from './CreateBoard/CreateBoard';
import ManageBoard from './ManageBoard/ManageBoard';
import ModifyBoard from './ModifyBoard/ModifyBoard';

const Board = () => {
    return (
        <div className={styles.container}>
            <Sidebar />
            <Routes>
                <Route path="/" element={<BoardContent isDefault={true}/>} />
                <Route path="/board/*" element={<BoardContent />} />
                <Route path="/createBoard" element={<CreateBoard/>}/>
                <Route path="/manageBoard" element={<ManageBoard/>}/>
                <Route path="/manageBoard/modifyBoard" element={<ModifyBoard/>}/>
            </Routes>
        </div>
    );
}

export default Board;