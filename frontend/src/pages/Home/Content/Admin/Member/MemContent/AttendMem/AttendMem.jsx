import styles from './AttendMem.module.css'
import React, {useEffect, useState} from "react";
import axios from "axios";
import {BaseUrl} from "../../../../../../../commons/config";
import {Pagination} from "../../../../../../../components/Pagination/Pagination";
import {Modal} from "../../../../../../../components/Modal/Modal";
import {dateYMD, workTime} from "../../../../../../../commons/common";

export const AttendMem = () =>{
  let today = new Date();
  let year = today.getFullYear();
  let month = ('0' + (today.getMonth() + 1)).slice(-2);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const [date, setDate] = useState({ year, month});

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
    axios.get(`${BaseUrl()}/attendance/members/${select}/${date.year}-${date.month}`).then(res => {
      setEmployees(res.data);
      setFiltered(res.data);
    });
  }, [select, date]);

  /** 페이지네이션 설정 **/
  const [currentPage, setCurrentPage] = useState(0);
  const [filtered, setFiltered] = useState(employees);
  const PER_PAGE = 10;
  const pageCount = Math.ceil(filtered.length / PER_PAGE);
  const handlePageChange = ({selected}) => {
    setCurrentPage(selected);
    window.scrollTo(0,320); // 페이지 변경 시 스크롤 맨 위로 이동
  };

  /** 날짜 변환 **/
  const handleDateChange = (e) => {
    const target = e.target.name;
    if (target === "prev") {
      setDate(prev => {
        const currentMonth = parseInt(prev.month, 10); // 숫자로 변환
        const newMonth = currentMonth === 1 ? 12 : currentMonth - 1;
        const newYear = currentMonth === 1 ? prev.year - 1 : prev.year;
        return {
          ...prev,
          year: newYear,
          month: String(newMonth).padStart(2, '0') // 다시 문자열로 변환
        };
      });
    } else if (target === "next") {
      if (date.year === year && date.month === month) return false;
      setDate(prev => {
        const currentMonth = parseInt(prev.month, 10); // 숫자로 변환
        const newMonth = currentMonth === 12 ? 1 : currentMonth + 1;
        const newYear = currentMonth === 12 ? prev.year + 1 : prev.year;
        return {
          ...prev,
          year: newYear,
          month: String(newMonth).padStart(2, '0') // 다시 문자열로 변환
        };
      });
    }
  }

  const [attendanceList, setAttendanecList] = useState([
    {attSeq: 0, empSeq: 0, attArrive: "", attLeave: "", attTotal: 0, attSuccess: "", attDate: ""}
  ]);
  const handleAttDetail = (empSeq) => {
    axios.get(`${BaseUrl()}/attendance/${empSeq}/${date.year}-${date.month}`).then(res => {
      if (res.data !== "" && res.data !== null && res.data !== undefined) {
        setAttendanecList(res.data.list);
      }
    });
    openModal();
  }

  return (
    <div className={styles.container}>
      <div className={styles.date}>
        <button name="prev" onClick={handleDateChange}> 〈</button>
        <p>{date.year}-{date.month} 근태 현황</p>
        <button name="next" onClick={handleDateChange}> 〉</button>
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
        </div>

      </div>

      <div className={styles.body}>
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead className={styles.thead}>
            <tr>
              <td className={styles.theadtd}>No.</td>
              <td className={styles.theadtd}>이름 / 직급 / 부서</td>
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
                    <td className={styles.theadtd} onClick={() => handleAttDetail(item.empSeq)}>
                      {item.empName} / {item.roleName} /  {item.deptName}
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

      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <div className={styles.outsideWork}>
          {attendanceList.length !== 0 ?
            attendanceList.map(item => {
              return (
                <div className={styles.outsideContent}>
                  <p>{dateYMD(item.attDate)}</p>
                  <p>{item.attArrive} ~ {item.attLeave}</p>
                  <p> ({workTime(item.attTotal)}) </p>
                </div>
              );
            })
            :
            <div className={styles.noWork}>
              근무 내용 없음
            </div>
          }
        </div>
      </Modal>
    </div>
  );
}
