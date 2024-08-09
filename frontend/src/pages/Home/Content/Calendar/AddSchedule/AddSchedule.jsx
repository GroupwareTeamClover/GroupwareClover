import styles from './AddSchedule.module.css'
import React, {useState} from "react";
import {useMemberStore} from "../../../../../store/store";
import axios from "axios";
import {BaseUrl} from "../../../../../commons/config";

export const AddSchedule = ({ closeModal, setDataChange }) => {

  const { admin } = useMemberStore();

  /**  일정 추가 데이터 **/
  const defaultInputData = {scheduleContent: "", startDate: "", endDate: ""};
  const [inputData, setInputData] = useState(defaultInputData);
  const handleDate = (e) => {
    const { name, value } = e.target;
    setInputData(prev => ({ ...prev, [name]: value }));
  }

  /**  일정 추가 핸들러 **/
  const handleInsertSchedule = () => {
    if(inputData.scheduleContent === "" || inputData.startDate === "" || inputData.endDate === "") {
      alert("내용을 전부 입력하세요");
      return false;
    }
    axios.post(`${BaseUrl()}/schedule`, inputData).then(res => {
      if(res.data === "ok") {
        closeModal();
        setDataChange(prev => !prev);
        setInputData(defaultInputData);
      }
    });
  }

  return (
    <div className={styles.modalForm}>
      <div className={styles.insert}>
        <h2>일정 추가</h2>
        {admin &&
          <div className={styles.companySchedule}>
            <input id="deptCode" name="deptCode" type="checkbox"/>
            <label htmlFor="deptCode">회사 전체 일정으로 추가하기</label>
          </div>
        }
        <div className={styles.inputData}>
          <div className={styles.insertRow}>
            <span>시작 날짜</span>
            <input type="date" name="startDate" value={inputData.startDate || ""}
                   onChange={handleDate}/>
            <div className={styles.time}>
              <select name="startTime">
                <option value="am">오전</option>
                <option value="pm">오후</option>
              </select>
              <input type="number" name="startHour" max="12" placeholder="시"/>
              <input type="number" name="startMinute" max="59" placeholder="분"/>
            </div>
          </div>
          <div className={styles.insertRow}>
            <span>종료 날짜</span>
            <input type="date" name="endDate" value={inputData.endDate || ""}
                   onChange={handleDate}/>
            <div className={styles.time}>
              <select name="endTime">
                <option value="am">오전</option>
                <option value="pm">오후</option>
              </select>
              <input type="number" name="endHour" max="12" placeholder="시"/>
              <input type="number" name="endMinute" max="59" placeholder="분"/>
            </div>
          </div>
          <div className={styles.insertRow}>
            <span>내용</span>
            <input type="text" name="scheduleContent" value={inputData.scheduleContent || ""}
                   onChange={handleDate}/>
          </div>
        </div>
        <div className={styles.btnBox}>
          <button onClick={handleInsertSchedule}>추가</button>
          <button onClick={closeModal}>취소</button>
        </div>
      </div>
    </div>
  );

}