import styles from './MemMain.module.css';
import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { Modal } from '../../../../../../../components/Modal/Modal';
import { ModalPosition } from './ModalPosition/ModalPosition';
import {BaseUrl} from '../../../../../../../commons/config';
import { ModalDelete } from './ModalDelete/ModalDelete';
import { useMemStore } from '../../../../../../../store/store';
import {Pagination} from '../../../../../../../components/Pagination/Pagination';
import { FaSearch } from 'react-icons/fa';
import { Loader } from 'rsuite';
import { smallAlert } from '../../../../../../../commons/common';

export const MemMain = () => {
    // 8/8(목)

    const {storemembers, setstoremembers} = useMemStore();

    const [status, setStatus] = useState({status:''});
    const [members, setMembers] = useState([]);
    const [filtered, setFiltered] = useState(members);
    const [countMem, setCountMem] = useState([{COUNT:0, EMP_STATE_CODE:0}])
    const [checkedMems, setCheckedMems] = useState([]);
    const [currentPage, setCurrentPage] = useState();
    const [isLoading, setIsLoading] = useState(true);

    // select 4가지 useState("100")으로 설정해주기
    const [deptCode, setDeptCode] = useState("100");
    const [roleCode, setRoleCode] = useState("100");
    const [workerStateCode, setWorkerStateCode] = useState("100");
    const [empStateCode, setEmpStateCode] = useState("100");
    //
    const [deptName, setDeptName] = useState([]);
    const [roleName, setRoleName] = useState([]);
    const [workName, setWorkName] = useState([]);
    const [empState, setEmpState] = useState([]);


    // 사원 수 출력 함수
    const processCountData = (data) => {
        const counts = { prev: 0, normal: 0, rest: 0, stop: 0, out: 0 };
        data.forEach(item => {
            switch(item.EMP_STATE_CODE) {
                case 0:  // 가입대기
                    counts.prev = item['COUNT'];
                    break;
                case 1:  // 재직중 (정상1)
                    counts.normal = item['COUNT'];
                    break;
                case 2:  // 퇴사
                    counts.out = item['COUNT'];
                    break;
                case 3:  // 휴직 (정상2)
                    counts.rest = item['COUNT'];
                    break;
                default:
                    break;
            }
        });

        return counts;
    };

 
    // 서버에서 데이터를 가져옴
    useEffect(()=>{
        axios.get(`${BaseUrl()}/adminmember`).then((resp)=>{
            setMembers(resp.data);
            setFiltered(resp.data);
            setstoremembers(false);
            setIsLoading(false);
            console.log(resp.data)
        });
    },[storemembers]);

      // 서버에서 부서코드-이름 데이터를 가져옴
      useEffect(()=>{
        axios.get(`${BaseUrl()}/adminmember/deptName`).then((resp)=>{
            setDeptName(resp.data);
            setIsLoading(false);
            console.log(resp.data)
        });
    },[]);
    useEffect(()=>{
        axios.get(`${BaseUrl()}/adminmember/roleName`).then((resp)=>{
            setRoleName(resp.data);
            setIsLoading(false);
            console.log(resp.data)
        });
    },[]);
    useEffect(()=>{
        axios.get(`${BaseUrl()}/adminmember/workName`).then((resp)=>{
            setWorkName(resp.data);
            setIsLoading(false);
            console.log(resp.data)
        });
    },[]);
    useEffect(()=>{
        axios.get(`${BaseUrl()}/adminmember/empState`).then((resp)=>{
            setEmpState(resp.data);
            setIsLoading(false);
            console.log(resp.data)
        });
    },[]);

    // 서버에서 사원 수 데이터를 가져옴
    useEffect(()=>{
        axios.get(`${BaseUrl()}/adminmember/countmem`).then((resp)=>{
            const processedData = processCountData(resp.data);
            setCountMem(processedData);
            setstoremembers(false);
            console.log(resp.data);
        });
    },[storemembers]);

    const checkboxRef = useRef([]);
    
    // 페이지네이션 설정
    const PER_PAGE = 10;
    const pageCount = Math.ceil(filtered.length / PER_PAGE);
    
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
            if (checkbox && mem.empStateCode !== 0) {
                checkbox.checked = checked;
            }
        });
    
        setCheckedMems(checked ? enabledValues.filter((EMP_SEQ, i) => {
            const mem = filtered[i + currentPage * PER_PAGE];
            return mem.empStateCode !== 0;
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

    // 모달 설정 -------------------------------------------------
    const [modalState, setModalState] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    // 모달 select 설정 처리
    const handleSelectChange = (e) => {
        const {name, value} = e.target;
        setStatus(prev =>({...prev, [name]:value}));
    };

    // 모달 변경 버튼 클릭 시
    const handleModalChange = (e) => {
        const modalName = e.target.value;
        setModalState(modalName);
        if (modalName !== '' && checkedMems.length !== 0) {
            openModal();
        } else if(modalName !=='' && checkedMems.length === 0){
            smallAlert("변경할 사원을 선택해주세요.");
        } else if(modalName ==='' && checkedMems.length !== 0){
            smallAlert("상태변경을 선택해주세요.");
        }
    };


    // 상태변경 옵션 조건부 렌더링
    const renderStatusOptions = () => {
        const hasRetired = checkedMems.some(memSeq => {
            const mem = members.find(m => m.EMP_SEQ == memSeq);
            return mem && mem.EMP_STATE_CODE === 2; // empStateCode가 2인 직원 (퇴사자) 확인
        });

        if (hasRetired) {
            return (
                <option value="계정상태변경">계정상태변경</option>
            );
        } else {
            return (
                <>
                    <option value="부서변경">부서변경</option>
                    <option value="직위변경">직위변경</option>
                    <option value="사용자그룹변경">사용자그룹변경</option>
                    <option value="계정상태변경">계정상태변경</option>
                </>
            );
        }
    };


    // 이름 검색 handleNameSearch
    const [keyword, setKeyword]=useState('');
    const handleNameSearch =() =>{
        if (keyword === "") {
            // 검색어가 빈 문자열일 때 필터링된 데이터를 원본 데이터로 리셋
            setFiltered(members);
            setDeptCode("100");
            setRoleCode("100");
            setWorkerStateCode("100");
            setEmpStateCode("100");
            empNameRef.current.value = '';
        } else {
            // 검색어가 있는 경우 필터링
            let result = members.filter((data) => data.EMP_NAME.includes(keyword));
            setFiltered(result);
            setDeptCode("100");
            setRoleCode("100");
            setWorkerStateCode("100");
            setEmpStateCode("100");
            // setKeyword("");
            }
        
        setCurrentPage(0);
        
    }


    const empNameRef = useRef(null);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
    
        // 선택한 select의 상태를 업데이트
        if (name === 'deptCode') {
            setDeptCode(value);
        } else if (name === 'roleCode') {
            setRoleCode(value);
        } else if (name === 'workerStateCode') {
            setWorkerStateCode(value);
        } else if (name === 'empStateCode') {
            setEmpStateCode(value);
        }
    
        // input 필드의 값을 초기화
        if (empNameRef.current) {
            empNameRef.current.value = '';
        }
       
        // 필터링을 호출하여 결과를 업데이트
        applyFilters();
    };
    
    // 셀렉트 선택
    const applyFilters = () => {
        // let result = members;
        let result = members.filter((data) => data.EMP_NAME.includes(keyword));;

        // 필터 조건에 따라 데이터 필터링
        if (deptCode !== "100") {
            result = result.filter(data => data.DEPT_CODE === parseInt(deptCode));
        }
        if (roleCode !== "100") {
            result = result.filter(data => data.ROLE_CODE === parseInt(roleCode));
        }
        if (workerStateCode !== "100") {
            result = result.filter(data => data.WORKER_STATE_CODE === parseInt(workerStateCode));
        }
        if (empStateCode !== "100") {
            result = result.filter(data => data.EMP_STATE_CODE === parseInt(empStateCode));
        }
        
        setFiltered(result);
       setCurrentPage(0); // 페이지를 처음으로 이동
       
            
    };

    useEffect(() => {
        applyFilters();
    }, [deptCode, roleCode, workerStateCode, empStateCode, members, ]);
    
    
    
    

    return (
      <div className={styles.container}>
        <div className={styles.member_info}>
            <div className={styles.member_total}>
                전체 사원 수 : {members.length} 명
            </div>
            <div className={styles.member_detail}>
                <div className={styles.count1}>
                    {countMem.normal + countMem.rest}명
                </div>
                <div className={styles.count2}>
                    <span>(재직 {countMem.normal}명   휴직 {countMem.rest}명  /  퇴사 {countMem.out}명</span>) 
                </div>
                <div className={styles.count3waiting}>
                    <p>가입대기 {countMem.prev}명</p>
                </div>
            </div>
        </div>
        <div className={styles.funcBtn}>
            <div className={styles.col_button}>
                {/* <button className={styles.delMemBtn } onClick={handleModalChange} name='ModalForm' value='deleteMem'>가입 승인</button> */}
                <select name='status' onChange={handleSelectChange}>
                    <option value="">상태변경</option>
                    {renderStatusOptions()}
                </select>
                <button className={styles.changeBtn} onClick={handleModalChange} name='ModalForm' value={status.status}>변경</button>
            </div>         
            
            {/* 이름 검색 필드 */}
            <div className={styles.searchWrapper}>
                <input
                    type="text"
                    placeholder=" 사원 이름 검색"
                    name="empName"
                    ref={empNameRef}
                    value={keyword} 
                    onChange={(e) => setKeyword(e.target.value)} // 상태 업데이트
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            handleNameSearch();
                        }
                    }}
                    className={styles.searchInput}
                />
                <button onClick={handleNameSearch}>
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
                                <td className={styles.theadtd}>
                                    <select name='deptCode' value={deptCode} onChange={handleInputChange}>
                                        <option value='100'>부서</option>
                                        {deptName.map(dept =>(
                                            <option key={dept.DEPT_CODE} value={dept.DEPT_CODE}>
                                                {dept.DEPT_NAME}
                                            </option>
                                        ))}
                                    </select>
                                </td>
                                <td className={styles.theadtd}>
                                    <select name='roleCode' value={roleCode} onChange={handleInputChange}>
                                        <option value='100'>직위</option>
                                        {roleName.map(role =>(
                                            <option key={role.ROLE_CODE} value={role.ROLE_CODE}>
                                                {role.ROLE_NAME}
                                            </option>
                                        ))}
                                    </select>   
                                </td>
                                <td className={styles.theadtd}>
                                    <select name="workerStateCode" value={workerStateCode} onChange={handleInputChange}>
                                        <option value='100'>사용자그룹</option>
                                        {workName.map(work =>(
                                            <option key={work.WORKER_STATE_CODE} value={work.WORKER_STATE_CODE}>
                                                {work.WORKER_STATE_NAME}
                                            </option>
                                        ))}
                                    </select>
                                </td>
                                <td className={styles.theadtd}>이메일</td>
                                <td className={styles.theadtd}>
                                    <select name='empStateCode' value={empStateCode} onChange={handleInputChange}>
                                        <option value='100'>계정상태</option>
                                        {empState
                                        .filter(emp => emp.EMP_STATE_NAME !== '가입대기')  
                                        .map(emp =>(
                                            <option key={emp.EMP_STATE_CODE} value={emp.EMP_STATE_CODE}>
                                                {emp.EMP_STATE_NAME}
                                            </option>
                                        ))}
                                        {/* <option value='0'>가입대기</option> */}
                                        {/* <option>휴면</option> */}
                                    </select>
                                </td>
                            </tr>
                        </thead>
                        <tbody className={styles.tbody}>
                     
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
                                      
                                            <input type="checkbox" name="emp_seq" value={mem.EMP_SEQ} onClick={handleCheckBox} ref={data => checkboxRef.current[i] = data}></input>
                                       
                                    </td>
                                    <td className={styles.theadtd}>
                                        {mem.EMP_NAME}
                                    </td>
                                    <td className={styles.theadtd}>
                                        {mem.DEPT_NAME}
                                    {/* {
                                                mem.deptCode === 1 ? '총무' : 
                                                mem.deptCode === 2 ? '인사' : 
                                                mem.deptCode === 3 ? '사무' : 
                                                mem.deptCode === 4 ? '유통' : 
                                                mem.deptCode === 5 ? '경영' : '미정'
                                            }  */}
                                    </td>
                                    <td className={styles.theadtd}>
                                        {mem.ROLE_NAME}
                                    {/* {
                                                mem.roleCode === 1 ? '사장' :
                                                mem.roleCode === 2 ? '부사장' :
                                                mem.roleCode === 3 ? '이사' :
                                                mem.roleCode === 4 ? '부장' :
                                                mem.roleCode === 5 ? '차장' :
                                                mem.roleCode === 6 ? '과장' :
                                                mem.roleCode === 7 ? '대리' :
                                                mem.roleCode === 8 ? '사원' :
                                                mem.roleCode === 9 ? '인턴' : '미정'
                                            }  */}
                                    </td>
                                    <td className={styles.theadtd}>
                                        {mem.WORKER_STATE_NAME}
                                    {/* {
                                                mem.workerStateCode === 0 ? '관리자' :
                                                mem.workerStateCode === 1 ? '정규직' :
                                                mem.workerStateCode === 2 ? '비정규직' :
                                                mem.workerStateCode === 3 ? '계약직' : '미정'
                                            }  */}
                                    </td>
                                    <td className={styles.theadtd}>
                                        {mem.EMP_EMAIL}
                                    </td>
                                    <td className={styles.theadtd}>
                                        {mem.EMP_STATE_NAME}
                                        {/* {
                                        mem.empStateCode === 0 ? '가입대기': 
                                        mem.empStateCode === 1 ? '재직중': 
                                        mem.empStateCode === 2 ? '퇴사':  '알수없음'
                                        } */}
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
                { modalState === status.status &&
                    <ModalPosition modalState={modalState} checkedMems={checkedMems} isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} resetCheckboxes={resetCheckboxes} currentPage={currentPage} setCurrentPage={setCurrentPage} />
                }
            </div>
        </Modal>
      </div>
    );
}
