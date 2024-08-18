import styles from './DetailSchedule.module.css'
import {dateSetting, dateYMD} from "../../../../../commons/common";
import React, {useState} from "react";
import axios from "axios";
import {BaseUrl} from "../../../../../commons/config";
import {useScheduleStore} from "../../../../../store/scheduleStore";
import {useMemberStore} from "../../../../../store/store";

export const DetailSchedule = ({setDataChange}) => {

  const { sessionData } = useMemberStore();
  const { scheduleSelectList, setScheduleSelectList, scheduleDetail, setScheduleDetail, scheduleDay } = useScheduleStore();

  /** 선택된 일정에 대한 내용을 디테일 상세 내용에 표시 **/
  const handleSelectDetail = (seq) => {
    const data = scheduleSelectList.filter(item => item.scheduleSeq === seq);
    setScheduleDetail(data[0]);
    setUpdateData(data[0]);
  }

  /** 일정 삭제 핸들러 **/
  const handleScheduleDelete = (seq) => {
    if(window.confirm("일정을 삭제합니까?")){
      axios.delete(`${BaseUrl()}/schedule/${seq}`).then(res => {
        if(res.data === "ok"){
          setScheduleDetail({});
          const selectList = scheduleSelectList.filter(item => item.scheduleSeq !== seq)
          setScheduleSelectList(selectList);
        }
      });
    }
  }

  /** 일정 수정 폼 변경 **/
  const [updateForm, setUpdateForm] = useState(false);
  const [updateData, setUpdateData] = useState(scheduleDetail);

  /** 일정 수정 데이터 **/
  const handleUpdataData = (e) => {
    const { name, value } = e.target;
    setUpdateData(prev => ({ ...prev, [name]: value }));
  }

  /** 일정 수정 핸들러 **/
  const handleScheduleUpdate = () => {
    const data = {
      scheduleSeq: updateData.scheduleSeq,
      scheduleContent: updateData.title,
      empSeq : updateData.empSeq,
      startDate: updateData.start,
      endDate: updateData.end
    }

    axios.put(`${BaseUrl()}/schedule`, data).then(res => {
      if(res.data === "ok"){
        const listData = scheduleSelectList.map(item => item.scheduleSeq === updateData.scheduleSeq ? updateData : item);
        setScheduleSelectList(listData);

        const detailData = { ...scheduleDetail, ...updateData };
        setScheduleDetail(detailData);

        setUpdateForm(false);
        setUpdateData({});
        setDataChange(prev => !prev);
        alert("수정완료");
      }
    });
  }



  return (
    <div className={styles.modalForm}>
      <div className={styles.list}>
        <p>일정 목록 ( {scheduleDay} )</p>
        <ul>
          { scheduleSelectList.length > 0 ?
            scheduleSelectList.map((item, i) => {
              return (
                <li key={i} onClick={() => handleSelectDetail(item.scheduleSeq)}>
                  <span
                    style={item.type === "individual" ? {color: "#FF8225"} : item.type === "department" ? {color: "#478CCF"} : {color: "#173B45"}}> [ {item.type === "individual" ? "개인" : item.type === "department" ? "부서" : "회사"} 일정 ]</span>
                  {item.title.length > 20 ? item.title.slice(0, 20) + "..." : item.title}
                </li>
              );
            })
            :
            <li>해당 날짜에 스케줄이 없습니다.</li>
          }
        </ul>
      </div>
      <div className={styles.detail}>
        <p>일정 상세 정보</p>
        { scheduleDetail.scheduleSeq !== undefined &&
          <>
            <div className={styles.content}>
              {
                !updateForm ?
                  <div className={styles.contentLabel}>
                    <p>시작 : {dateSetting(scheduleDetail.start)}</p>
                    <p>종료 : {dateSetting(scheduleDetail.end)}</p>
                    <p>작성자 : {scheduleDetail.empName} </p>
                    <p>내용 : {scheduleDetail.title}</p>
                  </div>
                  :
                  <div className={styles.contentLabel}>
                    <p>시작 : <input type="datetime-local" name="start" onChange={handleUpdataData}
                                   value={updateData.start.slice(0, 16) || ""}/></p>
                    <p>종료 : <input type="datetime-local" name="end" onChange={handleUpdataData} value={updateData.end.slice(0, 16) || ""}/>
                    </p>
                    <p>작성자 : {updateData.empName}</p>
                    <p>내용 : <input type="text" name="title" onChange={handleUpdataData} value={updateData.title}/></p>
                  </div>
              }

            </div>

            {
              updateData.empSeq === sessionData.empSeq &&
              <>
                {!updateForm ?
                  <div className={styles.btnBox}>
                    <button onClick={() => handleScheduleDelete(scheduleDetail.scheduleSeq)}>일정 삭제</button>
                    <button onClick={() => setUpdateForm(true)}>일정 수정</button>
                  </div>
                  :
                  <div className={styles.btnBox}>
                    <button onClick={handleScheduleUpdate}>확인</button>
                    <button onClick={() => setUpdateForm(false)}>취소</button>
                  </div>
                }
              </>
            }
          </>
        }
      </div>
    </div>
  );
}