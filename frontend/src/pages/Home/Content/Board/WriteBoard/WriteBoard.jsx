import { useState } from 'react';
import styles from './WriteBoard.module.css';

const WriteBoard = () => {

    const [title, setTitle] = useState('');
    const handleTitleChange = (e) => {
        setTitle(e.target.value);
    }

    return(
        <div className={styles.container}>
            <div className={styles.header}>글쓰기페이지</div>
            <div className={styles.titleBox}>
                <input type="text" onChange={handleTitleChange} value={title}></input>
            </div>
        </div>
        
    );
}

export default WriteBoard;