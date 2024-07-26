import { useRef, useState } from 'react';
import styles from './Sidebar.module.css';
import { FaStar, FaPlusCircle, FaHammer, FaChevronUp, FaChevronDown } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';

const Sidebar = () => {

    const navi = useNavigate();

    const [isAllBoardOpen, setIsAllBoardOpen] = useState(true);
    const togleIsAllBoard = () => {
        setIsAllBoardOpen(prevState => !prevState);
    }

    const [isGroupBoardOpen, setIsGroupBoardOpen] = useState(true);
    const togleIsGroupBoard = () => {
        setIsGroupBoardOpen(prevState => !prevState);
    }

    const checkValidateUser = (seq) => {
        console.log(seq);
        return true;
    }

    const [isAdmin, setIsAdmin] = useState(true);

    const testDTO = {seq : 999, name: "구구구"}

    return (
        <div className={styles.bar}>
            <div className={styles.buttonBox}>
                <button className={styles.writeButton}>글쓰기</button>
            </div>
            <div className={styles.board} onClick={() => { navi("board", {state : testDTO}) }}><FaStar />중요 게시물</div>
            {
                isAllBoardOpen ?
                    <div className={styles.board} onClick={togleIsAllBoard}><FaChevronUp />전사 게시판</div>
                    :
                    <div className={styles.board} onClick={togleIsAllBoard}><FaChevronDown />전사 게시판</div>
            }
            <div className={styles.allBoard} >
                {isAllBoardOpen && [{ seq: 1, name: "사내공지"  }, { seq: 4, name: "자유 게시판" }].map((item, i) => {
                    return (
                        <div key={i} className={styles.eachBoard} onClick={() => { navi("board", {state : item}) }}>{item.name}</div>
                    );
                })
                }
            </div>
            {
                isGroupBoardOpen ?
                    <div className={styles.board} onClick={togleIsGroupBoard}><FaChevronUp />그룹 게시판</div>
                    :
                    <div className={styles.board} onClick={togleIsGroupBoard}><FaChevronDown />그룹 게시판</div>
            }
            <div className={styles.groupBoard}>
                {isGroupBoardOpen && [{ seq: 5, name: "인사부 게시판" }, { seq: 6, name: "영업부 게시판"  }].map((item, i) => {
                    return (
                        <div key={i} className={styles.eachBoard} onClick={() => { (checkValidateUser(item.seq)) ? navi("board", {state : item}) : alert("접근이 제한된 게시판입니다!") }}>{item.name}</div>
                    );
                })
                }
            </div>
            {isAdmin && <div className={styles.board} onClick={() => { navi("createBoard")}}><FaPlusCircle />게시판 만들기</div>}
            {isAdmin && <div className={styles.board} onClick={() => { navi("manageBoard")}}><FaHammer />게시판 관리</div>}
        </div>
    );
}

export default Sidebar;