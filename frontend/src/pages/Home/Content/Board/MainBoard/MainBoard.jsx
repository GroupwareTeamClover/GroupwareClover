import { useLocation, useParams } from 'react-router-dom';
import styles from './MainBoard.module.css';
import { useEffect, useState } from 'react';
import { BaseUrl } from '../../../../../commons/config';
import axios from 'axios';
import { FaSearch } from "react-icons/fa";
import Post from './Post/Post';
import { Pagination } from '../../../../../components/Pagination/Pagination';

const MainBoard = () => {
    const { boardlistSeq } = useParams();
    const [boardInfo, setBoardInfo] = useState({ boardlistSeq: 0, boardlistName: '', boardlistType: '', boardlistActive: '' });
    const [currentPage, setCurrentPage] = useState(0);

    useEffect(() => {
        if (boardlistSeq === undefined) {
            setBoardInfo({ boardlistSeq: 1, boardlistName: '사내공지', boardlistType: 'A', boardlistActive: 'T' })
        } else if (boardlistSeq == 0) {
            setBoardInfo({ boardlistSeq: 0, boardlistName: '중요 게시물', boardlistType: 'A', boardlistActive: 'T' })
        } else {
            axios.get(`${BaseUrl()}/boardlist/boardInfo`, { params: { boardlistSeq: boardlistSeq } }).then((resp) => {
                setBoardInfo(prev => ({ ...prev, ...resp.data }));
            })
        }
    }, [boardlistSeq]);

    

    const [posts, setPosts] = useState([]);
    const [filtered, setFiltered] = useState(posts);
    //페이지네이션
    const PER_PAGE = 10; // 한 페이지에 보여줄 목록 수 
    const pageCount = Math.ceil(filtered.length / PER_PAGE); // (총 갯수 / PER_PAGE) = 페이지 몇 개 나올지 계산  
    const handlePageChange = ({ selected }) => {
        setCurrentPage(selected);
        window.scrollTo(0, 320);
    }

    useEffect(() => {
        axios.get(`${BaseUrl()}/board/posts/${boardInfo.boardlistSeq}`).then(resp => {
            setPosts(resp.data);
            setFiltered(resp.data);
        })
    }, [boardInfo]);

    //검색
    const [keyword, setKeyword] = useState('');
    const [searchType, setSearchType] = useState('');
    const handleKeywordChange = (e) => {
        setKeyword(e.target.value);
    }
    const handleSearchType = (e) => {
        setSearchType(e.target.value);
    }
    const handleSearch = () => {
        axios.get(`${BaseUrl()}/board/search`, {params : {boardlistSeq: boardInfo.boardlistSeq, searchType : searchType, keyword : keyword}}).then(resp => {
            console.log(resp.data);
        });
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>{boardInfo.boardlistName}</div>
            <div className={styles.searchBox}>
                <select name="searchType" class="typeBox" id="searchType" onChange={handleSearchType} value={searchType}>
                    <option value="">검색 유형</option>
                    <option value="title">제목</option>
                    <option value="writer">작성자</option>
                </select>
                <input type="text" id="keyword" name="keyword" autocomplete="off" onChange={handleKeywordChange} value={keyword} maxLength={100}></input>
                <button onClick={handleSearch}><FaSearch className={styles.searchLogo} /></button>
            </div>
            <div className={styles.postBox}>
                {filtered.slice(currentPage * PER_PAGE, (currentPage + 1) * PER_PAGE)
                    .map((post, i) => {
                        return(
                            <Post title={post.boardTitle} writer={post.boardWriter} data={post.boardWriteDate} view={post.boardViewCount}/>
                        );
                    })}
            </div>
            <div className={styles.pageNavi}>
                {pageCount > 0 && (
                    <Pagination
                        pageCount={pageCount}
                        onPageChange={handlePageChange}
                        currentPage={currentPage}
                    />
                )}
            </div>
        </div>
    );
}

export default MainBoard;