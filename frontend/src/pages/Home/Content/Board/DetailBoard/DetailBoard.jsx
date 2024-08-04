import { useNavigate, useParams } from 'react-router-dom';
import styles from './DetailBoard.module.css';
import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { BaseUrl } from '../../../../../commons/config';
import { IconContext } from 'react-icons';
import { GoStar } from 'react-icons/go';
import { LuEye } from 'react-icons/lu';
import { format } from 'date-fns/format';

const DetilBoard = () => {
    const { boardlistSeq, boardSeq } = useParams();
    const [boardlistName, setBoardlistName] = useState('');
    const [post, setPost] = useState({ boardSeq: 0, boardlistSeq: 0, boardTitle: '', boardWriter: '', boardContent: '', boardWriteDate: '', boardViewCount: 0 });
    const [writeDate, setWriteDate] = useState();
    const contentRef = useRef(null);

    const navi = useNavigate();

    useEffect(() => {
        axios.get(`${BaseUrl()}/boardlist/boardInfo`, { params: { boardlistSeq: boardlistSeq } }).then(resp => {
            setBoardlistName(resp.data.boardlistName);
        });
        axios.get(`${BaseUrl()}/board/postInfo/${boardSeq}`).then(resp => {
            setPost(prev => ({ ...prev, ...resp.data }));
            setWriteDate(format(new Date(Date.parse(resp.data.boardWriteDate)), 'yyyy.MM.dd HH:mm'));
            contentRef.current.innerHTML = resp.data.boardContent;
        })
    }, []);

    const handleDelete = () => {
        if(window.confirm("정말로 이 글을 삭제하시겠습니까?")){
            axios.delete(`${BaseUrl()}/board/${boardSeq}`).then(resp=>{
                if(resp.status === 200){
                    navi(`/community/board/${boardlistSeq}`);
                }else{
                    alert("오류가 발생했습니다. 지속 시 관리자에게 문의하세요.");
                }
            })
        }
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>{boardlistName}</div>
            <div className={styles.content}>
                <div className={styles.titleBox}>
                    <div className={styles.star}>
                        <IconContext.Provider value={{ color: "#000000", className: styles.starIcon }}>
                            <GoStar size="20" />
                        </IconContext.Provider>
                    </div>
                    <p className={styles.title}>{post.boardTitle}</p>
                </div>
                <div className={styles.infoBox}>
                    <div className={styles.name}>{post.boardWriter}</div>
                    <div className={styles.infoRightBox}>
                        <div className={styles.date}>
                            {writeDate}
                        </div>
                        <div className={styles.view}><LuEye />&nbsp;{post.boardViewCount}</div>
                    </div>
                </div>
                <div className={styles.viewCont} ref={contentRef}></div>
                <div className={styles.buttonBox}>
                    <div className={styles.leftBox}>
                        <button className={styles.goListBtn} onClick={() => { navi(`/community/board/${boardlistSeq}`)}}>목록</button>
                    </div>
                    <div className={styles.rightBox}>
                        <button className={styles.corBtn}>수정</button>
                        <button className={styles.delBtn} onClick={handleDelete}>삭제</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DetilBoard;