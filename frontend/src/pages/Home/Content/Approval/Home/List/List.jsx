import { useEffect, useState, useRef } from 'react';
import styles from './List.module.css';
import { BaseUrl } from '../../../../../../commons/config';
import axios from "axios";
import { useMemberStore } from '../../../../../../store/store';
import { format } from 'date-fns';
import { useNavigate, useLocation   } from 'react-router-dom';
import { MdOutlineArrowBackIos, MdOutlineArrowForwardIos } from "react-icons/md";
import { FaSearch } from "react-icons/fa";
import {Loading} from "../../../../../../components/Loading/Loading"



export const List = ({ type }) => {
    
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const cpage = parseInt(queryParams.get('cpage')) || 1; // cpage를 URL에서 가져오고 기본값을 1로 설정
    const searchType = queryParams.get('searchType') || 'title'; 
    const keyword = queryParams.get('keyword') || ''; 


    /************페이지네이션**************/
    //1. 전체 글의 갯수
    const [recordTotalCount, setRecordTotalCount] = useState(0);

    //2. 한 페이지에 몇개의 게시글 보여 줄건지
    const recordCountPerPage = 10;

    //3.Page Navigater 페이지 번호 자체를 몇 개씩 보여줄건지 결정
    const naviCountPerPage = 5;

    //4. 총 몇 페이지가 필요한가 네비게이터의 숫자 1번/2번 
    const [pageTotalCount, setPageTotalCount] = useState(0);

    //navi의 시작점
    const [startNavi, setStartNavi] = useState(1);
    const [endNavi, setEndNavi] = useState(1);

    //화살표 붙이기
    const [needPrev, setNeedPrev] = useState(false);
    const [needNext, setNeedNext] = useState(false);

    //페이지네이션 함수
    const calculatePagination = (totalRecords) => {
        const totalPages = Math.ceil(totalRecords / recordCountPerPage);
        setRecordTotalCount(totalRecords);
        setPageTotalCount(totalPages);

        const start = Math.floor((cpage - 1) / naviCountPerPage) * naviCountPerPage + 1;
        const end = Math.min(start + naviCountPerPage - 1, totalPages);
        setStartNavi(start);
        setEndNavi(end);
        setNeedPrev(start > 1);
        setNeedNext(end < totalPages);
    };

    /************전체데이터준비**************/
    const [loading, setLoading] = useState(false);
    const navi = useNavigate();
    const { sessionData } = useMemberStore();

    const formatDate = (date) => {
        if (!date) return '-';
        return format(new Date(date), 'yyyy-MM-dd');
    };

    const [documentDTOs, setDocumentDTOs] = useState([]);
    const [apvLineDTOs, setApvLineDTOs] = useState([]);
    const [participantsLineDTOs, setParticipantsLineDTOs] = useState([]);
    const [list, setList] = useState({});

    const [filteredDocuments, setFilteredDocuments] = useState([]);
    const [filteredApvLines, setFilteredApvLines] = useState([]);
    const [filteredPartLines, setFilteredPartLines] = useState([]);

    const [paginatedDocuments, setPaginatedDocuments] = useState([]);

    //전체 정보 한번만 가져오기
    useEffect(() => {
        if (type === '기안진행' || type === '결재대기' || type === '결재예정' || type === '참조/열람대기') {
            setLoading(true); // 로딩 상태 설정
            axios.get(`${BaseUrl()}/api/approval/list`, list)
                .then((resp) => {
                    setDocumentDTOs(resp.data.document);
                    setApvLineDTOs(resp.data.apvline);
                    setParticipantsLineDTOs(resp.data.pline);

                    let filteredDocument = [];
                    let filteredApvline = [];
                    let filteredPartLine = [];

                    if (type === '기안진행') {
                        filteredDocument = resp.data.document.filter(line =>
                            line.drafterSeq === sessionData.empSeq && line.stateName === '진행중'
                        );
                    } else if (type === '결재대기') {
                        filteredApvline = resp.data.apvline.filter(line =>
                            //1은 대기, 8은 보류
                            line.apverId === sessionData.empSeq && (line.apvStatusCode === 1 || line.apvStatusCode === 8)
                        );
                        filteredDocument = resp.data.document.filter(doc =>
                            filteredApvline.some(apv => apv.docSeq === doc.docSeq) && doc.stateName === '진행중'
                        ).map(doc => {
                            const participant = filteredApvline.find(part => part.docSeq === doc.docSeq);
                            return {
                                ...doc,
                                participantType: participant.apvStatusCode === 1 ? '대기' : '보류'
                            };
                        });
                    } else if (type === '결재예정') {
                        filteredApvline = resp.data.apvline.filter(line =>
                            line.apverId === sessionData.empSeq && line.apvStatusCode === 2
                        );
                        filteredDocument = resp.data.document.filter(doc =>
                            filteredApvline.some(apv => apv.docSeq === doc.docSeq) && doc.stateName === '진행중'
                        );
                    } else if (type === '참조/열람대기') {
                        filteredPartLine = resp.data.pline.filter(line =>
                            line.empSeq === sessionData.empSeq && line.readYN === "n"
                        );
                        filteredDocument = resp.data.document.filter(doc =>
                            filteredPartLine.some(part =>
                                part.docSeq === doc.docSeq && (
                                    (part.pcpDivision === 'r') ||
                                    (part.pcpDivision === 'v' && (doc.stateName === '완료' || doc.stateName === '반려'))
                                )
                            )
                        ).map(doc => {
                            const participant = filteredPartLine.find(part => part.docSeq === doc.docSeq);
                            return {
                                ...doc,
                                participantType: participant.pcpDivision === 'r' ? '참조' : '열람'
                            };
                        });
                    }
                    if (keyword) {
                        filteredDocument = filteredDocument.filter(doc => {
                            if (searchType === 'title') {
                                return doc.title.includes(keyword);
                            } else if (searchType === 'drafter_name') {
                                return doc.drafterName.includes(keyword);
                            }
                            return false;
                        });
                    }

                     // 날짜를 최신순으로 정렬
                    filteredDocument.sort((a, b) => new Date(b.writeDate) - new Date(a.writeDate));
        
                    setFilteredDocuments(filteredDocument);
                    calculatePagination(filteredDocument.length);
                    setPaginatedDocuments(filteredDocument.slice(
                        (cpage - 1) * recordCountPerPage,
                        cpage * recordCountPerPage
                    ));

                    // setFilteredDocuments(filteredDocument);
                    // setFilteredApvLines(filteredApvline);
                    // setFilteredPartLines(filteredPartLine);

                    // calculatePagination(filteredDocument.length); 

                    // setPaginatedDocuments(filteredDocument.slice(
                    //     (cpage - 1) * recordCountPerPage,
                    //     cpage * recordCountPerPage)
                    // );
                }).finally(() => {
                    setLoading(false);
                });
        }
    }, [type, cpage, recordCountPerPage, naviCountPerPage, keyword, searchType]);

    //기안문서함 (백엔드 페이지네이션)
    useEffect(() => {
        if (type === '기안문서함') {
            console.log(searchType, keyword);
            setLoading(true);  // 로딩 상태 설정
            axios.get(`${BaseUrl()}/api/approval/list/finish`, {
                params: {
                    cpage: cpage,  // 페이지 번호 전달
                    recordCountPerPage: recordCountPerPage,  // 고정값: 한 페이지에 몇 개의 글 보여줄 건지 
                    naviCountPerPage: naviCountPerPage,  // 고정값: 페이지 번호 자체를 몇 개씩 보여줄 건지 결정
                    searchType: searchType,
                    keyword: keyword
                }
            })
                .then((resp) => {
                    console.log(resp.data);
                    const totalRecords = resp.data.recordTotalCount;
                    const documents = resp.data.documents;

                    setDocumentDTOs(documents);
                    setPaginatedDocuments(documents);

                    calculatePagination(totalRecords); 
                }).catch((error) => {
                    console.error('Error fetching documents:', error);
                }).finally(() => {
                    setLoading(false);  // 로딩 상태 해제
                });
        }
    }, [type, cpage, recordCountPerPage, naviCountPerPage, keyword, searchType]);

    
    //임시문서함 (백엔드 페이지네이션)
    useEffect(() => {
        if (type === '임시문서함') {
            setLoading(true);  // 로딩 상태 설정
            axios.get(`${BaseUrl()}/api/approval/list/temp`, {
                params: {
                    cpage: cpage,  // 페이지 번호 전달
                    recordCountPerPage: recordCountPerPage,  // 고정값: 한 페이지에 몇 개의 글 보여줄 건지 
                    naviCountPerPage: naviCountPerPage,  // 고정값: 페이지 번호 자체를 몇 개씩 보여줄 건지 결정
                    searchType: searchType,
                    keyword: keyword
                }
            })
                .then((resp) => {
                    const totalRecords = resp.data.recordTotalCount;
                    const documents = resp.data.documents;
                    console.log(totalRecords);
                    console.log(documents);
                    setDocumentDTOs(documents);
                    setPaginatedDocuments(documents);

                    calculatePagination(totalRecords); 
                }).catch((error) => {
                    console.error('Error fetching documents:', error);
                }).finally(() => {
                    setLoading(false);  // 로딩 상태 해제
                });
        }
    }, [type, cpage, recordCountPerPage, naviCountPerPage, keyword, searchType]);

    //결재문서함 (백엔드 페이지네이션)
    useEffect(() => {
        if (type === '결재문서함') {
            setLoading(true);  // 로딩 상태 설정
            axios.get(`${BaseUrl()}/api/approval/list/approval`, {
                params: {
                    cpage: cpage,  // 페이지 번호 전달
                    recordCountPerPage: recordCountPerPage,  // 고정값: 한 페이지에 몇 개의 글 보여줄 건지 
                    naviCountPerPage: naviCountPerPage,  // 고정값: 페이지 번호 자체를 몇 개씩 보여줄 건지 결정
                    searchType: searchType,
                    keyword: keyword
                }
            })
                .then((resp) => {
                    const totalRecords = resp.data.recordTotalCount;
                    const documents = resp.data.documents;

                    setDocumentDTOs(documents);
                    setPaginatedDocuments(documents);

                    calculatePagination(totalRecords); 
                }).catch((error) => {
                    console.error('Error fetching documents:', error);
                }).finally(() => {
                    setLoading(false);  // 로딩 상태 해제
                });
        }
    }, [type, cpage, recordCountPerPage, naviCountPerPage, keyword, searchType]);


    //참조/열람문서함 (백엔드 페이지네이션)
    useEffect(() => {
        if (type === '참조/열람문서함') {
            setLoading(true);  // 로딩 상태 설정
            axios.get(`${BaseUrl()}/api/approval/list/part`, {
                params: {
                    cpage: cpage,  // 페이지 번호 전달
                    recordCountPerPage: recordCountPerPage,  // 고정값: 한 페이지에 몇 개의 글 보여줄 건지 
                    naviCountPerPage: naviCountPerPage,  // 고정값: 페이지 번호 자체를 몇 개씩 보여줄 건지 결정
                    searchType: searchType,
                    keyword: keyword
                }
            })
                .then((resp) => {
                    console.log(resp)  
                    const totalRecords = resp.data.recordTotalCount;
                    const documents = resp.data.documents;

                    // documents 배열에 participantType 추가
                    const updatedDocuments = documents.map(doc => {
                        return {
                            ...doc,
                            participantType: doc.pcpDivision === 'r' ? '참조' : '열람'
                        };
                    });

                    setDocumentDTOs(updatedDocuments);
                    setPaginatedDocuments(updatedDocuments);

                    calculatePagination(totalRecords); 
                }).catch((error) => {
                    console.error('Error fetching documents:', error);
                }).finally(() => {
                    setLoading(false);  // 로딩 상태 해제
                });
        }
    }, [type, cpage, recordCountPerPage, naviCountPerPage, keyword, searchType]);

    const handlePageClick = (pageNum) => {
        // 페이지 변경 시 URL 쿼리 파라미터를 갱신합니다.
        navi({
            pathname: location.pathname,
            search: `?type=${type}&cpage=${pageNum}&searchType=${searchType}&keyword=${keyword}`
        });
    };

    // const handlePageClick = (pageNum) => {
    //     navi(`?type=${type}&cpage=${pageNum}`);  // 페이지 클릭 시 URL 업데이트
    // };

    const handleDetail = (seq, type) => {
        navi(`/approval/document/${seq}?type=${type}`)
    }


    /************검색**************/
    const maxSearchLength = 30;
    const [inputKeyword, setInputKeyword] = useState(keyword);
    const [inputType, setInputType] =useState(searchType);
    //타입변경 
     const handleSearchType = (e) => {
        setInputType(e.target.value);
    }

    //키워드 변경
    const handleKeywordChange = (e) => {
        if (e.target.value.length <= maxSearchLength) {
            setInputKeyword(e.target.value);
        }
    }

    //현재 입력중인 검색어
    const handleEnter = (e) => {
        if (e.key === "Enter") {
            handleSearch();
        }
    }

    const handleSearch = () => {
        if (searchType === 'title') {
            navi(`?type=${type}&cpage=1&searchType=${inputType}&keyword=${inputKeyword}`);
        } else {
            navi(`?type=${type}&cpage=1&searchType=${inputType}&keyword=${inputKeyword}`);
        }
    }

    const resetSearchInputs = () => {
        setInputKeyword('');
        setInputType('title'); 
    };

    //사이드바 넘겨지면 검색창 없애기 
    // useRef를 컴포넌트 함수의 최상위에서 호출
    const prevTypeRef = useRef(undefined);

    useEffect(() => {
        // 이전 타입과 현재 타입이 다르면 검색 입력 값을 초기화
        if (prevTypeRef.current !== type) {
            resetSearchInputs();
        }

        // 현재 타입을 prevTypeRef에 저장하여 다음 렌더링에서 사용
        prevTypeRef.current = type;
    }, [type]);

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h3>{type}</h3>
            </div>
            <div className={styles.menuline}>
                {/* 메뉴 바디에 추가할 콘텐츠 필요 시 여기에 작성 */}
                <div className={styles.menu}></div>
                <div className={styles.search}>
                    <div className={styles.searchBox}>
                        <select  id="searchType" name="inputType"  value={inputType} className={styles.typeBox} onChange={handleSearchType}>
                            <option value="title">제목</option>
                            <option value="drafter_name">기안자</option>
                        </select>
                        <input type="text" id="keyword" name="inputKeyword" value={inputKeyword} autoComplete="off" onKeyDown={handleEnter} onChange={handleKeywordChange}  maxLength={maxSearchLength}></input>
                        <button onClick={handleSearch}><FaSearch className={styles.searchLogo} /></button>
                    </div>
                </div>
            </div>
            <div className={styles.content}>
                <div className={styles.contentbox}>
                    {loading ? (
                        <Loading />
                    ) : (
                        <>
                            <table>
                                <thead>
                                    <tr>
                                        {(type === '참조/열람대기' || type === '참조/열람문서함' || type === '결재대기') && (
                                            <td className={`${styles.td10} ${styles.theadtd}`}>
                                                구분
                                            </td>
                                        )}
                                        {['기안일', '완료일', '결재양식', '긴급', '제목', '기안자', '현재결재자', '최종결재자', '문서상태'].map((item, index) => (
                                            <td key={index} className={`${styles['td' + (index + 1)]} ${styles['theadtd' + (index + 1)]} ${styles.theadtd}`}>{item}</td>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {paginatedDocuments.length > 0 ? (
                                        paginatedDocuments.map((line, index) => (
                                            <tr key={index}>
                                                {(type === '참조/열람대기' || type === '참조/열람문서함' || type === '결재대기') && (
                                                    <td className={`${styles.td10} ${styles.tablerow}`}>
                                                        {line.participantType} 
                                                    </td>
                                                )}
                                                <td className={`${styles.td1} ${styles.tablerow}`}>{formatDate(line.writeDate)}</td>
                                                <td className={`${styles.td2} ${styles.tablerow}`}>{formatDate(line.finishDate)}</td>
                                                <td className={`${styles.td3} ${styles.tablerow}`}>{line.detailName}</td>
                                                <td className={`${styles.td4} ${styles.tablerow}`}>
                                                    {line.egcYn === 'n' ? '' : <div className={styles.stateBox}>
                                                        <span className={styles.egcstate}>긴급</span></div>
                                                    }
                                                </td>
                                                <td className={`${styles.td5} ${styles.tablerow} ${styles.title}`} onClick={() => handleDetail(line.docSeq, line.detailName)}>{line.title}</td>
                                                <td className={`${styles.td6} ${styles.tablerow}`}>{line.drafterName}</td>
                                                <td className={`${styles.td7} ${styles.tablerow}`}>{line.currentApverName}</td>
                                                <td className={`${styles.td8} ${styles.tablerow}`}>{line.finalApverName}</td>
                                                <td className={`${styles.td9} ${styles.tablerow}`}>
                                                    {line.stateName === '진행중' ? <div className={styles.stateBox}>
                                                        <span className={styles.ingstate}>{line.stateName}</span></div>
                                                        : ''}
                                                    {line.stateName === '반려' ? <div className={styles.stateBox}>
                                                        <span className={styles.rejectstate}>{line.stateName}</span></div>
                                                        : ''}
                                                    {line.stateName === '완료' ? <div className={styles.stateBox}>
                                                        <span className={styles.comstate}>{line.stateName}</span></div>
                                                        : ''}
                                                    {line.stateName === '임시저장' ? <div className={styles.stateBox}>
                                                        <span className={styles.tempstate}>{line.stateName}</span></div>
                                                        : ''}

                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="9" className={styles.noData}>내용이 없습니다.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>

                            {/* 페이지네이션 추가 */}
                            <div className={styles.paginationBox}>
                                <div className={styles.pagination}>
                                    {needPrev && <span onClick={() => handlePageClick(startNavi - 1)} className={styles.naviarrow}>  <MdOutlineArrowBackIos size={18} /></span>}
                                    {
                                        (() => {
                                            const pageButtons = [];
                                            for (let i = startNavi; i <= endNavi; i++) {
                                                pageButtons.push(
                                                    <span key={i} onClick={() => handlePageClick(i)} 
                                                    className={`${styles.navinum} ${cpage === i ? styles.activePage : ''}`}>
                                                        {i}</span>
                                                );
                                            }
                                            return pageButtons;
                                        })()
                                    }
                                    {needNext && <span onClick={() => handlePageClick(endNavi + 1)} className={styles.naviarrow}> <MdOutlineArrowForwardIos size={18} /></span>}
                                </div>
                            </div>

                        </>

                    )}
                </div>
            </div>
        </div>
    )
}
