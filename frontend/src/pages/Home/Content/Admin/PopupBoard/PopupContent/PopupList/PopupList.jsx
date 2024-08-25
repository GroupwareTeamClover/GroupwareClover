import { useEffect, useState } from "react"
import { useMemStore } from "../../../../../../../store/store";
import axios from "axios";
import { BaseUrl } from "../../../../../../../commons/config";
import styles from './PopupList.module.css';
import { Pagination } from "../../../../../../../components/Pagination/Pagination";
import { FaLightbulb, FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import {format} from 'date-fns';
import { smallAlert } from "../../../../../../../commons/common";

export const PopupList=()=>{
    const navi = useNavigate();

    const {storemembers, setstoremembers} = useMemStore();
    const [poplist, setPoplist] = useState([]);
    const [filtered, setFiltered] = useState(poplist);
    const [currentPage, setCurrentPage] = useState(0);

    const [isLoading, setIsLoading] = useState(true);

    const [announcements, setAnnouncements] = useState([]);

    // 페이지네이션 설정
    const PER_PAGE = 10;
    const pageCount = Math.ceil(filtered.length / PER_PAGE);
    
    const handlePageChange = ({selected}) => {
        setCurrentPage(selected);
        window.scrollTo(0,320); // 페이지 변경 시 스크롤 맨 위로 이동
    };



    // 서버에서 팝업공지글들 가져옴
    useEffect(()=>{
        axios.get(`${BaseUrl()}/adminpopup`).then((resp)=>{
            setPoplist(resp.data);
            setFiltered(resp.data);
            setstoremembers(false);
            setIsLoading(false);
        });

        axios.get(`${BaseUrl()}/adminpopup/today`).then((resp)=>{
            setAnnouncements(resp.data);
            console.log(resp.data)
        })
        
    },[storemembers]);

  
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
            smallAlert("검색 유형을 선택하세요!");
        } else {
            if (searchType === 'title') {
                setFiltered(poplist.filter(post => (post.popTitle === keyword || post.popTitle.includes(keyword))));
            } else {
                setFiltered(poplist.filter(post => (post.empName === keyword || post.empName.includes(keyword))));
            }
            // 검색 후 첫 페이지로 이동
            setCurrentPage(0);
        }
    }


    return(

        <div className={styles.container}>
            <div className={styles.member_info}>
                <div className={styles.member_total}>
                    <span className={styles.sparkle}>오늘의 팝업 : <span style={{color:'orange'}}> {announcements.length} 개</span> </span>
                </div>
                <div className={styles.pop_list}>
                    {/* {announcements.map((pop, i) => (
                        <div key={i}>
                            {i+1}. <a href={`/popup/detail/${pop.popSeq}`}>{pop.popTitle}</a>
                        </div>
                    ))} */}
                </div>
            </div>
            <div className={styles.funcBtn}>
                <div className={styles.col_button}>
                </div>         
                <div className={styles.searchBox}>
                    <select name="searchType" className={styles.typeBox} id="searchType" onChange={handleSearchType} value={searchType}>
                        <option value="">검색 유형</option>
                        <option value="title">제목</option>
                        <option value="writer">작성자</option>
                    </select>
                    <input type="text" id="keyword" name="keyword" autoComplete="off" onKeyDown={handleEnter} onChange={handleKeywordChange} value={keyword} maxLength={maxSearchLength}></input>
                    <button onClick={handleSearch}><FaSearch className={styles.searchLogo} /></button>
                </div>
                
            </div>
            <div className={styles.body}>
                <div className={styles.tableWrapper}>
                    <table className={styles.table}>
                        <thead className={styles.thead}>
                            <tr>
                                <td className={styles.theadtd}>팝업공지제목</td>
                                <td className={styles.theadtd} >공지기간</td>
                                <td className={styles.theadtd}>작성자</td>
                                <td className={styles.theadtd}>작성일</td>
                            </tr>
                        </thead>
                        <tbody className={styles.tbody}>
                            {isLoading ? (
                                <tr className={styles.loading}>글 목록을 불러오는 중입니다..</tr>
                            ) : ((filtered.length === 0) ? (
                                <tr className={styles.loading}>해당 게시판의 글이 없습니다.</tr>
                            ) : (
                                filtered.length > 0 ? (
                                    filtered.slice(currentPage * PER_PAGE, (currentPage +1) * PER_PAGE).map((mem, i) => (
                                        <tr key={i}>
                                       
                                       {mem.popIsActive ==='true'  ? 
                                             <td className={styles.theadtd_updated} onClick={()=> { 
                                                navi(`/popup/detail/${mem.popSeq}`, { state: { type: "팝업공지글 목록 >  상세" } }); 
                                            }}>
                                              <FaLightbulb className={styles.on}/>{mem.popTitle}
                                            </td>
                                            :
                                            <td className={styles.theadtd} onClick={()=> { 
                                                navi(`/popup/detail/${mem.popSeq}`, { state: { type: "팝업공지글 목록 >  상세" } }); 
                                            }}>
                                                <FaLightbulb className={styles.off}/>{mem.popTitle}
                                            </td>
                                        }
                                       
                                       <td className={styles.theadtd}>
                                            {mem.monthlyDay ? ('매월 ' + mem.monthlyDay+'일' )
                                            :
                                            mem.weeklyDay ? 
                                            ('매주 '+ 
                                            (mem.weeklyDay === 'MONDAY' ? '월':
                                            mem.weeklyDay === 'TUESDAY' ? '화':
                                            mem.weeklyDay === 'WEDNESDAY' ? '수':
                                            mem.weeklyDay === 'THURSDAY' ? '목':
                                            mem.weeklyDay === 'FRIDAY' ? '금':
                                            mem.weeklyDay === 'SATURDAY' ? '토':
                                            mem.weeklyDay === 'SUNDAY' ? '일':

                                             '')+'요일'
                                            ):
                                        mem.specificStartDate +'~'+ mem.specificEndDate }
                                       </td>
                                        <td className={styles.theadtd}>
                                            {mem.empName}
                                        </td>
                                        <td className={styles.theadtd}>
                                            {mem.popWriteDate ? format(new Date(mem.popWriteDate), 'yyyy.MM.dd HH:mm') : '날짜 없음'}
                                        </td>
                                        </tr>
                                    ))): (
                                       
                                        <tr>
                                            <td colSpan="7" className={styles.noData}>검색 결과가 없습니다.</td>
                                        </tr>
                                    )
                            )
                            )
                            }
                            </tbody>


                    </table>
                </div>
            </div>
            <div className={styles.pagination}>
                {/* 페이지네이션 */}
                {pageCount > 0 && (
                    <Pagination
                        pageCount={pageCount}
                        onPageChange={handlePageChange}
                        currentPage={currentPage}
                    />
                    )}
            </div>

        </div>
    )
   
}