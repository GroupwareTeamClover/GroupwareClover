import styles from './Attendance.module.css'
import {HiMenuAlt3} from "react-icons/hi";
import React, {useEffect, useState} from "react";
import {Modal} from "../../../../../components/Modal/Modal";
import axios from "axios";
import {BaseUrl} from "../../../../../commons/config";

export const Attendance = () => {
    let today = new Date();
    let year = today.getFullYear();
    let month = ('0' + (today.getMonth() + 1)).slice(-2);
    let day = ('0' + today.getDate()).slice(-2);
    let daysOfWeek = ['일', '월', '화', '수', '목', '금', '토'];
    let dayOfWeek = daysOfWeek[today.getDay()];
    let dateData = `${year}-${month}-${day}`;

    const [ isModalOpen, setIsModalOpen ] = useState(false);
    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    const defaultData = {attSeq: "", empSeq:"", attArrive: "", attLeave: "", attTotal: "", attSuccess: "", attDate: ""};
    const [arrive, setArrive] = useState(defaultData);
    const handleAttDetail = () => {
        openModal();
    }

    const handleWorkStart = () => {
        if(arrive.attArrive === ""){
            today = new Date();
            let hours = ('0' + today.getHours()).slice(-2);
            let minutes = ('0' + today.getMinutes()).slice(-2);
            let time = `${hours}:${minutes}`
            let data = {attArrive: time};
            axios.post(`${BaseUrl()}/attendance`, data).then(res => {
                if(res.data === "ok") {
                    alert(time + " 출근");
                    setArrive(prev=> ({...prev, ...data}));
                }
                else alert("오류 발생")
            });
        } else {
            alert("이미 출근버튼을 누르셨습니다.");
        }

    }

    const handleWorkEnd = () => {
        today = new Date();
        let hours = ('0' + today.getHours()).slice(-2);
        let minutes = ('0' + today.getMinutes()).slice(-2);
        let time = `${hours}:${minutes}`

        const workStart = arrive.attArrive.split(":");
        const workTime = (hours - workStart[0])*60 + (minutes - workStart[1]);
        const workHours = Math.floor(workTime/60);
        const workMinutes = workTime%60;

        alert( time + " 퇴근\n" + workHours+"시간 " + workMinutes + "분 만큼 일하심" );

        setArrive(prev => {
            const data = { ...prev, attLeave: `${hours}:${minutes}`, attTotal: workTime, attSuccess: "Y"};
            axios.put(`${BaseUrl()}/attendance`, data).then(res => {
                if(res.data === "ok") console.log("퇴근 이벤트 성공");
                else console.log("퇴근 이벤트 오류 발생");
            });
            return data;
        });
    }

    useEffect(() => {
        axios.get(`${BaseUrl()}/attendance/${dateData}`).then(res => {
            if(res.data !== "" && res.data !== null && res.data !== undefined) setArrive(res.data);
        });
    }, []);

    return (
        <div className={styles.attendance}>
            <div className={styles.attTitle}>
                <h2>내 근태 현황</h2>
                <HiMenuAlt3 size={30} className={styles.icons} onClick={handleAttDetail}/>
            </div>
            <div className={styles.attInfo}>
                <div className={styles.attDate}>
                    { dateData } ({dayOfWeek})
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