import styles from './Post.module.css';
import defaultImage from '../../../../../../images/default_avatar.jpg'
import { LuEye } from "react-icons/lu";
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import axios from 'axios';
import { useBoardStore } from '../../../../../../store/store';

const Post = ({ boardlistSeq, data }) => {
    const navi = useNavigate();
    const { groupBoardList, allBoardList } = useBoardStore();
    const eachName = [...groupBoardList, ...allBoardList].filter(item => item.boardlistSeq === data.boardlistSeq);

    return (
        <div className={styles.post}>
            <div className={styles.title} onClick={() => { navi(`/community/board/${data.boardlistSeq}/detail/${data.boardSeq}`) }}>
                {boardlistSeq === 0 && `[${eachName[0].boardlistName}] `}
                {data.boardTitle}
                </div>
            <div className={styles.writer}>{data.boardWriter}</div>
            <div className={styles.date}>{format(new Date(Date.parse(data.boardWriteDate)), 'yy.MM.dd')}</div>
            <div className={styles.view}><LuEye />&nbsp;{data.boardViewCount}</div>
        </div>
    );

}

export default Post;