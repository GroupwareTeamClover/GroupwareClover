import { Loader } from 'rsuite';
import styles from './Loglist.module.css';
import { FaSearch } from 'react-icons/fa';
import { useEffect, useState } from 'react';
import { useMemStore } from '../../../../../../store/store';
import axios from 'axios';
import { BaseUrl } from '../../../../../../commons/config';
import { deptName } from '../../../../../../commons/common';
import { Pagination } from '../../../../../../components/Pagination/Pagination';
import {format} from 'date-fns';

export const Loglist=()=>{

    const {storemembers, setstoremembers} = useMemStore();
    const [loglist, setLoglist] = useState([]);
    const [filtered, setFiltered] = useState(loglist);
    const [isLoading, setIsLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(0);


    // 서버에서 log기록들 가져옴
    useEffect(()=>{
        axios.get(`${BaseUrl()}/adminlog`).then((resp)=>{
            setLoglist(resp.data);   // loglist에 담기
            setFiltered(resp.data);  // filtered에도 담기 (검색)
            setstoremembers(false);
            setIsLoading(false);     // 로딩할때
            console.log(resp.data)
        })
        .catch((error) => {
            console.error('데이터 가져오기 오류:', error);
            setIsLoading(false);
        }); 
    },[storemembers]);

     // 페이지네이션 설정
     const PER_PAGE = 10;
     const pageCount = Math.ceil(filtered.length / PER_PAGE);
 
     const handlePageChange = ({selected}) => {
         setCurrentPage(selected);
        
         window.scrollTo(0,320); // 페이지 변경 시 스크롤 맨 위로 이동
     };
    
    //검색
    const maxSearchLength = 30;
    const [keyword, setKeyword] = useState('');
    const [searchType, setSearchType] = useState('');
    const [selectStatus, setSelectStatus] = useState('');
    const [specificStartDate, setSpecificStartDate] = useState('');  // specific
    const [specificEndDate, setSpecificEndDate] = useState('');      // specific
  
  

    const handleToday=()=>{
        const today = new Date().toISOString().split('T')[0];
        setSpecificStartDate(today);
        setSpecificEndDate(today);
        console.log(specificStartDate,specificEndDate )
    }
    const handleWeek = () => {
        const today = new Date();
        const oneWeekAgo = new Date(today);
        oneWeekAgo.setDate(today.getDate() - 7);

        setSpecificStartDate(oneWeekAgo.toISOString().split('T')[0]);
        setSpecificEndDate(today.toISOString().split('T')[0]);
        console.log(specificStartDate,specificEndDate )

    }
    const handleMonth = () => {
        const today = new Date();
        const oneMonthAgo = new Date(today);
        oneMonthAgo.setMonth(today.getMonth() - 1);

        setSpecificStartDate(oneMonthAgo.toISOString().split('T')[0]);
        setSpecificEndDate(today.toISOString().split('T')[0]);
        console.log(specificStartDate,specificEndDate )

    }

    const handleHalfYear = () => {
        const today = new Date();
        const sixMonthsAgo = new Date(today);
        sixMonthsAgo.setMonth(today.getMonth() - 6);

        setSpecificStartDate(sixMonthsAgo.toISOString().split('T')[0]);
        setSpecificEndDate(today.toISOString().split('T')[0]);
        console.log(specificStartDate,specificEndDate )

    }

    const handleSelectStatus =(e)=>{ 
        setSelectStatus(e.target.value); 
        console.log(e.target.value)
    }
    const handleEnter =(e)=>{ 
        if (e.key === "Enter") handleSearch();
    }
    const handleSearchType =(e)=>{ 
        setSearchType(e.target.value);
    }
    const handleKeywordChange =(e)=>{  
        if (e.target.value.length > maxSearchLength) {
            e.preventDefault();
        } else {
            setKeyword(e.target.value);
        }
    }

    const handleDateChange = (e, setDate, isStartDate) => {
        const today = new Date().toISOString().split('T')[0];
        const newDate = e.target.value;
    
        if(newDate === ''){
            setDate(newDate);
            return;
        }

        if (newDate > today) {
            alert("날짜는 오늘 이후로 설정할 수 없습니다.");
            return;
        }
    
        if (isStartDate && newDate > specificEndDate && specificEndDate !== '') {
            alert("시작일은 종료일보다 이후일 수 없습니다.");
            return;
        }
    
        if (!isStartDate && newDate < specificStartDate && specificStartDate !== '') {
            alert("종료일은 시작일보다 이전일 수 없습니다.");
            return;
        }
    
        setDate(newDate);
    };

    const handleSearch = () => {
        const today = new Date().toISOString().split('T')[0];
    
        if ((specificStartDate === '' || specificEndDate === '') && (searchType === '' && selectStatus === '')) {
            alert("적어도 하나의 검색 조건을 설정하세요!");
            return;
        }
        if (searchType !== '' && keyword === '' && selectStatus==='' && specificStartDate === '' && specificEndDate === '') {
            alert("검색어를 입력하세요");
            return;
        }
        if ((specificStartDate !== '' && specificEndDate === '') || (specificStartDate === '' && specificEndDate !== '')) {
            alert("검색기간을 확인하세요.");
            return;
        }
        if (specificEndDate > today) {
            alert("종료일은 오늘 날짜를 초과할 수 없습니다.");
            return;
        }
        if (specificStartDate > specificEndDate) {
            alert("시작일은 종료일보다 이후일 수 없습니다.");
            return;
        }
    
        // 검색 
        const params = {};

        if (searchType && keyword) {
            params[searchType] = keyword;
        }
        if (selectStatus) {
            params.logStatus = selectStatus;
        }
        if (specificStartDate && specificEndDate) {
            params.specificStartDate = specificStartDate;
            params.specificEndDate = specificEndDate;
        }
    
        axios.get(`${BaseUrl()}/adminlog/search`, { params })
            .then((resp) => {
                setFiltered(resp.data);
                setIsLoading(false);
            })
            .catch((error) => {
                console.error('검색 오류:', error);
                setIsLoading(false);
            });
        
    };

    const handleReset=()=>{
        setSearchType("");
        setKeyword("");
        setSelectStatus("");
        setSpecificStartDate("");
        setSpecificEndDate("");
        setFiltered(loglist);
    }
    return(

    <div className={styles.container}>
        <div className={styles.member_info}>
            {/* 
                검색 : 이름, 아이디, 검색
                검색 : 기간 검색 (특정기간 검색, 오늘, 1주, 1개월, 3개월 검색)
            */}
            <div className={styles.coltitle}>
                <div className={styles.coltitle_row}>
                    <div className={styles.column}>
                        검색
                    </div>
                    <div className={styles.inputBox1}>
                        <div className={styles.select1}>
                            <select className={styles.typeBox} name="searchType" id="searchType" onChange={handleSearchType} value={searchType}>
                                <option value="">검색 유형</option>
                                <option value="empName">이름</option>
                                <option value="empId">아이디</option>
                            </select>
                            <input className={styles.typeInput} type="text" id="keyword" name="keyword" autoComplete="off" onKeyDown={handleEnter} onChange={handleKeywordChange} value={keyword}></input>
                        </div>
                    </div>
                    
                </div>
                <div className={styles.coltitle_row}>
                    <div className={styles.column}>
                        
                    </div>
                    <div className={styles.inputBox1}>
                        <div className={styles.select1}>
                            <select className={styles.selectStatus} name='selectStatus' id="selectStatus" onChange={handleSelectStatus} value={selectStatus}>
                                <option value="">로그 상태</option>
                                <option value="로그인 성공">로그인 성공</option>
                                <option value="로그인 실패">로그인 실패</option>
                            </select>
                        </div>
                    </div>
                </div>
               
                <div className={styles.coltitle_row}>
                    <div className={styles.column}>기간</div>
                    <div className={styles.inputBox}>
                        <div className={styles.dateBox}>
                            <input type="date" name="specificStartDate" placeholder="시작일"  value={specificStartDate}     
                                onChange={(e) => handleDateChange(e, setSpecificStartDate, true)} 
                            />
                            <input type="date" name="specificEndDate" placeholder="종료일"  value={specificEndDate} 
                                onChange={(e) => handleDateChange(e, setSpecificEndDate, false)} 
                            />
                        </div>
                        <div className={styles.dateBtn}>
                            <button onClick={handleToday}>오늘</button>
                            <button onClick={handleWeek}>1주</button>
                            <button onClick={handleMonth}>1개월</button>
                            <button onClick={handleHalfYear}>6개월</button>
                        </div>
                    </div>
                </div>
                <div className={styles.BoxBtn}>
                    <button onClick={handleSearch}>검색</button>
                    <button onClick={handleReset}>초기화</button>
                </div>
                

            </div>

        </div>
        <div className={styles.funcBtn}>
            <div className={styles.col_button}>
            </div>
            {/* 이름 검색 필드 */}
            <div className={styles.searchWrapper}>
               
            </div>
        </div>
    
        <div className={styles.body}>
            <div className={styles.tableWrapper}>
                <table className={styles.table}>
                    <thead className={styles.thead}>
                        <tr>
                            <td className={styles.theadtd}>접속시간</td>
                            <td className={styles.theadtd}>아이디</td>
                            <td className={styles.theadtd}>이름 (부서)</td>
                            <td className={styles.theadtd}>로그 상태</td>
                            <td className={styles.theadtd}>접속IP</td>
                        </tr>
                    </thead>
                    <tbody className={styles.tbody}>               
                        {isLoading ? (
                            <tr className={styles.loading}><Loader content="글 목록을 불러오는 중입니다.." vertical /></tr>
                        ) : ((filtered.length === 0) ? (
                            <tr>
                                <td colSpan="5" className={styles.loading}>검색 결과가 없습니다.</td>
                            </tr>
                            // <div className={styles.loading}>해당 게시판의 글이 없습니다.</div>
                        ) : (
                                // filtered.length > 0 ? (
                                    filtered.slice(currentPage * PER_PAGE, (currentPage +1) * PER_PAGE).map((log, i) => (
                                        <tr key={i}>
                                            <td className={styles.theadtd}>{log.localLogTime ? format(new Date(log.localLogTime), 'yyyy.MM.dd HH:mm:ss') : '날짜 없음'}</td>
                                            
                                            <td className={styles.theadtd}>{log.empId === null ? "알 수 없음" : log.empId}</td>
                                            <td className={styles.theadtd}>{log.empName === null ? "알 수 없음" : log.empName}({deptName(log.deptCode)=== "미정" ? "알 수 없음":deptName(log.deptCode) })</td>
                                            
                                            <td className={styles.theadtd} style={{color: log.logStatus === "로그인 성공" ? 'green' : 'red'}}>{log.logStatus}</td>
                                            <td className={styles.theadtd}>{log.clientIp}</td>
                                        </tr>
                                    )
                                // )
                            )
                            // : (
                            //     <tr>
                            //         <td colSpan="7" className={styles.noData}>검색 결과가 없습니다.</td>
                            //     </tr>
                            // )
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

    {/* <Modal isOpen={isModalOpen} onClose={closeModal}>
            <div className={styles.modalForm}>
                <ModalAdd checkedMems={modalMems}  resetCheckboxes={resetCheckboxes} isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen}/>
            </div>
    </Modal>  */}
  </div>
    )
}