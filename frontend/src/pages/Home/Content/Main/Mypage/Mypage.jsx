import styles from './Mypage.module.css'
import default_image from "../../../../../images/default_avatar.jpg";
import React, {useEffect, useState} from "react";
import axios from "axios";
import {BaseUrl} from "../../../../../commons/config";
import {validateEmail, validatePhone} from "../../../../../commons/common";

export const Mypage = ({empSeq, closeModal}) => {

  const [mypage, setMypage] = useState({});

  const changeBirth = (birth) => {
    if (birth !== undefined) {
      let year = "";
      if (parseInt(birth) > 40) year = `19${birth.slice(0, 2)}`;
      else year = `20${birth.slice(0, 2)}`;
      return year + "년 " + birth.slice(2, 4) + "월 " + birth.slice(4, 6) + "일";
    }
    return birth;
  }

  const changeTel = (tel) => {
    if (tel !== undefined) return tel.slice(0, 3) + " - " + tel.slice(3, 7) + " - " + tel.slice(7, 11);
    return tel;
  }

  /** 내 정보 업데이트 **/
  const [updateForm, setUpdateForm] = useState(false)
  const handleUpdateForm = () => {
    setUpdateForm(true);
  }

  /** 내 정보 업데이트 데이터 **/
  const [updateData, setUpdateData] = useState({empTel: mypage.EMP_TEL, empEmail: mypage.EMP_EMAIL})

  const handleUpdateData = (e) => {
    const {name, value} = e.target;
    setUpdateData(prev => ({...prev, [name]: value}));
  }

  /** 변경된 정보로 업데이트 **/
  const handleUpdate = () => {
      if (validateEmail(updateData.empEmail) && validatePhone(updateData.empTel)) {
        axios.put(`${BaseUrl()}/employee`,updateData).then(res => {
            if(res.data === "ok"){
                alert("변경 성공");
                setDataState(prev => !prev);
                setUpdateForm(false);
            }
        });
    } else {
        alert("변경 실패!! \n작성 내용을 확인하세요");
    }
  }

  /** 정보 수정 중 취소 **/
  const handleUpdateCancel = () => {
    setUpdateForm(false);
    setUpdateData({empTel: mypage.EMP_TEL, empEmail: mypage.EMP_EMAIL});
  }

  const [dataState, setDataState] = useState(false);
  useEffect(() => {
    axios.get(`${BaseUrl()}/employee/${empSeq}`).then(res => {
      setMypage(res.data);
      setUpdateData({empTel: res.data.EMP_TEL, empEmail: res.data.EMP_EMAIL});
    })
  }, [dataState]);

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
        <div className={styles.content}>
          {!updateForm ?
            <div className={styles.contentLabel}>
              <p>생년월일 : {changeBirth(mypage.EMP_BIRTH)}</p>
              <p>전화번호 : {changeTel(mypage.EMP_TEL)}</p>
              <p>이메일 : {mypage.EMP_EMAIL} </p>
              <p>연차 : {mypage.ANNUAL_LEAVE_DAY}일</p>
            </div>

            :

            <div>
              <div className={styles.row}>
                <span>Tel.</span>
                <input type="text" name="empTel" onChange={handleUpdateData} value={updateData.empTel} placeholder=" ' - '를 제외한 전화번호를 입력하세요."/>
              </div>
              <div className={styles.row}>
                <span>E-Mail</span>
                <input type="text" name="empEmail" value={updateData.empEmail} onChange={handleUpdateData} placeholder="E-Mail을 입력하세요."/>
              </div>
            </div>

          }
        </div>
      </div>
      <div className={styles.bottom}>
        {!updateForm ?
          <>
            <button onClick={handleUpdateForm}>수정</button>
            <button onClick={() => closeModal()}>닫기</button>
          </>
          :
          <>
            <button onClick={handleUpdate}>확인</button>
            <button onClick={handleUpdateCancel}>취소</button>
          </>
        }
      </div>
    </div>
  );
}