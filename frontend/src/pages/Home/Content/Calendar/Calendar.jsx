import styles from './Calendar.module.css'
import './Calendar.css';
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from "@fullcalendar/interaction";
import timeGridPlugin from "@fullcalendar/timegrid";
import {useEffect, useState} from "react";
import {Modal} from "../../../../components/Modal/Modal";

export const Calendar = () => {

  const [ isModalOpen, setIsModalOpen ] = useState(false);
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  /** Full calendar plugin **/
  const plugin = [
    dayGridPlugin,      // 월간 달력
    timeGridPlugin,     // 주간, 일간 달력
    interactionPlugin   // 이벤트를 위한 플러그인
  ];

  /** 캘린더에 표시할 이벤트 그룹 **/
  const defaultSelect = { all : true, individual: false, group: false, company: false }
  const [select, setSelect] = useState(defaultSelect);

  const handleCheckBox = (e) => {
    const { name, checked } = e.target;
    if(name === "all") setSelect(defaultSelect);
    else setSelect(prev => ({ ...prev, all : false, [name]: checked }));
  }

  const scheduleColor = (state) => {
    if(state === 1) return "green"
    else if(state === 2) return "blue"
    else if(state === 3) return "red"
    else return "green";
  }

  /** 캘린더에 표시될 이벤트 상태 **/
  const [schedule, setSchedule] = useState([
    {groupCode: 1, title: "캘린더 테스트 1", date: "2024-08-23", color: scheduleColor(1)},
    {groupCode: 2, title: "캘린더 테스트 2", date: "2024-08-25", color: scheduleColor(2)},
    {groupCode: 3, title: "캘린더 테스트 3", date: "2024-08-26", color: scheduleColor(3)},
    {groupCode: 1, title: "캘린더 테스트 4", date: "2024-08-27", color: scheduleColor(1)},
    {groupCode: 2, title: "K-Degital 지옥의 부트캠프", start: "2024-08-12", end: "2024-08-15", color: scheduleColor(2)}
  ]);

  const [checkSchedule, setCheckSchedule] = useState(schedule);


  useEffect(() => {
    // 캘린더 페이지 들어왔을 때 스케줄 목록 바인딩 해야됨


  }, []);

  useEffect(() => {
    // 체크된 목록 바뀌면 필터 사용해서 캘린더 재 렌더링

  }, [select]);


  /** 선택된 날짜를 모달에 표시 **/
  const [selectDay, setSelectDay] = useState("");
  const handleDaySelect = (arg) => {
    openModal();
    setSelectDay(arg.dateStr);
  }

  const handleEventSelect = (event) => {
    console.log("event ==== ", event);
  }

  return (
    <div className={styles.container}>
      <div className={styles.form}>
        <div className={styles.subMenu}>
          <div className={styles.row}>
            <input type="checkbox" id="all" name="all" onChange={ handleCheckBox } checked={select.all}/>
            <label htmlFor="all">전체 일정</label>
          </div>
          <div className={styles.row}>
            <input type="checkbox" id="individual" name="individual" onChange={ handleCheckBox } checked={select.individual} />
            <label htmlFor="individual">개인 일정</label>
            <div className={styles.colorBox} style={{backgroundColor: "green"}}></div>
          </div>
          <div className={styles.row}>
            <input type="checkbox" id="group" name="group" onChange={ handleCheckBox } checked={select.group}/>
            <label htmlFor="group">부서 일정</label>
            <div className={styles.colorBox} style={{backgroundColor: "blue"}}></div>
          </div>
          <div className={styles.row}>
            <input type="checkbox" id="company" name="company" onChange={ handleCheckBox } checked={select.company}/>
            <label htmlFor="company">회사 일정</label>
            <div className={styles.colorBox} style={{backgroundColor: "red"}}></div>
          </div>

        </div>
        <div className={styles.calendar}>
          <FullCalendar
            plugins={plugin}
            initialView="dayGridMonth"

            locale={'ko'}

            headerToolbar={{
              left: "prev next",
              center: "title",
              right: "dayGridMonth timeGridWeek timeGridDay today"
            }}

            buttonText={{
              today: "Today",
              month: "Month",
              week: "Week",
              day: "Day"
            }}

            events={checkSchedule}

            dateClick={handleDaySelect} // 날짜가 선택 될 때
            eventClick={handleEventSelect}

          />

          {/*
            [ event = 일정 ]
            events={scheduleData}     // 달력에 표시 될 이벤트
            eventClick={eventClick}   // 이벤트 클릭시
            eventChange={eventChange} // 이벤트 drop 혹은 resize 될 때
            editable={true}           // 사용자의 수정 가능 여부 (이벤트 추가/수정, 드래그 앤 드롭 활성화)
            selectable={true}         // 사용자의 날짜 선택 여부
            selectMirror={true}       // 사용자의 시간 선택시 time 표시 여부
            select={select}           // 날짜가 선택 될 때
            weekends={true}           // 주말 표시 여부
            dayMaxEvents={true}       // 하루에 표시 될 최대 이벤트 수 true = 셀의 높이
            navLinks={true}           // 달력의 날짜 클릭시 일간 스케쥴로 이동
            navLinkHint={"클릭시 해당 날짜로 이동합니다."} // 날짜에 호버시 힌트 문구

            // eventContent={fn(): node {} || true}

            // 일정 커스텀
            eventsSet={function () {
              console.log("eventsSet");
            }}

            // 추가시 로직
            eventAdd={function () {
              console.log("eventAdd");
            }}

            // 드롭시 로직
            eventDrop={function () {
              console.log("eventDrop");
            }}

            // 제거시 로직
            eventRemove={function () {
              console.log("eventRemove");
            }}

          */}
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <div className={styles.modalForm}>
          <h2> { selectDay } </h2>
          <div className={styles.list}>
            <p>일정 목록</p>
            <ul>
              {
                schedule.map((item, i) => {
                  return (
                    <li key={i}>
                      [개인 일정] { item.title.length > 20 ? item.title.slice(0,20)+ "..." : item.title }
                    </li>
                  );
                })
              }
            </ul>
          </div>
          <div className={styles.detail}>
            <p>일정 상세 정보</p>
            <div className={styles.content}>

            </div>
            <div className={styles.btnBox}>
              <button>일정 추가</button>
              <button>일정 수정</button>
            </div>
          </div>
        </div>
      </Modal>

    </div>
  );
}