import styles from './Main.module.css'
import default_image from '../../../../images/default_avatar.jpg';
import {useMemberStore} from "../../../../store/store";
import {Modal} from "../../../../components/Modal/Modal";
import React, {useState} from "react";
import {Mypage} from "./Mypage/Mypage";
import {Attendance} from "./Attendance/Attendance";

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
            <div className={styles.col}>

                <div className={styles.myInfo}>
                    <div className={styles.avatar}>
                        {sessionData.empAvatar === null &&
                            <img src={default_image} alt="기본이미지"/>
                        }
                    </div>
                    <div className={styles.empInfo}>
                        <p> { sessionData.empName }님 안녕하세요.</p>
                        <div className={ styles.InfoBox}>
                            <button onClick={handleMyPageModal}>상세보기</button>
                        </div>
                    </div>
                </div>

                <Attendance />

                <div className={styles.todo}>
                    캘린더 조회해서 오늘 일정 보이기
                </div>
                
            </div>

            <div className={styles.col}>
                <div className={styles.review}>
                    한줄 공지 넣을 예정 <br />
                    공지 게시판 글 목록 조회해서 넣기
                </div>
            </div>
        </div>

        <Modal isOpen={isModalOpen} onClose={closeModal}>
            <Mypage empSeq={sessionData.empSeq} closeModal={closeModal}/>
        </Modal>
    </div>
  );
}