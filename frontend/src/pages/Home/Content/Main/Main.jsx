import styles from './Main.module.css'
import default_image from '../../../../images/default_avatar.jpg';
import {useMemberStore} from "../../../../store/store";
import {Modal} from "../../../../components/Modal/Modal";
import React, {useEffect, useRef, useState} from "react";
import {Mypage} from "./Mypage/Mypage";
import {Attendance} from "./Attendance/Attendance";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import {roleName, deptName, dateYMD, dateSettingOrigin} from "../../../../commons/common";
import axios from "axios";
import {BaseUrl} from "../../../../commons/config";

export const Main = () => {
    const [ modalState, setModalState ] = useState("");
    const [ isModalOpen, setIsModalOpen ] = useState(false);
    const openModal = () => setIsModalOpen(true);
    const closeModal = () => {
        setIsModalOpen(false);
        setModalState("");
    }

    const {sessionData} = useMemberStore();

    /** 스크롤 맨 아래로 이동 **/
    const mainNoticeEndRef = useRef(null);
    useEffect(() => {
        mainNoticeEndRef.current.scrollIntoView({ behavior: 'auto' });
    }, []);


    const handleMyPageModal = () => {
        setModalState("mypage");
        openModal();
    }

    /** 내 주간 일정에 들어갈 데이터 **/
    const [mySchedule, setMySchedule] = useState({ scheduleSeq: "", start: "", end: "", title: "" });

    /** 회사 공지 데이터 **/
    const [noticeList, setNoticeList] = useState([]);

    useEffect(() => {

        /** 내 주간 일정 목록 **/
        axios.get(`${BaseUrl()}/schedule/week`).then(res => {
            const myScheduleList = res.data.map(item => {
                return {
                    scheduleSeq: item.scheduleSeq,
                    start: item.startDate,
                    end: item.endDate,
                    title: item.scheduleContent,
                    color: "#FF8225"
                };
            })
            setMySchedule(myScheduleList);
        });

        /** 회사 공지 목록 **/
        axios.get(`${BaseUrl()}/board/main/notice`).then(res => {
            setNoticeList(res.data);
        })


    }, []);

    const [weekSchedule, setWeekSchedule] = useState({start: "", end: "", title: ""});
    const eventClick = (data) => {
        const start = dateSettingOrigin(data.event._instance.range.start);
        const end = dateSettingOrigin(data.event._instance.range.end);
        const title = data.event._def.title;
        setWeekSchedule({start, end, title});
        setModalState("week");
        openModal();
    }

    return (
      <div className={styles.container}>
          <div className={styles.form}>
              <div className={styles.leftCol}>

                  <div className={styles.myInfo}>
                      <div className={styles.avatar}>
                          {sessionData.empAvatar === null ?
                            <img src={default_image} alt="기본이미지"/>
                            :
                            <img src={sessionData.empAvatar} alt="기본이미지"/>
                          }
                      </div>
                      <div className={styles.empInfo}>
                          <p> Clover Portal</p>
                          <p> [ {deptName(sessionData.empDeptCode) === "미정" ? "현재 소속된 부서 없음" : deptName(sessionData.empDeptCode) + "부서"} ]
                              {" "+sessionData.empName}{ roleName(sessionData.empRoleCode) === "미정" ? "" : " " + roleName(sessionData.empRoleCode)}</p>
                          <div className={styles.InfoBox}>
                              <button onClick={handleMyPageModal}>내 정보</button>
                          </div>
                      </div>
                  </div>

                  <Attendance />

                  <div className={styles.calendar}>
                      <div className={styles.calendarTitle}>
                          <h2>내 주간 일정</h2>
                      </div>
                      <div className="calendar-content">
                          <FullCalendar
                            plugins={[dayGridPlugin]}
                            initialView="dayGridWeek"
                            headerToolbar={false}
                            hiddenDays={[0, 6]}
                            locale="ko"
                            selectable={true}
                            height="auto"
                            events={mySchedule}
                            eventClick={eventClick}
                          />
                      </div>
                  </div>
              </div>

              <div className={styles.col}>
                  <div className={styles.review}>
                      <div className={styles.reviewTitle}>
                          <h2>Company Notice!!</h2>
                      </div>
                      <div className={styles.notice}>
                          { /* 공지 사항 목록 조회 후 출력 ( 내용은 너무 길면 slice ) */
                              noticeList.map((item, i) => {
                                  return (
                                      <>
                                          <div className={styles.contentDate}>
                                              작성일 : { dateYMD(item.boardWriteDate) }
                                          </div>
                                          <div className={styles.content}>
                                              <p>제목 : { item.boardTitle }</p>
                                              <p>작성자 : { item.boardWriter }</p>
                                              <p>{ item.boardContent.length > 400 ? item.boardContent.slice(0, 400) + " ... " : item.boardContent }</p>
                                          </div>
                                      </>
                                  );
                              })
                          }
                          <div ref={mainNoticeEndRef}></div>
                      </div>
                  </div>
              </div>
          </div>

          <Modal isOpen={isModalOpen} onClose={closeModal}>
              { modalState === "mypage" && <Mypage empSeq={sessionData.empSeq} closeModal={closeModal}/> }
              { modalState === "week" &&
                <div className={styles.weekDetail}>
                    <span>{ weekSchedule.start } ~ { weekSchedule.end }</span>
                    <p>{ weekSchedule.title }</p>
                </div>
              }
          </Modal>
      </div>
    );
}