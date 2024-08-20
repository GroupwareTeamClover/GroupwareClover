import { useNavigate } from "react-router-dom";
import styles from './AddMember.module.css';
import { useEffect, useRef, useState } from "react";
import axios from 'axios';
import { Modal } from "../../../../../../../components/Modal/Modal";
import { ModalAdd } from "./ModalAdd/ModalAdd";
import { BaseUrl } from "../../../../../../../commons/config";
import { useMemStore } from "../../../../../../../store/store";
import {Pagination} from '../../../../../../../components/Pagination/Pagination';
import {format} from 'date-fns';
import { FaSearch } from "react-icons/fa";
import { Loader } from "rsuite";


export const AddMember = ()=>{

    const navi = useNavigate();
    const {storemembers, setstoremembers} = useMemStore();
    const [waitingNum, setWaitingNum] = useState();
    const [finishNum, setFinishNum] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [newMem, setNewMem] = useState([{ }]);
    const [filtered, setFiltered] = useState(newMem);
    const [modalMems, setModalMems] = useState([]); // 모달에 전달할 props 설정.
    const [checkedMems, setCheckedMems] = useState([]); // 체크박스 
    const [isLoading, setIsLoading] = useState(true);



    // axios로 출력받기 emp table - joindate가 이번달인 사람들....  
    useEffect(()=>{
        axios.get(`${BaseUrl()}/adminaddmem`).then((resp)=>{
            console.log(resp.data)
            setNewMem(resp.data);
            setFiltered(resp.data);
            setstoremembers(false);
            setIsLoading(false);
            setKeyword("")

            // empStateCode가 1인 갯수(승인완료)
            const countState1 = resp.data.filter(mem => mem.empStateCode !== 0).length;
            console.log("승인완료된거 : "+countState1)
            setFinishNum(countState1);
            // empStateCode가 0인 갯수(승인대기)
            const countState0 = resp.data.filter(mem => mem.empStateCode === 0).length;
            setWaitingNum(countState0);
        })
    },[storemembers])

    // Pagingation
    const PER_PAGE = 10; // 한 페이지에 보여줄 목록 수 
    const pageCount = Math.ceil(filtered.length / PER_PAGE); // (총 갯수 / PER_PAGE) = 페이지 몇 개 나올지 계산  
    
    const checkboxRef = useRef([]);
    const allCheckRef = useRef(null);

    const handlePageChange = ({selected}) => {
        setCurrentPage(selected);
        setCheckedMems([]); // 체크박스 상태 초기화
        // 전체 체크박스 해제
        if (allCheckRef.current) {
            allCheckRef.current.checked = false;
        }
        checkboxRef.current.forEach(checkbox => {
            if (checkbox) {
                checkbox.checked = false; // 체크박스 해제
            }
        });
        window.scrollTo(0,320); // 페이지 변경 시 스크롤 맨 위로 이동
    };

    // 전체 체크박스 클릭 처리
    const handleCheckAll = (e) => {
        const checked = e.target.checked;
    
        const enabledValues = filtered
            .slice(currentPage * PER_PAGE, (currentPage + 1) * PER_PAGE)
            .map(mem => mem.EMP_SEQ);
    
        checkboxRef.current.forEach((checkbox, i) => {
            const mem = filtered[i + currentPage * PER_PAGE];
            if (checkbox && mem.EMP_STATE_NAME !== '가입대기') {
                checkbox.checked = checked;
            }
        });
    
        setCheckedMems(checked ? enabledValues.filter((empSeq, i) => {
            const mem = filtered[i + currentPage * PER_PAGE];
            return mem.EMP_STATE_NAME !== '가입대기';
        }) : []);
    };

    // 개별 체크박스 클릭 처리
    const handleCheckBox = (e) => {
        const {value, checked} = e.target;
        setCheckedMems(prev => {
            if(checked){
                return [...prev, value];
            } else {
                return prev.filter(prev => prev != value); 
            }
        });
    };

    // 체크박스 리셋
    const resetCheckboxes = () => {
        setCheckedMems([]); // 선택된 체크박스 초기화
        allCheckRef.current.checked = false; // 전체 선택 체크박스 해제
        checkboxRef.current.forEach(checkbox => {
            if (checkbox) {
                checkbox.checked = false; // 개별 체크박스 해제
            }
        });
    };
   


    // 모달))----------------------------------------------------
    const [ isModalOpen, setIsModalOpen ] = useState(false);
    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    // 승인버튼 클릭 (체크한 사원들 변경)
    const handleModalChange = () => {
        if (checkedMems.length !== 0) {
            setModalMems(checkedMems);  // 선택된 사원들을 모달에 전달할 리스트에 저장
            openModal();  // 모달 열기
        } else {
            alert("변경할 사원을 선택해주세요.");
        }
    };
    // 대기중 버튼 클릭했을때 (사원 하나만 변경)
    const handleModalSelect = (empSeq) => {
        setModalMems([empSeq]);  // 선택된 사원만 모달에 전달할 리스트에 저장
        openModal();  // 모달 열기
        resetCheckboxes();
    };
   
    // -----------------------------------------------------------
    // 사원이름 검색
    const [keyword, setKeyword] = useState('');

    const handleSearch = () => {
        if (keyword === "") {
            // 검색어가 빈 문자열일 때 필터링된 데이터를 원본 데이터로 리셋
            setFiltered(newMem);
        } else {
            // 검색어가 있는 경우 필터링
            let result = newMem.filter((data) => data.empName.includes(keyword));
            setFiltered(result);
            }
        
        setCurrentPage(0);
        
    };
    
    return(
        <div className={styles.container}>
            <div className={styles.member_info}>
                {/* emp table에서 state가 0인 사람 갯수. select count(state) from emp where state=0; */}
                <div className={styles.member_total}>
                    <div className={styles.member_emoji}>
                    👥
                    </div>
                    <div className={styles.member_box}>
                        승인대기중  : {waitingNum} 명
                        <div className={styles.member_complete}>이번 달 승인완료 : {finishNum} 명 </div>
                    </div>
                </div>
            </div>
            <div className={styles.funcBtn}>
                <div className={styles.col_button}>
                    <button className={styles.addBtn} onClick={handleModalChange} name='ModalForm' >승인</button>
                </div>
                {/* 이름 검색 필드 */}
                <div className={styles.searchWrapper}>
                    <input
                        type="text"
                        placeholder=" 사원 이름 검색"
                        name="empName"
                        value={keyword} 
                        onChange={(e) => setKeyword(e.target.value)} // 상태 업데이트
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                handleSearch();
                            }
                        }}
                        className={styles.searchInput}
                    />
                    <button onClick={handleSearch}>
                        <FaSearch className={styles.searchLogo} />
                    </button>
                </div>
            </div>
        
            <div className={styles.body}>
                <div className={styles.tableWrapper}>
                    <table className={styles.table}>
                        <thead className={styles.thead}>
                            <tr>
                                <td className={styles.theadtd}><input type="checkbox" name='checkedAll' onClick={handleCheckAll} ref={allCheckRef}></input></td>
                                <td className={styles.theadtd}>이름</td>
                                <td className={styles.theadtd}>부서</td>
                                <td className={styles.theadtd}>직위</td>
                                <td className={styles.theadtd}>사용자그룹 </td>
                                <td className={styles.theadtd}>가입날짜</td>
                                <td className={styles.theadtd}>상태</td>
                            </tr>
                        </thead>
                        <tbody className={styles.tbody}>
                            {/* 데이터영역 */}
                            {isLoading ? (
                    <tr className={styles.loading}><Loader content="글 목록을 불러오는 중입니다.." vertical /></tr>
                ) : ((filtered.length === 0) ? (
                        <tr>
                            <td colSpan="7" className={styles.noData}>검색 결과가 없습니다.</td>
                        </tr>
                ) : (
                          
                            filtered.length > 0 ? (
                                filtered.slice(currentPage * PER_PAGE, (currentPage +1) * PER_PAGE).map((mem, i) => (
                                    <tr key={i}>
                                            <td className={styles.theadtd}>
                                                {mem.empStateCode ===0 ? (
                                                    <input type="checkbox" name="emp_seq" value={mem.empSeq} onClick={handleCheckBox} ref={data=> checkboxRef.current[i]=data}></input>
                                                ) : (
                                                    <input type="checkbox" disabled></input>
                                                    )
                                                }
                                            </td>
                                            <td className={styles.theadtd}>
                                                {mem.empName} 
                                                ({mem.empBirth}-{mem.empGender})
                                            </td>
                                            <td className={styles.theadtd}>
                                                {
                                                    mem.deptCode === 1 ? '총무' : 
                                                    mem.deptCode === 2 ? '인사' : 
                                                    mem.deptCode === 3 ? '사무' : 
                                                    mem.deptCode === 4 ? '유통' : 
                                                    mem.deptCode === 5 ? '경영' : '미정'
                                                } 
                                            </td>
                                            <td className={styles.theadtd}>
                                                {
                                                    mem.roleCode === 1 ? '사장' :
                                                    mem.roleCode === 2 ? '부사장' :
                                                    mem.roleCode === 3 ? '이사' :
                                                    mem.roleCode === 4 ? '부장' :
                                                    mem.roleCode === 5 ? '차장' :
                                                    mem.roleCode === 6 ? '과장' :
                                                    mem.roleCode === 7 ? '대리' :
                                                    mem.roleCode === 8 ? '사원' :
                                                    mem.roleCode === 9 ? '인턴' : 
                                                    mem.roleCode === 99 ? '미정' : '알수없음'
                                                } 
                                            </td>
                                            <td className={styles.theadtd}>
                                                {
                                                    mem.workerStateCode === 0 ? '관리자' :
                                                    mem.workerStateCode === 1 ? '정규직' :
                                                    mem.workerStateCode === 2 ? '비정규직' :
                                                    mem.workerStateCode === 3 ? '계약직' : '미정'
                                                } 
                                            </td>
                                            <td className={styles.theadtd}>
                                                {mem.joinDate ? format(new Date(mem.joinDate), 'yyyy.MM.dd') : '날짜 없음'}
                                            </td>
                                            <td className={styles.theadtd}> 
                                                {mem.empStateCode ===0  ? (
                                                        <button className={styles.statusBtn} onClick={() => handleModalSelect(mem.empSeq)} > 대기중 </button> 
                                                    ) : (
                                                        <button className={styles.statusBtn2}> 승인완료 </button> 
                                                    )
                                                }
                                            </td>
                                        </tr>
                                    ))
                                ) : (
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

        <Modal isOpen={isModalOpen} onClose={closeModal}>
                <div className={styles.modalForm}>
                    <ModalAdd checkedMems={modalMems}  resetCheckboxes={resetCheckboxes} isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen}/>
                </div>
        </Modal>
      </div>
    )
}