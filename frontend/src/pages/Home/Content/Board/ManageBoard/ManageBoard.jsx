import { useEffect, useState } from 'react';
import styles from './ManageBoard.module.css';
import axios from 'axios';
import { BaseUrl } from '../../../../../commons/config';
import { useBoardStore, useMemberStore } from '../../../../../store/store';
import { useNavigate } from 'react-router-dom';

const ManageBoard = () => {

    const navi = useNavigate();
    const { delAllBoardList, delGroupBoardList } = useBoardStore();
    const { admin } = useMemberStore();

    const [boards, setBoards] = useState([]);
    useEffect(() => {
        axios.get(`${BaseUrl()}/boardlist/entireBoards`).then((resp) => {
            setBoards(resp.data);
        })
    }, []);

    const handleDelete = (e) => {
        let isDel = window.confirm("정말 이 게시판을 삭제하시겠습니까?");

        if (isDel) {
            let delSeq = e.target.getAttribute("data-seq");
            axios.delete(`${BaseUrl()}/boardlist/${delSeq}`).then((resp) => {
                if (resp.status === 200) {
                    delAllBoardList(delSeq);
                    delGroupBoardList(delSeq);
                    setBoards(prev => prev.filter((board) => (board.boardlistSeq != delSeq)));
                }
            });
        }
    }

    return !admin ? <div className={styles.container}>관리자 전용 페이지입니다.</div> : (
        <div className={styles.container}>
            <div className={styles.header}>게시판 관리</div>
            <div className={styles.content}>
                <div className={styles.listHeaderBox}>
                    <div className={styles.listHeader} id={styles.listHeaderTitle}>게시판명</div>
                    <div className={styles.listHeader}>유형</div>
                    <div className={styles.listHeader}>활성화</div>
                    <div className={styles.listHeader}>수정/삭제</div>
                </div>
                <div className={styles.listBox}>
                    {
                        boards.map((board, i) => (
                            <div key={i} className={styles.eachBoard}>
                                <div className={styles.eachTitle}>{board.boardlistName}</div>
                                <div className={styles.eachType}>
                                    {board.boardlistType === 'A' ? "전사게시판" : "그룹게시판"}
                                </div>
                                <div className={styles.eachActive}>
                                    {board.boardlistActive === 'T' ? "활성화" : "비활성화"}
                                </div>
                                <div className={styles.eachButtonBox}>
                                    {board.boardlistSeq !== 1 &&
                                        <>
                                            <button className={styles.eachModifyButton} onClick={() => {
                                                axios.get(`${BaseUrl()}/boardlist/whitelist/${board.boardlistSeq}`).then((resp) => {
                                                    navi("modifyBoard", { state: { ...board, whitelist: resp.data } });
                                                })
                                            }}>수정</button>
                                            <button className={styles.eachDeleteButton} onClick={handleDelete} data-seq={board.boardlistSeq}>삭제</button>
                                        </>
                                    }
                                </div>
                            </div>
                        ))
                    }
                </div>
            </div>
        </div>
    );
}

export default ManageBoard;