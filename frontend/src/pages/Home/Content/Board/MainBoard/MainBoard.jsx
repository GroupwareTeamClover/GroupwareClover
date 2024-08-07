import { useParams } from 'react-router-dom';
import styles from './MainBoard.module.css';
import { useEffect, useState } from 'react';
import { BaseUrl } from '../../../../../commons/config';
import axios from 'axios';
import { FaSearch } from "react-icons/fa";
import Post from './Post/Post';
import { Pagination } from '../../../../../components/Pagination/Pagination';
import { Loader } from 'rsuite';

const MainBoard = () => {
    const { boardlistSeq } = useParams();
    const [boardInfo, setBoardInfo] = useState({ boardlistSeq: 0, boardlistName: '', boardlistType: '', boardlistActive: '' });
    const [currentPage, setCurrentPage] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
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
        const fetchBoardInfo = async () => {
            setIsLoading(true);
            try {
                let data;
                if (boardlistSeq === undefined) {
                    data = { boardlistSeq: 1, boardlistName: '사내공지', boardlistType: 'A', boardlistActive: 'T' };
                } else if (boardlistSeq == 0) {
                    data = { boardlistSeq: 0, boardlistName: '중요 게시물', boardlistType: 'A', boardlistActive: 'T' };
                } else {
                    const response = await axios.get(`${BaseUrl()}/boardlist/boardInfo`, { params: { boardlistSeq: boardlistSeq } });
                    data = response.data;
                }
                setBoardInfo(data);
            } catch (error) {
                console.error('보드 정보 로딩 실패', error);
            }
        };
        fetchBoardInfo();
    }, [boardlistSeq]);

    useEffect(() => {
        const fetchPosts = async () => {
            setIsLoading(true);
            try {
                const response = await axios.get(`${BaseUrl()}/board/posts/${boardInfo.boardlistSeq}`);
                setPosts(response.data);
                setFiltered(response.data);
            } catch (error) {
                console.error('포스트 로딩 실패', error);
            } finally {
                setIsLoading(false);
            }
        };

        if (boardInfo.boardlistSeq !== 0) {
            fetchPosts();
        }
    }, [boardInfo]);

    //검색
    const maxSearchLength = 30;
    const [keyword, setKeyword] = useState('');
    const [searchType, setSearchType] = useState('');
    const handleKeywordChange = (e) => {
        if (e.target.value.length > maxSearchLength) {
            e.preventDefault();
        } else {
            setKeyword(e.target.value);
        }
    }
    const handleEnter = (e) => {
        if (e.key === "Enter") handleSearch();
    }
    const handleSearchType = (e) => {
        setSearchType(e.target.value);
    }
    const handleSearch = () => {
        if (searchType === '') {
            alert("검색 유형을 선택하세요!");
        } else {
            if (searchType === 'title') {
                setFiltered(posts.filter(post => (post.boardTitle == keyword || post.boardTitle.includes(keyword))));
            } else {
                setFiltered(posts.filter(post => (post.boardWriter == keyword || post.boardWriter.includes(keyword))));
            }
        }
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>{boardInfo.boardlistName}</div>
            <div className={styles.searchBox}>
                <select name="searchType" className={styles.typeBox} id="searchType" onChange={handleSearchType} value={searchType}>
                    <option value="">검색 유형</option>
                    <option value="title">제목</option>
                    <option value="writer">작성자</option>
                </select>
                <input type="text" id="keyword" name="keyword" autoComplete="off" onKeyDown={handleEnter} onChange={handleKeywordChange} value={keyword} maxLength={maxSearchLength}></input>
                <button onClick={handleSearch}><FaSearch className={styles.searchLogo} /></button>
            </div>
            <div className={styles.postBox}>
                {isLoading ? (
                    <div className={styles.loading}><Loader content="글 목록을 불러오는 중입니다.." vertical /></div>
                ) : ((filtered.length === 0) ? (
                    <div className={styles.loading}>해당 게시판의 글이 없습니다.</div>
                ) : (
                    filtered.slice(currentPage * PER_PAGE, (currentPage + 1) * PER_PAGE)
                        .map((post, i) => (
                            <Post key={i} boardlistSeq={boardInfo.boardlistSeq} boardSeq={post.boardSeq} title={post.boardTitle} writer={post.boardWriter} data={post.boardWriteDate} view={post.boardViewCount} />
                        ))
                )
                )}
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