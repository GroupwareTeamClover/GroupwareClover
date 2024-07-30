import { Route, Routes } from 'react-router-dom';
import styles from './Board.module.css';
import BoardContent from './BoardContent/BoardContent';
import Sidebar from './Sidebar/Sidebar';
import CreateBoard from './CreateBoard/CreateBoard';

const Board = () => {
    return (
        <div className={styles.container}>
            <Sidebar />
            <Routes>
                <Route path="/" element={<BoardContent isDefault={true}/>} />
                <Route path="/board/*" element={<BoardContent />} />
                <Route path="/createBoard" element={<CreateBoard/>}/>
            </Routes>
        </div>
    );
}

export default Board;