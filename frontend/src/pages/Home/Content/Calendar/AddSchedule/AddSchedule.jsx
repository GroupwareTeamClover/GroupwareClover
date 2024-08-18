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
    if(name === "scheduleContent" && value.length > 300) return false;
    if((name === "endHour" || name === "startHour") && value > 12) return false;
    if((name === "startMinute" || name === "endMinute") && value > 59) return false;
    setInputData(prev => ({ ...prev, [name]: value }));
  }

  /** 날짜 형식 변환 함수 **/
  const makeDate = (date, time, hour, minute) => {
    let hourInt = parseInt(hour, 10);
    const minuteInt = parseInt(minute, 10);

    if (time === "pm" && hourInt !== 12) {
      hourInt += 12;
    } else if (time === "am" && hourInt === 12) {
      hourInt = 0; // 오전 12시는 00시로 변환
    }
    const formattedTime = `${hourInt.toString().padStart(2, '0')}:${minuteInt.toString().padStart(2, '0')}:00`;
    return `${date}T${formattedTime}`;
  }

  /**  일정 추가 핸들러 **/
  const handleInsertSchedule = () => {
    if(inputData.scheduleContent === "" || inputData.startDate === "" || inputData.endDate === "") {
      alert("내용을 전부 입력하세요");
      return false;
    }

    if(inputData.startDate > inputData.endDate) {
      alert("종료 날짜는 시작 날짜 이후만 됩니다.");
      return false;
    }

    if(inputData.scheduleContent.length > 300) {
      alert("내응은 300자 이내로 작성해야 합니다.");
      return false;
    }

    const data = {
      scheduleContent : inputData.scheduleContent,
      startDate : inputData.startDate,
      endDate: inputData.endDate

    }

    console.log("data ==== ", JSON.stringify(data));

    axios.post(`${BaseUrl()}/schedule`, data).then(res => {
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
            <input type="datetime-local" name="startDate" value={inputData.startDate || ""}
                   onChange={handleDate}/>
          </div>
          <div className={styles.insertRow}>
            <span>종료 날짜</span>
            <input type="datetime-local" name="endDate" value={inputData.endDate || ""}
                   onChange={handleDate}/>
          </div>
          <div className={styles.insertRow}>
            <span>내용</span>
            <input type="text" name="scheduleContent" maxLength="300" value={inputData.scheduleContent || ""}
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