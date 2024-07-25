import styles from './Calendar.module.css'
import './Calendar.css';
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'

export const Calendar = () => {

  return (
    <div className={styles.container}>
      <div className={styles.calendar}>
        <FullCalendar
          plugins={[ dayGridPlugin ]}
          initialView="dayGridMonth"
          events={[
            { title: "캘린더", date: "2024-07-23"},
            { title: "실행됨", date: "2024-07-24"},
          ]}
        />
      </div>
    </div>
  );
}