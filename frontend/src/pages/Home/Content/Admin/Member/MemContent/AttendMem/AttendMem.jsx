import styles from './AttendMem.module.css'
import {FaSearch} from "react-icons/fa";
import React, {useEffect} from "react";

export const AttendMem = () =>{

  useEffect(() => {

  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.date}>
        <button> 〈 </button>
        2024-08 근태 현황
        <button> 〉 </button>
      </div>
      <div className={styles.funcBtn}>
        <div className={styles.col_button}>
        </div>
        <div className={styles.searchBox}>
          <select name="searchType" className={styles.typeBox} id="searchType">
            <option value="0">전체부서</option>
            <option value="1">총무</option>
            <option value="2">인사</option>
            <option value="3">사무</option>
            <option value="4">유통</option>
            <option value="5">경영</option>
            <option value="99">미정</option>
          </select>
          <input type="text" id="keyword" name="keyword" autoComplete="off" placeholder="이름을 입력하세요"></input>
          <button ><FaSearch className={styles.searchLogo}/></button>
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
              <td className={styles.theadtd}>연차</td>
            </tr>
            </thead>
            <tbody className={styles.tbody}>
            <tr>
              <td className={styles.theadtd}>
                27
              </td>
              <td className={styles.theadtd}>
                총무 / 노시온 / 사장
              </td>
              <td className={styles.theadtd}>
                15
              </td>
              <td className={styles.theadtd}>
                3
              </td>
              <td className={styles.theadtd}>
                1
              </td>
              <td className={styles.theadtd}>
                1
              </td>
            </tr>
            </tbody>
          </table>
        </div>
      </div>


    </div>
  );
}
