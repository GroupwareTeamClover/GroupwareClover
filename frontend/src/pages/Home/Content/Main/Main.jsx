import styles from './Main.module.css'
import default_image from '../../../../images/default_avatar.jpg';
import {useMemberStore} from "../../../../store/store";
import {Modal} from "../../../../components/Modal/Modal";
import React, {useState} from "react";
import axios from "axios";
import {BaseUrl} from "../../../../commons/config";

export const Main = () => {
    const [ isModalOpen, setIsModalOpen ] = useState(false);
    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    const {sessionData} = useMemberStore();

    const [mypage, setMypage] = useState({});
    const handleMyPage = () => {
        axios.get(`${BaseUrl()}/employee/${sessionData.empSeq}`).then(res => {
            console.log(res.data);
            setMypage(perv => {
                const data = res.data
                console.log("data ==== ", data);
                return data;
            });
            console.log(mypage);
        })
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
                            <button onClick={handleMyPage}>상세보기</button>
                        </div>
                    </div>

                </div>
                <div className={styles.attendance}>
                    근태
                </div>
                <div className={styles.todo}>
                    Todo List
                </div>
            </div>
            <div className={styles.col}>
                <div className={styles.review}>
                    한줄 공지 넣을 예정
                </div>
            </div>
        </div>

        <Modal isOpen={isModalOpen} onClose={closeModal}>
            <div className={styles.modalForm}>
                <div className={styles.top}>
                    <div className={styles.avatar}>
                        {sessionData.empAvatar === null &&
                            <img src={default_image} alt="기본이미지"/>
                        }
                    </div>
                    <div className={styles.topInfo}>
                        <p>이름 : {mypage.empName}</p>
                        <p>부서 : K-Degital</p>
                        <p>직급 : 쩌리</p>
                    </div>
                </div>
                <div className={styles.center}>
                    <div className={styles.centerInfo}>
                        <p>Birth : 1992-02-22</p>
                        <p>Tel. : 010-1234-1234</p>
                        <p>E-Mail : test@gmail.com</p>
                        <p>Address : 신설동 어쩌고 저쩌고 그렇습니다</p>

                    </div>
                </div>
                <div className={styles.bottom}>
                    <button>수정</button>
                    <button onClick={() => closeModal()}>취소</button>
                </div>
            </div>
        </Modal>
    </div>
  );
}