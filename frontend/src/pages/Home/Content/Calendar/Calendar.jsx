import styles from './Calendar.module.css'
import './Calendar.css';
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from "@fullcalendar/interaction";
import timeGridPlugin from "@fullcalendar/timegrid";
import {useEffect, useState} from "react";
import {Modal} from "../../../../components/Modal/Modal";
import axios from "axios";
import {scheduleType} from "../../../../commons/common";
import {BaseUrl} from "../../../../commons/config";
import {useMemberStore} from "../../../../store/store";

export const Calendar = () => {
  const { sessionData } = useMemberStore();

  const [ isModalOpen, setIsModalOpen ] = useState(false);
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setModalDisplay("detail");
    setIsModalOpen(false);
  }

  const [insertState, setInsertState] = useState(false);

  /** Full calendar plugin **/
  const plugin = [
    dayGridPlugin,      // 월간 달력
    timeGridPlugin,     // 주간, 일간 달력
    interactionPlugin   // 이벤트를 위한 플러그인
  ];

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
        setCheckSchedule(schedules);
      }
      if(select[key]){
        schedules.filter(item => {
          if(item.type === key) {
            setCheckSchedule(prev => ([ ...prev, item]));
            return item;
          }
        });
      }
    });
  }, [select]);

  /** 캘린더에 표시될 이벤트 상태 **/
  const [schedules, setSchedules] = useState([]);
  useEffect(() => {
    axios.get(`${BaseUrl()}/schedule`).then(res => {
      // 체크된 그룹에 대하여 색상 설정 추가
      setSchedules(() => {
        return res.data.map(item => {
          let data = { ...item, type: scheduleType(item.deptCode, item.empSeq, sessionData), title: item.scheduleContent, start: item.startDate, end: item.endDate };
          data.color = data.type === "individual" ? "green" : data.type === "department" ? "blue" : "red";
          delete data.startDate;
          delete data.endDate;
          delete data.scheduleContent;
          return data;
        });
      });
      setCheckSchedule(() => {
        return res.data.map(item => {
          let data = { ...item, type: scheduleType(item.deptCode, item.empSeq, sessionData), title: item.scheduleContent, start: item.startDate, end: item.endDate };
          data.color = data.type === "individual" ? "green" : data.type === "department" ? "blue" : "red";
          delete data.startDate;
          delete data.endDate;
          delete data.scheduleContent;
          return data;
        });
      });
    });
  }, [insertState]);

  /** 캘린더 디테일 모달에 표시될 목록 **/
  const [ detailSchedule, setDetailSchedule ] = useState(schedules);

  /** 선택된 날짜를 모달에 표시 **/
  const [selectDay, setSelectDay] = useState("");
  const handleDaySelect = (arg) => {
    openModal();
    setSelectDay(arg.dateStr);
    setDetailSchedule(prev => {
        // 선택된(arg.dateStr) 날짜에 포함되는 날짜가 있으면 filtering
        return checkSchedule.filter(item => {
          if (item.date) {
            return item.date === arg.dateStr;
          } else if (item.start && item.end) {
            const startDate = new Date(item.start);
            const endDate = new Date(item.end);
            const selectedDate = new Date(arg.dateStr);
            return selectedDate >= startDate && selectedDate <= endDate;
          }

          return false;
      });
    });
  }
  
  /** 선택된 일정에 대한 내용을 디테일 상세 내용에 표시 **/
  const [ selectSchedule, setSelectSchedule ] =  useState({});
  const handleSelectDetail = (seq) => {
    setSelectSchedule(seq)
  }

  useEffect(() => {
    // 해당 seq에 맞는 스케줄의 디테일 정보 가져오기
  }, [selectSchedule]);


  const handleEventSelect = (event) => {
    console.log("event ==== ", event);
  }
  
  
  /** 모달 화면 스테이트 **/
  const [ modalDisplay, setModalDisplay ] = useState("detail");

  const handleInsertModal = () => {
    setModalDisplay("insert");
    openModal();
  }

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
      console.log(res.data);
      if(res.data === "ok") {
        setInsertState(prev => !prev);
        closeModal();
        setInputData(defaultInputData);
      }
    });
  }

  useEffect(() => {
    // 체크박스 바뀔 시, 인서트 완료 시 재 렌더링
  }, [select, insertState]);

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
            <div className={styles.colorBox} style={{backgroundColor: "green"}}></div>
          </div>
          <div className={styles.row}>
            <input type="checkbox" id="department" name="department" onChange={handleCheckBox} checked={select.department}/>
            <label htmlFor="department">부서 일정</label>
            <div className={styles.colorBox} style={{backgroundColor: "blue"}}></div>
          </div>
          <div className={styles.row}>
            <input type="checkbox" id="company" name="company" onChange={handleCheckBox} checked={select.company}/>
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

            dayMaxEventRows={2} // 각 날짜 셀에 표시되는 이벤트를 5개로 제한
            moreLinkText="more" // "+n more" 링크에 표시되는 텍스트

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
        { modalDisplay === "detail" &&
          <div className={styles.modalForm}>
            <h2> {selectDay} </h2>
            <div className={styles.list}>
              <p>일정 목록</p>
              <ul>
                { detailSchedule.length > 0 ?
                  detailSchedule.map((item, i) => {
                    return (
                      <li key={i}>
                        [개인
                        일정] {item.title.length > 20 ? item.title.slice(0, 20) + "..." : item.title}
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
              <div className={styles.content}>
                작성자
                내용
                시작 날짜
                종료 날짜
              </div>
              <div className={styles.btnBox}>
                <button>일정 삭제</button>
                <button>일정 수정</button>
              </div>
            </div>
          </div>
        }
        { modalDisplay === "insert" &&
          <div className={styles.modalForm}>
            <div className={styles.insert}>
              <h2>일정 추가</h2>
              <div className={styles.inputData}>
                <div className={styles.insertRow}>
                  <span>시작 날짜</span>
                  <input type="date" name="startDate" value={inputData.startDate || ""}
                         onChange={handleDate}/>
                </div>
                <div className={styles.insertRow}>
                  <span>종료 날짜</span>
                  <input type="date" name="endDate" value={inputData.endDate || ""}
                         onChange={handleDate}/>
                </div>
                <div className={styles.insertRow}>
                  <span>내용</span>
                  <input type="text" name="scheduleContent" value={inputData.scheduleContent || ""}
                         onChange={handleDate}/>
                </div>
              </div>
              <div className={styles.btnBox}>
                <button onClick={ handleInsertSchedule } >추가</button>
                <button onClick={closeModal}>취소</button>
              </div>
            </div>
          </div>
        }
      </Modal>

    </div>
  );
}