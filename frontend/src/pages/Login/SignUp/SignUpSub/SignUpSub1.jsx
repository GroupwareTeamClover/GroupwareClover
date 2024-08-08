import styles from './SignUpSub.module.css'
import {validateUserId, validatePassword, validateName, validateBirth, validateGender} from '../../../../commons/common'
import React, {useEffect} from "react";
import axios from "axios";
import {BaseUrl} from "../../../../commons/config";


export const SignUpSub1 = ({ sendData, checkData, setSendData, setCheckData }) => {

  /** 입력 데이터 체크 **/
  const handleDataCheck = (e) => {
    let { name, value } = e.target;

    if(name === "empId") {
      if(value !== ""){
        axios.get(`${BaseUrl()}/sign/${value}`).then(resp => {
          if(resp.data === "ok") {
            if(validateUserId(value)) setCheckData(prev => ({ ...prev, [name]: true}));
            else setCheckData(prev => ({ ...prev, [name]: false}));
          } else setCheckData(prev => ({ ...prev, [name]: false}));
        });
      }
      setSendData( prev => ({ ...prev, [name]: value}));
    }

    if(name === "empPw" || name === "pwCheck") {
      setSendData(prev =>  ({...prev, [name]: value}));
    }

    if(name === "empName") {
      setSendData( prev => {
        const data = { ...prev, [name]: value};
        if(validateName(value)) setCheckData(prev => ({ ...prev, [name]: true}));
        else setCheckData(prev => ({ ...prev, [name]: false}));
        return data;
      });
    }

    if(name === "empBirth") {
      if(parseInt(value.slice(2,4)) > 12) return false;
      if(parseInt(value.slice(4,6)) > 31) return false;
      setSendData( prev => {
        const data = { ...prev, [name]: value };
        if(validateBirth(value)) setCheckData(prev => ({ ...prev, [name]: true}));
        else setCheckData(prev => ({ ...prev, [name]: false}));
        return data;
      });
    }

    if(name === "empGender") {
      if(value > 4) return false;
      setSendData( prev => {
        const data = { ...prev, [name]: value };
        if(validateGender(value)) setCheckData(prev => ({ ...prev, [name]: true}));
        else setCheckData(prev => ({ ...prev, [name]: false}));
        return data;
      });
    }

  }

  useEffect(() => {
    if(sendData.empPw === sendData.pwCheck) {
      if(validatePassword(sendData.empPw)) setCheckData(prev => ({ ...prev, empPw: true}));
      else setCheckData(prev => ({ ...prev, empPw: false}));
    } else setCheckData(prev => ({ ...prev, empPw: false}));
  }, [sendData.empPw, sendData.pwCheck]);


  return (
      <div className={styles.container}>
        <div className={styles.title}>
          <h1>Join Employee!</h1>
        </div>
        <div className={styles.joinForm}>
          <div className={styles.row}>
            <span
              style={sendData.empId !== "" ? (checkData.empId ? {color: "#15dcdd"} : {color: "red"}) : undefined}>ID </span>
            <input type="text" name="empId" maxLength="12" onChange={handleDataCheck} value={sendData.empId}
                   placeholder="6~12자리로 작성해주세요!"/>
          </div>

          <div className={styles.row}>
            <span
              style={sendData.empPw !== "" ? (checkData.empPw ? {color: "#15dcdd"} : {color: "red"}) : undefined}>Password</span>
            <input type="password" name="empPw" maxLength="20" onChange={handleDataCheck} value={sendData.empPw}
                   placeholder="8~20자리로 입력하세요"/>
          </div>
          <div className={styles.row}>
            <input type="password" name="pwCheck" maxLength="20" onChange={handleDataCheck} value={sendData.pwCheck}
                   placeholder="8~20자리로 한번더 입력하세요"/>
            <span className={styles.description}>비밀번호는 영문 대문자, 소문자, 숫자, 특수문자를</span>
            <span className={styles.description}>각각 한개이상을 포함해야 합니다.</span>
          </div>

          <div className={styles.row}>
            <span
              style={sendData.empName !== "" ? (checkData.empName ? {color: "#15dcdd"} : {color: "red"}) : undefined}>Name</span>
            <input type="text" name="empName" onChange={handleDataCheck} value={sendData.empName || ""}
                   placeholder="이름을 입력하세요."/>
          </div>

          <div className={styles.row}>
            <span
              style={(sendData.empBirth !== "" && sendData.empGender !== "") ? ((checkData.empBirth && checkData.empGender) ? {color: "#15dcdd"} : {color: "red"}) : undefined}>Birth</span>
            <div>
              <input type="text" name="empBirth" maxLength="6" value={sendData.empBirth || ""}
                     onChange={handleDataCheck} placeholder=""/>　-　
              <input type="text" name="empGender" maxLength="1" value={sendData.empGender || ""}
                     onChange={handleDataCheck}/> ******
            </div>
          </div>

        </div>
      </div>
  );
}