import { Pagination } from 'rsuite';
import styles from './Loglist.module.css';
import { FaSearch } from 'react-icons/fa';
import { useState } from 'react';
import { useMemStore } from '../../../../../../store/store';

export const Loglist=()=>{

    const {storemembers, setstoremembers} = useMemStore();
    const [loglist, setLoglist] = useState([]);
    const [filtered, setFiltered] = useState(loglist);

    // // 서버에서 팝업공지글들 가져옴
    // useEffect(()=>{
    //     axios.get(`${BaseUrl()}/adminpopup`).then((resp)=>{
    //         setPoplist(resp.data);
    //         setFiltered(resp.data);
    //         setstoremembers(false);
    //         setIsLoading(false);
    //         console.log(resp.data)
    //     });

        
    // },[storemembers]);

    
    //검색
    const maxSearchLength = 30;
    const [keyword, setKeyword] = useState('');
    const [searchType, setSearchType] = useState('');
    const [specificStartDate, setSpecificStartDate] = useState('');  // specific
    const [specificEndDate, setSpecificEndDate] = useState('');      // specific
  
    const handleEnter =()=>{}
    const handleSearchType =(e)=>{  setSearchType(e.target.value);}
    const handleKeywordChange =(e)=>{ setKeyword(e.target.value)}

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

    const handleSearch =()=>{    }
    const handleReset=()=>{
        setSearchType("");
        setKeyword("");
        setSpecificStartDate("");
        setSpecificEndDate("");
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
                    <div className={styles.column}>검색</div>
                    <div className={styles.inputBox}>
                        <select className={styles.typeBox} name="searchType" id="searchType" onChange={handleSearchType} value={searchType}>
                            <option value="">검색 유형</option>
                            <option value="title">ID</option>
                            <option value="writer">이름</option>
                        </select>
                        <input className={styles.typeInput} type="text" id="keyword" name="keyword" autoComplete="off" onKeyDown={handleEnter} onChange={handleKeywordChange} value={keyword}></input>
                    </div>
                </div>
                
                <div className={styles.coltitle_row}>
                    <div className={styles.column}>기간</div>
                    <div className={styles.inputBox}>
                        <div className={styles.dateBox}>
                            <input type="date" name="specificStartDate" placeholder="시작일"  value={specificStartDate} onChange={(e) => setSpecificStartDate(e.target.value) }/>
                            <input type="date" name="specificEndDate" placeholder="종료일"  value={specificEndDate} onChange={(e) => setSpecificEndDate(e.target.value)}/>
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
                            <td className={styles.theadtd}>이름</td>
                            <td className={styles.theadtd}>부서 </td>
                            <td className={styles.theadtd}>로그정보</td>
                            <td className={styles.theadtd}>접속IP</td>
                        </tr>
                    </thead>
                    <tbody className={styles.tbody}>
                        <tr>
                            <td className={styles.theadtd}>접속시간</td>
                            <td className={styles.theadtd}>아이디</td>
                            <td className={styles.theadtd}>이름</td>
                            <td className={styles.theadtd}>부서 </td>
                            <td className={styles.theadtd}>로그정보</td>
                            <td className={styles.theadtd}>접속IP</td>
                        </tr>
                    </tbody>
                </table>
            </div>            

    </div>
    {/* <div className={styles.pagination}>
     {/* 페이지네이션 */}
     {/* {pageCount > 0 && (
        <Pagination
        pageCount={pageCount}
        onPageChange={handlePageChange}
        currentPage={currentPage}
        />
        )}
    </div> */}

    {/* <Modal isOpen={isModalOpen} onClose={closeModal}>
            <div className={styles.modalForm}>
                <ModalAdd checkedMems={modalMems}  resetCheckboxes={resetCheckboxes} isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen}/>
            </div>
    </Modal>  */}
  </div>
    )
}