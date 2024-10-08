import styles from './AddSchedule.module.css'
import React, {useEffect, useState} from "react";
import {useMemberStore} from "../../../../../store/store";
import axios from "axios";
import {BaseUrl} from "../../../../../commons/config";
import {failAlert, timeAlert} from "../../../../../commons/common";

class Loading extends React.Component {
  render() {
    return null;
  }
}

export const AddSchedule = ({ closeModal, setDataChange }) => {

  const { admin } = useMemberStore();
  const [loading, setLoading] = useState(false);

  /** 오늘보다 이전 날짜 선택 못하도록 상태 관리 **/
  const [minDateTime, setMinDateTime] = useState('');
  useEffect(() => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const formattedDateTime = `${year}-${month}-${day}T${hours}:${minutes}`;

    setMinDateTime(formattedDateTime);
  }, []);

  /**  일정 추가 데이터 **/
  const defaultInputData = {scheduleContent: "", startDate: "", endDate: ""};
  const [inputData, setInputData] = useState(defaultInputData);
  const handleDate = (e) => {
    const { name, value } = e.target;
    if(name === "scheduleContent" && value.length > 300) return false;
    setInputData(prev => ({ ...prev, [name]: value }));
  }

  /**  일정 추가 핸들러 **/
  const handleInsertSchedule = () => {
    if(inputData.scheduleContent === "" || inputData.startDate === "" || inputData.endDate === "") {
      failAlert("","내용을 전부 입력하세요");
      return false;
    }

    if(inputData.startDate > inputData.endDate) {
      failAlert("","종료 날짜는 시작 날짜 이후로 지정해야합니다.");
      return false;
    }

    if(inputData.scheduleContent.length > 300) {
      failAlert("","내응은 300자 이내로 작성해야 합니다.");
      return false;
    }

    let dept = 1;
    if(select) dept = 0;
    const data = {
      scheduleContent : inputData.scheduleContent,
      startDate : inputData.startDate,
      endDate: inputData.endDate,
      deptCode: dept
    }
    setLoading(true);
    axios.post(`${BaseUrl()}/schedule`, data).then(res => {
      if(res.data === "ok") {
        closeModal();
        setDataChange(prev => !prev);
        setInputData(defaultInputData);
        timeAlert("일정 추가 완료!");
      }
    }).catch(() => failAlert("","일정 추가를 실패하였습니다."));

    setSelect(false);
    setLoading(false);
  }

  const [select, setSelect] = useState(false);
  const handleCheckBox = (e) => {
    setSelect(e.target.checked);
  }

  return (
    <div className={styles.modalForm}>
      { loading && <Loading />}
      <div className={styles.insert}>
        <h2>일정 추가</h2>
        <div className={styles.inputData}>
          <div className={styles.insertRow}>
            <span>시작 날짜</span>
            <input type="datetime-local" name="startDate" min={minDateTime} value={inputData.startDate || ""}
                   onChange={handleDate}/>
          </div>
          <div className={styles.insertRow}>
            <span>종료 날짜</span>
            <input type="datetime-local" name="endDate" min={inputData.startDate || minDateTime} value={inputData.endDate || ""}
                   onChange={handleDate}/>
          </div>
          <div className={styles.insertRow}>
            <span>내용</span>
            <input type="text" name="scheduleContent" maxLength="300" value={inputData.scheduleContent || ""}
                   onChange={handleDate}/>
          </div>

          {admin &&
            <div className={styles.companySchedule}>
              <input id="deptCode" name="deptCode" type="checkbox" onChange={handleCheckBox}/>
              <label htmlFor="deptCode">회사 전체 일정으로 추가하기</label>
            </div>
          }
        </div>

        <div className={styles.btnBox}>
          <button onClick={handleInsertSchedule}>추가</button>
          <button onClick={closeModal}>취소</button>
        </div>
      </div>
    </div>
  );

}