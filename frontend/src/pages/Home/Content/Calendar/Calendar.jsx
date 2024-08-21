import styles from './Calendar.module.css'
import './Calendar.css';
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from "@fullcalendar/interaction";
import timeGridPlugin from "@fullcalendar/timegrid";
import React, {useEffect, useState} from "react";
import {Modal} from "../../../../components/Modal/Modal";
import axios from "axios";
import {dateSettingOrigin, scheduleType} from "../../../../commons/common";
import {BaseUrl} from "../../../../commons/config";
import {useMemberStore} from "../../../../store/store";
import {AddSchedule} from "./AddSchedule/AddSchedule";
import {DetailSchedule} from "./DetailSchedule/DetailSchedule";
import {useScheduleStore} from "../../../../store/scheduleStore";
import {SelectSchedule} from "./SelectSchedule/SelectSchedule";

export const Calendar = () => {
  const { sessionData} = useMemberStore();
  const { scheduleList, setScheduleList, setScheduleSelectList, setScheduleDetail, setScheduleDay } = useScheduleStore();

  const [ isModalOpen, setIsModalOpen ] = useState(false);
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setScheduleDetail({});
    setModalDisplay("detail");
    setIsModalOpen(false);
  }

  /** Full calendar plugin **/
  const plugin = [
    dayGridPlugin,      // 월간 달력
    timeGridPlugin,     // 주간, 일간 달력
    interactionPlugin   // 이벤트를 위한 플러그인
  ];


  const [dataChange, setDataChange] = useState(false);
  useEffect(() => {
    checkScheduleList();
  }, [dataChange]);

  /** 캘린더에 표시될 이벤트 상태 **/
  const checkScheduleList = () => {
    axios.get(`${BaseUrl()}/schedule`).then(res => {
      // 체크된 그룹에 대하여 색상 설정 추가
      setScheduleList(itemAttribute(res.data));
      setCheckSchedule(itemAttribute(res.data));
    });
  }

  /** 캘린더에 표시될 아이템들의 속성 셋팅 **/
  const itemAttribute = (items) => {
    const filter = items.filter(item => item.deptCode === sessionData.empDeptCode || item.deptCode === 0);
    return filter.map(item => {
      let data = { ...item, type: scheduleType(item.deptCode, item.empSeq, sessionData), title: item.scheduleContent, start: item.startDate, end: item.endDate };
      data.color = data.type === "individual" ? "#FF8225" : data.type === "department" ? "#478CCF" : "#173B45";
      delete data.startDate;
      delete data.endDate;
      delete data.scheduleContent;
      return data;
    });
  }

  /** 캘린더에 표시할 이벤트 그룹 **/
  const checkBoxKey = ["all", "individual", "department", "company"];
  const defaultSelect = { all : true, individual: false, department: false, company: false }
  const [select, setSelect] = useState(defaultSelect);

  const handleCheckBox = (e) => {
    const { name, checked } = e.target;
    if(name === "all") setSelect(defaultSelect);
    else setSelect(prev => ({ ...prev, all : false, [name]: checked }));
  }

  /** 서브사이드바에서 체크된 목록만 캘린더에 표시 **/
  const [checkSchedule, setCheckSchedule] = useState([]);
  useEffect(() => {
    // 체크된 목록 바뀌면 필터 사용해서 캘린더 재 렌더링
    setCheckSchedule([]);
    checkBoxKey.forEach(key => {
      if(select[key] && key === "all") {
        setCheckSchedule(scheduleList);
      }
      if(select[key]){
        scheduleList.filter(item => {
          if(item.type === key) {
            setCheckSchedule(prev => ([ ...prev, item]));
            return item;
          }
        });
      }
    });
    console.log("checkSchedule ==== ", JSON.stringify(checkSchedule));
  }, [select, dataChange]);

  /** 이벤트 클릭 **/
  const [eventData, setEventData] = useState({start: "", end: "", title: ""});
  const eventClick = (data) => {
    const start = dateSettingOrigin(data.event._instance.range.start);
    const end = dateSettingOrigin(data.event._instance.range.end);
    const title = data.event._def.title;
    setEventData({start, end, title});
    setModalDisplay("select");
    openModal();
  }

  /** 선택된 날짜를 모달에 표시 **/
  const calendarDayClick = (arg) => {
    setScheduleDay(arg.dateStr);
    selectDayList(arg.dateStr);
    openModal();
  }

  /** 선택된 날짜를 형식에 맞게 셋팅 **/
  const selectDayList = (dateStr) => {
    // 선택된 날짜를 UTC 기준으로 변환하여 비교 준비
    const selectedDate = new Date(dateStr);
    const selectedDateStartOfDay = new Date(Date.UTC(selectedDate.getUTCFullYear(), selectedDate.getUTCMonth(), selectedDate.getUTCDate(), 0, 0, 0));
    const selectedDateEndOfDay = new Date(Date.UTC(selectedDate.getUTCFullYear(), selectedDate.getUTCMonth(), selectedDate.getUTCDate(), 23, 59, 59, 999));

    let selectList = checkSchedule.filter(item => {
      if (item.date) {
        const itemDate = new Date(item.date);
        const itemDateStartOfDay = new Date(Date.UTC(itemDate.getUTCFullYear(), itemDate.getUTCMonth(), itemDate.getUTCDate(), 0, 0, 0));
        const itemDateEndOfDay = new Date(Date.UTC(itemDate.getUTCFullYear(), itemDate.getUTCMonth(), itemDate.getUTCDate(), 23, 59, 59, 999));
        return itemDateEndOfDay >= selectedDateStartOfDay && itemDateStartOfDay <= selectedDateEndOfDay;
      }
      else if (item.start && item.end) {
        const startDate = new Date(item.start);
        const endDate = new Date(item.end);
        return endDate >= selectedDateStartOfDay && startDate <= selectedDateEndOfDay;
      }

      return false;
    });

    setScheduleSelectList(selectList);
  }

  /** 모달 화면 스테이트 **/
  const [ modalDisplay, setModalDisplay ] = useState("detail");

  /** 일정 추가 버튼 이벤트 **/
  const handleInsertModal = () => {
    setModalDisplay("insert");
    openModal();
  }

  return (
    <div className={styles.container}>
      <div className={styles.form}>
        <div className={styles.subMenu}>
          <div className={styles.row}>
            <button onClick={handleInsertModal}>일정추가</button>
          </div>
          <div className={styles.row}>
            <input type="checkbox" id="all" name="all" onChange={handleCheckBox} checked={select.all}/>
            <label htmlFor="all">전체 일정</label>
          </div>
          <div className={styles.row}>
            <input type="checkbox" id="individual" name="individual" onChange={handleCheckBox}
                   checked={select.individual}/>
            <label htmlFor="individual">개인 일정</label>
            <div className={styles.colorBox} style={{backgroundColor: "#FF8225"}}></div>
          </div>
          <div className={styles.row}>
            <input type="checkbox" id="department" name="department" onChange={handleCheckBox} checked={select.department}/>
            <label htmlFor="department">부서 일정</label>
            <div className={styles.colorBox} style={{backgroundColor: "#478CCF"}}></div>
          </div>
          <div className={styles.row}>
            <input type="checkbox" id="company" name="company" onChange={handleCheckBox} checked={select.company}/>
            <label htmlFor="company">회사 일정</label>
            <div className={styles.colorBox} style={{backgroundColor: "#173B45"}}></div>
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
              right: "today"
              // right: "dayGridMonth timeGridWeek timeGridDay today"
            }}

            buttonText={{
              today: "Today",
              // month: "Month",
              // week: "Week",
              // day: "Day"
            }}

            events={checkSchedule}
            eventClick={eventClick}

            dateClick={calendarDayClick} // 날짜가 선택 될 때

            dayMaxEventRows={2} // 각 날짜 셀에 표시되는 이벤트를 3개로 제한
            moreLinkText="more" // "+n more" 링크에 표시되는 텍스트
          />
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={closeModal}>
        { modalDisplay === "detail" && <DetailSchedule closeModal={closeModal} setDataChange={setDataChange}/> }
        { modalDisplay === "insert" && <AddSchedule closeModal={closeModal} setDataChange={setDataChange}/> }
        { modalDisplay === "select" && <SelectSchedule eventData={eventData}/> }
      </Modal>

    </div>
  );
}