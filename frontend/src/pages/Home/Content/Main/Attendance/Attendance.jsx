import styles from './Attendance.module.css'
import {HiMenuAlt3} from "react-icons/hi";
import React, {useEffect, useState} from "react";
import {Modal} from "../../../../../components/Modal/Modal";
import axios from "axios";
import {BaseUrl} from "../../../../../commons/config";
import {dateYMD, failAlert, successAlert, timeAlert, workTime} from "../../../../../commons/common";
import {useMemberStore} from "../../../../../store/store";
import {Loading} from "../../../../../components/Loading/Loading";

export const Attendance = () => {
  let today = new Date();
  let year = today.getFullYear();
  let month = ('0' + (today.getMonth() + 1)).slice(-2);
  let day = ('0' + today.getDate()).slice(-2);
  let daysOfWeek = ['일', '월', '화', '수', '목', '금', '토'];
  let dayOfWeek = daysOfWeek[today.getDay()];
  let dateData = `${year}-${month}-${day}`;

  const [date, setDate] = useState({ year, month});
  const {sessionData} = useMemberStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const [loading, setLoading] = useState(false);

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
          successAlert("출근 처리가 완료되었습니다.");
          todayAtt();
        } else failAlert("Error!!","출근 처리 중 오류 발생");
      });
    } else {
      failAlert("", "이미 출근이 완료되었습니다.");
    }
  }

  /**  퇴근 버튼 이벤트 **/
  const handleWorkEnd = () => {
    today = new Date();
    let hours = ('0' + today.getHours()).slice(-2);
    let minutes = ('0' + today.getMinutes()).slice(-2);
    const workStart = arrive.attArrive.split(":");
    const workTime = (hours - workStart[0]) * 60 + (minutes - workStart[1]);
    const workHours = Math.floor(workTime / 60);
    const workMinutes = workTime % 60;

    setArrive(prev => {
      const data = {...prev, attLeave: `${hours}:${minutes}`, attTotal: workTime, attSuccess: "Y"};
      axios.put(`${BaseUrl()}/attendance`, data).then(res => {
        if (res.data === "ok") successAlert("퇴근 처리가 완료되었습니다.", `오늘 업무 시간 : ${workHours}시간 ${workMinutes}분`);
        else failAlert("Error!!","퇴근 처리 중 오류 발생");
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

  /** 금일 근태 정보 **/
  const todayAtt = () => {
    setLoading(true);
    axios.get(`${BaseUrl()}/attendance/today/${dateData}`).then(res => {
      if (res.data !== "" && res.data !== null && res.data !== undefined) setArrive(res.data);
    }).catch(() => failAlert("","금일 근태 조회에 실패하였습니다"));

    setLoading(false);
  }

  /** 한달 근태 정보 **/
  const monthAtt = () => {
    setLoading(true);
    axios.get(`${BaseUrl()}/attendance/${sessionData.empSeq}/${date.year}-${date.month}`).then(res => {
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
    }).catch(() => failAlert("","근태 정보 조회에 실패하였습니다"));

    setLoading(false);
  }

  useEffect(() => {
    todayAtt();
  }, []);

  useEffect(() => {
    monthAtt();
  }, [arrive, date]);

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


  return (
    <div className={styles.attendance}>
      { loading && <Loading />}
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
            <button name="prev" onClick={handleDateChange}>〈</button>
            <h2>{date.year}-{date.month} 근무 현황</h2>
            <button name="next" onClick={handleDateChange}>〉</button>
          </div>
          <div className={styles.detailContent}>
            <div className={styles.contentItems}>
              <div>
                <p>근무일</p>
                <span>{myAttendance.work_day != 0 ? myAttendance.work_day : "-"}</span>
              </div>
              <div>
                <p>지각</p>
                <span>{myAttendance.work_day != 0 ? myAttendance.work_late : "-"}</span>
              </div>
              <div>
                <p>결근</p>
                <span>{myAttendance.work_day != 0 ? myAttendance.work_day - myAttendance.work_success : "-"}</span>
              </div>
              <div>
                <p>연차</p>
                <span>{myAttendance.work_day != 0 ? "-" : "-"}</span>
              </div>
            </div>
            <div className={styles.totalWorkTime}>
              {
                myAttendance.work_day != 0 ?
                `총 근무시간 : ${myAttendance.work_total_hour}시간 ${myAttendance.work_total_minute}분`
                :
                "근무 내용 없음"
              }

            </div>
          </div>
          <div className={styles.outsideWork}>
                  {attendanceList.length !== 0 ?
                    attendanceList.map((item, i) => {
                        return (
                          <div className={styles.outsideContent} key={i}>
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
        </div>
      </Modal>

    </div>
  );
}