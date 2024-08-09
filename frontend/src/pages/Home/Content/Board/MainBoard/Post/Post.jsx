import styles from './Post.module.css';
import { GoStar, GoStarFill } from "react-icons/go";
import defaultImage from '../../../../../../images/default_avatar.jpg'
import { IconContext } from "react-icons";
import { LuEye } from "react-icons/lu";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BaseUrl } from '../../../../../../commons/config';
import { useEffect, useState } from 'react';

const Post = ({ title, writer, date, view, boardlistSeq, boardSeq, sessionSeq, importants }) => {
    const navi = useNavigate();
    const [isImportant, setIsImportant] = useState(importants.includes(boardSeq));

    const handleAddImportant = async () => {
        await axios.post(`${BaseUrl()}/board/important`, {
            empSeq: sessionSeq,
            boardSeq: boardSeq
        }).then(resp => {
            { resp.status === 200 && alert("중요 게시글에 추가되었습니다!"); setIsImportant(true); }
        })
    }

    const handleRemoveImportant = async () => {
        await axios.delete(`${BaseUrl()}/board/important`, { params: { empSeq: sessionSeq, boardSeq: boardSeq } }).then(resp => {
            { resp.status === 200 && alert("중요 게시글에서 삭제되었습니다!"); setIsImportant(false); }
        })
    }

    return (
        <>
            {(boardlistSeq === 0 && isImportant === false) ? <div></div> :
                <div className={styles.post}>
                    {isImportant ?
                        <div className={styles.star}>
                            <IconContext.Provider value={{ color: "#000000", className: styles.starFillIcon }}>
                                <GoStarFill size="20" onClick={handleRemoveImportant} />
                            </IconContext.Provider>
                        </div> :
                        <div className={styles.star}>
                            <IconContext.Provider value={{ color: "#000000", className: styles.starIcon }}>
                                <GoStar size="20" onClick={handleAddImportant} />
                            </IconContext.Provider>
                        </div>
                    }
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
            }
        </>
    );

}

export default Post;