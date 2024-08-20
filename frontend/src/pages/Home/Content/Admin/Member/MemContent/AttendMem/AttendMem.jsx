import styles from './AttendMem.module.css'
import {FaSearch} from "react-icons/fa";
import React, {useEffect, useState} from "react";
import axios from "axios";
import {BaseUrl} from "../../../../../../../commons/config";
import {Pagination} from "../../../../../../../components/Pagination/Pagination";

export const AttendMem = () =>{
  let today = new Date();
  let year = today.getFullYear();
  let month = ('0' + (today.getMonth() + 1)).slice(-2);

  /** 부서 선택 **/
  const [select, setSelect] = useState(0);
  const handleSelect = (e) => {
    setSelect(e.target.value);
    setCurrentPage(0);
  }

  /** 검색 **/
  const searchData = (e) => {
    setFiltered(employees);
    setFiltered(prev => {
      return prev.filter(item => {
        return item.empName.includes(e.target.value);
      })
    })
  }

  /** 선택된 부서 한달 근태 현황 **/
  const [employees, setEmployees] = useState([]);
  useEffect(() => {
    axios.get(`${BaseUrl()}/attendance/members/${select}/${year}-${month}`).then(res => {
      console.log("res.data ==== ", res.data);
      setEmployees(res.data);
      setFiltered(res.data);
    });
  }, [select]);

  /** 페이지네이션 설정 **/
  const [currentPage, setCurrentPage] = useState(0);
  const [filtered, setFiltered] = useState(employees);
  const PER_PAGE = 10;
  const pageCount = Math.ceil(filtered.length / PER_PAGE);
  const handlePageChange = ({selected}) => {
    setCurrentPage(selected);
    window.scrollTo(0,320); // 페이지 변경 시 스크롤 맨 위로 이동
  };

  return (
    <div className={styles.container}>
      <div className={styles.date}>
        <button> 〈</button>
        <p>2024-08 근태 현황</p>
        <button> 〉</button>
      </div>
      <div className={styles.funcBtn}>
        <div className={styles.col_button}>
        </div>
        <div className={styles.searchBox}>
          <select name="searchType" className={styles.typeBox} id="searchType" onChange={handleSelect} value={select}>
            <option value="0">전체부서</option>
            <option value="1">총무</option>
            <option value="2">인사</option>
            <option value="3">사무</option>
            <option value="4">유통</option>
            <option value="5">경영</option>
            <option value="99">미정</option>
          </select>
          <input type="text" id="keyword" name="keyword" onChange={searchData} placeholder="이름을 입력하세요"></input>
          {/*<button onClick={handleSearch}><FaSearch className={styles.searchLogo} /></button>*/}
        </div>

      </div>

      <div className={styles.body}>
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead className={styles.thead}>
            <tr>
              <td className={styles.theadtd}>No.</td>
              <td className={styles.theadtd}>부서 / 이름 / 직급</td>
              <td className={styles.theadtd}>출근일수</td>
              <td className={styles.theadtd}>지각</td>
              <td className={styles.theadtd}>결석</td>
              <td className={styles.theadtd}>총 근무시간</td>
            </tr>
            </thead>
            <tbody className={styles.tbody}>
            {
              filtered.slice(currentPage * PER_PAGE, (currentPage +1) * PER_PAGE).map((item, i) => {
                return (
                  <tr key={i}>
                    <td className={styles.theadtd}>
                      {item.empSeq}
                    </td>
                    <td className={styles.theadtd}>
                      {item.deptName} / {item.empName} / {item.roleName}
                    </td>
                    {
                      item.attCount.work_day === 0 ?
                        <>
                          <td className={styles.theadtd}>
                            -
                          </td>
                          <td className={styles.theadtd}>
                            -
                          </td>
                          <td className={styles.theadtd}>
                            -
                          </td>
                          <td className={styles.theadtd}>
                            -
                          </td>
                        </>
                        :
                        <>
                          <td className={styles.theadtd}>
                            {item.attCount.work_day}
                          </td>
                          <td className={styles.theadtd}>
                            {item.attCount.work_late}
                          </td>
                          <td className={styles.theadtd}>
                            {item.attCount.work_day - item.attCount.work_success}
                          </td>
                          <td className={styles.theadtd}>
                            {Math.floor(item.attCount.work_total_time / 60) === 0 ? "" : Math.floor(item.attCount.work_total_time / 60) + "시간 "}
                            {item.attCount.work_total_time % 60 + "분"}
                          </td>
                        </>
                    }
                  </tr>
                );
              })
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
  );
}
