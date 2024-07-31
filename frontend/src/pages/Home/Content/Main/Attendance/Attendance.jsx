import styles from './Attendance.module.css'
import {HiMenuAlt3} from "react-icons/hi";
import React, {useState} from "react";
import {Modal} from "../../../../../components/Modal/Modal";
import axios from "axios";
import {BaseUrl} from "../../../../../commons/config";

export const Attendance = () => {

    const [ isModalOpen, setIsModalOpen ] = useState(false);
    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    const [attendance, setAttendance] = useState();
    
    const handleAttDetail = () => {
        openModal();
    }

    const handleWorkStart = () => {
        alert("업무시작");
        // axios.post(`${BaseUrl()}/attendance`, attendance).then(res => {
        //
        // });
    }

    const handleWorkEnd = () => {
        alert("퇴근");
        // axios.put(`${BaseUrl()}/attendance`, attendance).then(res => {
        //
        // });
    }

    return (
        <div className={styles.attendance}>
            <div className={styles.attTitle}>
                <h2>내 근태 현황</h2>
                <HiMenuAlt3 size={30} className={styles.icons} onClick={handleAttDetail}/>
            </div>
            <div className={styles.attInfo}>
                <div className={styles.attDate}>
                    2024-07-31(수)
                </div>
                <div className={styles.attTimers}>
                    <div className={styles.attTimer}>
                        <span>출근시간</span>
                        <p>08:17:00</p>
                    </div>
                    <div className={styles.attTimer}>
                        <span>퇴근시간</span>
                        <p>-</p>
                    </div>
                </div>
                <div className={styles.attBtn}>
                    <button onClick={handleWorkStart}>출근하기</button>
                    <button onClick={handleWorkEnd}>퇴근하기</button>

                </div>
            </div>

            <Modal isOpen={isModalOpen} onClose={closeModal}>
                내 근무 Detail <br/>
                한달 간 <br/>
                출근 / 지각 / 연차 <br/>
                근무시간 / 연장 근무 시간 / 총 근무시간 <br/>
                <br/><br/>
                회의, 외출, 외근 정보 남기기
            </Modal>

        </div>
    );
}