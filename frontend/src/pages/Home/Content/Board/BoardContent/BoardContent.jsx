import { useLocation, useParams } from 'react-router-dom';
import styles from './BoardContent.module.css';
import { useEffect, useState } from 'react';
import { BaseUrl } from './../../../../../commons/config';
import axios from 'axios';
import { FaSearch } from "react-icons/fa";
import Post from './Post/Post';



const BoardContent = () => {
    const { boardlistSeq } = useParams();
    const [boardInfo, setBoardInfo] = useState({ boardlistSeq: 0, boardlistName: '', boardlistType: '', boardlistActive: '' });

    useEffect(() => {
        if (boardlistSeq === undefined) {
            setBoardInfo({ boardlistSeq: 1, boardlistName: '사내공지', boardlistType: 'A', boardlistActive: 'T' })
        } else {
            axios.get(`${BaseUrl()}/boardlist/boardInfo`, { params: { boardlistSeq: boardlistSeq } }).then((resp) => {
                setBoardInfo(prev => ({ ...prev, ...resp.data }));
            })
        }
    }, [boardlistSeq]);

    const [keyword, setKeyword] = useState('');
    const handleKeywordChange = (e) => {
        setKeyword(e.target.value);
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>{boardInfo.boardlistName}</div>
            <div className={styles.searchBox}>
                <select name="searchType" class="typeBox" id="searchType">
                    <option value="">검색 유형</option>
                    <option value="title">제목</option>
                    <option value="writer">작성자</option>
                </select>
                <input type="text" id="keyword" name="keyword" autocomplete="off" onChange={handleKeywordChange} value={keyword} maxLength={100}></input>
                <button><FaSearch className={styles.searchLogo}/></button>
            </div>
            <div className={styles.postBox}>
                <Post/>
                <Post/>
                <Post/>
                <Post/>
                <Post/>
                <Post/>
                <Post/>
                <Post/>
                <Post/>
                <Post/>
            </div>
            <div className={styles.pageNavi}>1 2 3 4 5 6 7 8 9 10</div>
        </div>
    );
}

export default BoardContent;