import { useLocation } from 'react-router-dom';
import styles from './BoardContent.module.css';

const BoardContent = ( {isDefault} ) => {
    const loc = useLocation();
    const boardInfo = {seq : 1, name : '사내공지'};

    return (
        <div className={styles.container}>
            {(isDefault)?<div>{boardInfo.seq} : {boardInfo.name}</div>:<div>{loc.state.boardlistSeq} : {loc.state.boardlistName}</div>}
        </div>
    );
}

export default BoardContent;