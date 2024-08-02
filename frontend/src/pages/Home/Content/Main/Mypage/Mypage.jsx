import styles from './Mypage.module.css'
import default_image from "../../../../../images/default_avatar.jpg";
import React, {useEffect, useState} from "react";
import axios from "axios";
import {BaseUrl} from "../../../../../commons/config";

export const Mypage = ({empSeq, closeModal}) => {

    const [mypage, setMypage] = useState({});

    const changeBirth = (birth) => {
        if(birth !== undefined){
            let year = "";
            if(parseInt(birth) > 40) year = `19${birth.slice(0, 2)}`;
            else year = `20${birth.slice(0, 2)}`;
            return year + "년 " + birth.slice(2, 4) + "월 " + birth.slice(4, 6) + "일";
        }
        return birth;

    }

    const changeTel = (tel) => {
        if(tel !== undefined) return tel.slice(0,3) + " - " + tel.slice(3, 7) + " - " + tel.slice(7, 11);
        return tel;
    }

    useEffect(() => {
        axios.get(`${BaseUrl()}/employee/${empSeq}`).then(res => {
            setMypage(res.data);
        })
    }, []);

    return (
        <div className={styles.container}>
            <div className={styles.top}>
                <div className={styles.avatar}>
                    {(mypage.EMP_AVATAR === null || mypage.EMP_AVATAR === undefined) ?
                      <img src={default_image} alt="기본이미지"/>
                      :
                      <img src={mypage.EMP_AVATAR} alt="기본이미지"/>
                    }
                </div>
                <div className={styles.topInfo}>
                    <p>이름 : {mypage.EMP_NAME}</p>
                    <p>부서 : {mypage.DEPT_NAME}</p>
                    <p>직급 : {mypage.ROLE_NAME}</p>
                </div>
            </div>
            <div className={styles.center}>
                <div className={styles.centerLabel}>
                    <p>생년월일 : </p>
                    <p>전화번호 : </p>
                    <p>이메일 : </p>
                    <p>주소 : </p>
                    <p>연차 : </p>
                </div>
                <div className={styles.centerInfo}>
                    <p>{changeBirth(mypage.EMP_BIRTH)}</p>
                    <p>{changeTel(mypage.EMP_TEL)}</p>
                    <p>{mypage.EMP_EMAIL}</p>
                    <p>{mypage.EMP_ADDRESS}</p>
                    <p>{mypage.ANNUAL_LEAVE_DAY}일</p>

                </div>
            </div>
            <div className={styles.bottom}>
                <button>수정</button>
                <button onClick={() => closeModal()}>취소</button>
            </div>
        </div>
    );
}