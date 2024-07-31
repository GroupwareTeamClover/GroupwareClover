import styles from './Attendance.module.css'
import {HiMenuAlt3} from "react-icons/hi";
import React, {useEffect, useState} from "react";
import {Modal} from "../../../../../components/Modal/Modal";
import axios from "axios";
import {BaseUrl} from "../../../../../commons/config";

export const Attendance = () => {


    const [ isModalOpen, setIsModalOpen ] = useState(false);
    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);
    const leaveKey = ["attSeq", "attArrive", "attLeave", "attTotal", "attSuccess"];
    const defaultData = {attSeq: "", empSeq:"", attArrive: "", attLeave: "", attTotal: "", attSuccess: "", attData: ""};
    const [leave, setLeave] = useState(defaultData);
    const [arrive, setArrive] = useState(defaultData);
    const handleAttDetail = () => {
        openModal();
    }

    const handleWorkStart = () => {
        if(arrive.attArrive === ""){
            const today = new Date();
            const hours = ('0' + today.getHours()).slice(-2);
            const minutes = ('0' + today.getMinutes()).slice(-2);
            const time = `${hours}:${minutes}`
            const data = {attArrive: time};
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
        const today = new Date();
        const hours = ('0' + today.getHours()).slice(-2);
        const minutes = ('0' + today.getMinutes()).slice(-2);
        const time = `${hours}:${minutes}`

        const workStart = arrive.attArrive.split(":");
        const workTime = (hours - workStart[0])*60 + (minutes - workStart[1]);
        const workHours = Math.floor(workTime/60);
        const workMinutes = workTime%60;

        alert( time + " 퇴근\n" + workHours+"시간 " + workMinutes + "분 만큼 일하심" );
        setArrive(prev => ({ ...prev, attLeave: `${hours}:${minutes}` }))
        // setArrive(prev => ({ ...prev, attLeave: `${workHours}:${workMinutes}` }))



        // axios.put(`${BaseUrl()}/attendance`, attendance).then(res => {
        //
        // });
    }

    useEffect(() => {
        const today = new Date();
        const year = today.getFullYear();
        const month = ('0' + (today.getMonth() + 1)).slice(-2);
        const day = ('0' + today.getDate()).slice(-2);
        const dateDate = `${year}-${month}-${day}`;

        axios.get(`${BaseUrl()}/attendance/${dateDate}`).then(res => {
            console.log(res.data);
            setArrive(res.data);
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
                    2024-07-31(수)
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