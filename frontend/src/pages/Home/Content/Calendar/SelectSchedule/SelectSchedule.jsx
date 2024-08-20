import styles from './SelectSchedule.module.css'
import {dateSetting} from "../../../../../commons/common";
import React from "react";

export const SelectSchedule = ({ closeModal, setDataChange, eventData }) => {
  return (
    <div className={styles.detail}>
      <p>일정 상세 정보</p>
        <>
          <div className={styles.content}>
            <div className={styles.contentLabel}>
              <p>시작 : {eventData.start}</p>
              <p>종료 : {eventData.end}</p>
              <p>내용 : {eventData.title}</p>
            </div>
          </div>
        </>
    </div>
  );
}