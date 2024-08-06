import styles from './Main.module.css'
import default_image from '../../../../images/default_avatar.jpg';
import {useMemberStore} from "../../../../store/store";
import {Modal} from "../../../../components/Modal/Modal";
import React, {useState} from "react";
import {Mypage} from "./Mypage/Mypage";
import {Attendance} from "./Attendance/Attendance";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";

export const Main = () => {
    const [ isModalOpen, setIsModalOpen ] = useState(false);
    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    const {sessionData} = useMemberStore();

    const handleMyPageModal = () => {
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
                          <p> {sessionData.empName}님 안녕하세요.</p>
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
                          />
                      </div>
                  </div>

              </div>

              <div className={styles.col}>
                  <div className={styles.review}>
                      <div className={styles.reviewTitle}>
                          <h2>Clover 공지사항</h2>
                      </div>
                      <div className={styles.notice}>
                          <>
                              {/* 공지 사항 목록 조회 후 출력 ( 내용은 너무 길면 slice ) */}
                              <div className={styles.contentDate}>
                                  작성일 : 2024-08-01
                              </div>
                              <div className={styles.content}>
                                  <p>제목 : 워크샵 공지</p>
                                  <p>작성자 : 노시온</p>
                                  <p>Clover company summer workshop</p>
                              </div>
                          </>
                          <div className={styles.contentDate}>
                              작성일 : 2024-08-02
                          </div>
                          <div className={styles.content}>
                              <p>제목 : 워크샵 공지</p>
                              <p>작성자 : 노시온</p>
                              <p>Clover company summer workshop</p>
                          </div>
                          <div className={styles.contentDate}>
                              작성일 : 2024-08-03
                          </div>
                          <div className={styles.content}>
                              <p>제목 : 워크샵 공지</p>
                              <p>작성자 : 노시온</p>
                              <p>Clover company summer workshop</p>
                          </div>
                          <div className={styles.contentDate}>
                              작성일 : 2024-08-04
                          </div>
                          <div className={styles.content}>
                              <p>제목 : 공지 테스트</p>
                              <p>작성자 : 노시온</p>
                              <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aut corporis debitis
                                  dignissimos dolor dolorem, dolorum esse facilis inventore ipsum laboriosam laudantium
                                  libero molestiae porro, quaerat recusandae reiciendis sunt voluptate voluptates!</p>
                          </div>
                          <div className={styles.contentDate}>
                              작성일 : 2024-08-06
                          </div>
                          <div className={styles.content}>
                              <p>제목 : 2024-07 사원 평가</p>
                              <p>작성자 : 백민주</p>
                              <p>우수 부서 대표 : 조진혁 부장, 정하윤 부장, 정경호 부장, 박새미 부장<br/>
                                  망한 부서 대표 : 노시온 대리 ( 8월부로 노시온 대리 사원으로 강등 )
                              </p>
                          </div>
                      </div>
                  </div>
              </div>
          </div>

          <Modal isOpen={isModalOpen} onClose={closeModal}>
              <Mypage empSeq={sessionData.empSeq} closeModal={closeModal}/>
          </Modal>
      </div>
    );
}