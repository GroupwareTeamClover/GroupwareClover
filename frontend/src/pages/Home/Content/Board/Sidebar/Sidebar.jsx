import { useEffect, useRef, useState } from 'react';
import styles from './Sidebar.module.css';
import { FaStar, FaPlusCircle, FaHammer, FaChevronUp, FaChevronDown } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BaseUrl } from '../../../../../commons/config';
import { useBoardStore } from '../../../../../store/store';

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

    const { allBoardList, setAllBoardList, groupBoardList, setGroupBoardList} = useBoardStore();

    useEffect(() => {
        axios.get(`${BaseUrl()}/boardlist/allBoards`).then((resp) => {
            setAllBoardList(resp.data);
        })
        axios.get(`${BaseUrl()}/boardlist/groupBoards`).then((resp)=>{
            setGroupBoardList(resp.data);
        })
    }, []);


    const [isAdmin, setIsAdmin] = useState(true);
    const testDTO = { boardlistSeq: 999, boardlistName: "구구구" }

    return (
        <div className={styles.bar}>
            <div className={styles.buttonBox}>
                <button className={styles.writeButton}>글쓰기</button>
            </div>
            <div className={styles.board} onClick={() => { navi("board", { state: testDTO }) }}><FaStar />중요 게시물</div>
            {
                isAllBoardOpen ?
                    <div className={styles.board} onClick={togleIsAllBoard}><FaChevronUp />전사 게시판</div>
                    :
                    <div className={styles.board} onClick={togleIsAllBoard}><FaChevronDown />전사 게시판</div>
            }
            <div className={styles.allBoard} >
                {isAllBoardOpen && allBoardList.map((item, i) => {
                    return (
                        <div key={i} className={styles.eachBoard} onClick={() => { navi("board", { state: item }) }}>{item.boardlistName}</div>
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
                {isGroupBoardOpen && groupBoardList.map((item, i) => {
                    return (
                        <div key={i} className={styles.eachBoard} onClick={() => { (checkValidateUser(item.seq)) ? navi("board", { state: item }) : alert("접근이 제한된 게시판입니다!") }}>{item.boardlistName}</div>
                    );
                })
                }
            </div>
            {isAdmin && <div className={styles.board} onClick={() => { navi("createBoard") }}><FaPlusCircle />게시판 만들기</div>}
            {isAdmin && <div className={styles.board} onClick={() => { navi("manageBoard") }}><FaHammer />게시판 관리</div>}
        </div>
    );
}

export default Sidebar;