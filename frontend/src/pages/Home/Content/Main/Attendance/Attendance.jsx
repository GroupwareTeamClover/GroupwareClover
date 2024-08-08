import styles from './Attendance.module.css'
import {HiMenuAlt3} from "react-icons/hi";
import React, {useEffect, useState} from "react";
import {Modal} from "../../../../../components/Modal/Modal";
import axios from "axios";
import {BaseUrl} from "../../../../../commons/config";
import {dateYMD, workTime} from "../../../../../commons/common";

export const Attendance = () => {
  let today = new Date();
  let year = today.getFullYear();
  let month = ('0' + (today.getMonth() + 1)).slice(-2);
  let day = ('0' + today.getDate()).slice(-2);
  let daysOfWeek = ['일', '월', '화', '수', '목', '금', '토'];
  let dayOfWeek = daysOfWeek[today.getDay()];
  let dateData = `${year}-${month}-${day}`;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const defaultData = {attSeq: "", empSeq: "", attArrive: "", attLeave: "", attTotal: "", attSuccess: "", attDate: ""};
  const [arrive, setArrive] = useState(defaultData);
  const handleAttDetail = () => {
    openModal();
  }

  /**  출근 버튼 이벤트 **/
  const handleWorkStart = () => {
    if (arrive.attArrive === "") {
      today = new Date();
      let hours = ('0' + today.getHours()).slice(-2);
      let minutes = ('0' + today.getMinutes()).slice(-2);
      let time = `${hours}:${minutes}`
      let data = {attArrive: time};
      axios.post(`${BaseUrl()}/attendance`, data).then(res => {
        if (res.data === "ok") {
          alert(time + " 출근");
          setArrive(prev => ({...prev, ...data}));
        } else alert("오류 발생")
      });
    } else {
      alert("이미 출근버튼을 누르셨습니다.");
    }
  }

  /**  퇴근 버튼 이벤트 **/
  const handleWorkEnd = () => {
    today = new Date();
    let hours = ('0' + today.getHours()).slice(-2);
    let minutes = ('0' + today.getMinutes()).slice(-2);
    let time = `${hours}:${minutes}`

    const workStart = arrive.attArrive.split(":");
    const workTime = (hours - workStart[0]) * 60 + (minutes - workStart[1]);
    const workHours = Math.floor(workTime / 60);
    const workMinutes = workTime % 60;

    alert(time + " 퇴근\n" + workHours + "시간 " + workMinutes + "분 만큼 일하심");

    setArrive(prev => {
      const data = {...prev, attLeave: `${hours}:${minutes}`, attTotal: workTime, attSuccess: "Y"};
      axios.put(`${BaseUrl()}/attendance`, data).then(res => {
        if (res.data === "ok") alert("퇴근 처리 완료");
        else alert("퇴근 처리 중 오류 발생");
      });
      return data;
    });
  }

  const [myAttendance, setMyAttendance] = useState({
    work_day: 0,
    work_late: 0,
    work_success: 0,
    work_total_hour: 0,
    work_total_minute: 0
  })

  const [attendanceList, setAttendanecList] = useState([
    {attSeq: 0, empSeq: 0, attArrive: "", attLeave: "", attTotal: 0, attSuccess: "", attDate: ""}
  ]);

  useEffect(() => {
    /** 금일 근태 정보 **/
    axios.get(`${BaseUrl()}/attendance/today/${dateData}`).then(res => {
      if (res.data !== "" && res.data !== null && res.data !== undefined) setArrive(res.data);
    });

    /** 한달 근태 정보 **/
    axios.get(`${BaseUrl()}/attendance/${year}-${month}`).then(res => {

      if (res.data !== "" && res.data !== null && res.data !== undefined) {
        const hour = Math.floor(res.data.count.work_total_time / 60);
        const minute = res.data.count.work_total_time % 60;
        const data = {
          work_day: res.data.count.work_day,
          work_late: res.data.count.work_late,
          work_success: res.data.count.work_success,
          work_total_hour: hour,
          work_total_minute: minute
        }
        setMyAttendance(data);
        setAttendanecList(res.data.list);
      }
    });

    /** 한달 근태 리스트 **/

  }, []);

  return (
    <div className={styles.attendance}>
      <div className={styles.attTitle}>
        <h2>내 근태 현황</h2>
        <HiMenuAlt3 size={30} className={styles.icons} onClick={handleAttDetail}/>
      </div>
      <div className={styles.attInfo}>
        <div className={styles.attDate}>
          {dateData} ({dayOfWeek})
        </div>
        <div className={styles.attTimers}>
          <div className={styles.attTimer}>
            <span>출근시간</span>
            {arrive.attArrive === "" ?
              <p>-</p>
              :
              <p>{arrive.attArrive}</p>
            }
          </div>
          <div className={styles.attTimer}>
            <span>퇴근시간</span>
            {arrive.attLeave === "" ?
              <p>-</p>
              :
              <p>{arrive.attLeave}</p>
            }
          </div>
        </div>
        <div className={styles.attBtn}>
          <button onClick={handleWorkStart}>출근하기</button>
          <button onClick={handleWorkEnd}>퇴근하기</button>

        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <div className={styles.detail}>
          <div className={styles.detailTitle}>
            <h2>{year}-{month} 근무 현황</h2>
          </div>
          <div className={styles.detailContent}>
            <div className={styles.contentItems}>
              <div>
                <p>근무일</p>
                <span>{myAttendance.work_day}</span>
              </div>
              <div>
                <p>지각</p>
                <span>{myAttendance.work_late}</span>
              </div>
              <div>
                <p>결근</p>
                <span>{myAttendance.work_day - myAttendance.work_success}</span>
              </div>
              <div>
                <p>연차</p>
                <span>{myAttendance.work_day - myAttendance.work_success}</span>
              </div>
            </div>
            <div className={styles.totalWorkTime}>
              총 근무시간 : {myAttendance.work_total_hour}시간 {myAttendance.work_total_minute}분
            </div>
          </div>
          <div className={styles.outsideWork}>
                  {attendanceList.length !== 0 &&
                    attendanceList.map(item => {
                        return (
                          <div className={styles.outsideContent}>
                              <p>{dateYMD(item.attDate)}</p>
                              <p>{item.attArrive} ~ {item.attLeave}</p>
                              <p> ({workTime(item.attTotal)}) </p>
                          </div>
                        );
                    })
                  }
          </div>
        </div>
      </Modal>

    </div>
  );
}