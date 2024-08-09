import styles from './Post.module.css';
import { GoStar } from "react-icons/go";
import defaultImage from '../../../../../../images/default_avatar.jpg'
import { IconContext } from "react-icons";
import { LuEye } from "react-icons/lu";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BaseUrl } from '../../../../../../commons/config';

const Post = ({ title, writer, date, view, boardlistSeq, boardSeq, sessionSeq }) => {

    const navi = useNavigate();

    const handleAddImportant = async () => {
        axios.post(`${BaseUrl()}/board/important`, {
            empSeq: sessionSeq,
            boardSeq: boardSeq
        }).then(resp => {
            { resp.status === 200 && alert("중요 게시글에 추가되었습니다!"); }
        })
    }

    return (
        <div className={styles.post}>
            <div className={styles.star} onClick={handleAddImportant}>
                <IconContext.Provider value={{ color: "#000000", className: styles.starIcon }}>
                    <GoStar size="20" />
                </IconContext.Provider>
            </div>
            <div className={styles.title} onClick={() => { navi(`/community/board/${boardlistSeq}/detail/${boardSeq}`) }}>{title}</div>
            <div className={styles.writer}>
                <div className={styles.userAvatar}>
                    <img src={defaultImage} alt="기본 이미지" />
                </div>
                {writer}
            </div>
            <div className={styles.date}>{date}</div>
            <div className={styles.view}><LuEye />&nbsp;{view}</div>
        </div>
    );
}

export default Post;