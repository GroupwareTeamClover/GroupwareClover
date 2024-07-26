import { useState } from "react";
import styles from './SignUpSub.module.css'
import axios from "axios";
import {validateName, validateUserNo, validateEmail} from '../../../../commons/common'

export const SignUpSub2 = ({ sendData, checkData,  setSendData, setCheckData }) => {

  const handleDataCheck = (e) => {
    let { name, value } = e.target;

    if(name === "emp_name") {
      setSendData( prev => {
        const data = { ...prev, [name]: value};
        if(validateName(sendData.emp_name)) setCheckData(prev => ({ ...prev, [name]: true}));
        else setCheckData(prev => ({ ...prev, [name]: false}));
        return data;
      });
    }

    if(name === "emp_birth" || name === "emp_gender") {
      setSendData( prev => {
        const data = { ...prev, [name]: value };
        if(validateUserNo(sendData.emp_birth, sendData.emp_gender)) setCheckData(prev => ({ ...prev, [name]: true}));
        else setCheckData(prev => ({ ...prev, [name]: false}));
        return data;
      });
    }

    if(name === "emp_email") {
      setSendData( prev => {
        const data = { ...prev, [name]: value };
        if(validateEmail(sendData.emp_email)) setCheckData(prev => ({ ...prev, [name]: true}));
        else setCheckData(prev => ({ ...prev, [name]: false}));
        return data;
      });

    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.title}>
        <h1>Join Employee!</h1>
      </div>
      <div className={styles.joinForm}>
        <div className={styles.row}>
          <span>이름</span>
          <input type="text" name="emp_name" onChange={handleDataCheck} value={sendData.emp_name || ""} placeholder="이름을 입력하세요."/>
        </div>

        { /* Name empty check */
          sendData.emp_name !== "" ?
            <div className={styles.row}>
              { /* ID Check */
                checkData.emp_name ?
                  <p/>
                  :
                  <p style={{color: "red"}}>유효하지 않은 이름 유형입니다.</p>
              }
            </div>
            : <></>
        }

        <div className={styles.row}>
          <span>생년월일</span>
          <div>
            <input type="text" name="birth" onChange={handleDataCheck} max="6" placeholder="생년월일을 입력하세요."/>　-　
            <input type="text" name="gender" max="1" onChange={handleDataCheck} />******
          </div>

        </div>

        { /* Birth empty check */
          sendData.emp_birth !== "" && sendData.emp_gender !== "" ?
            <div className={styles.row}>
              {checkData.emp_birth && checkData.emp_gender ?
                <p/>
                :
                <p style={{color: "red"}}>유효하지 않은 생년월일</p>
              }
            </div>
            :
            <></>
        }

        <div className={styles.row}>
          <span>이메일</span>
          <input type="text" name="email" onChange={handleDataCheck} value={sendData.emp_email || ""} placeholder="E-Mail을 입력하세요."/>
        </div>

        { /* Birth empty check */
          sendData.emp_email !== "" ?
            <div className={styles.row}>
              {checkData.emp_email ?
                <p/>
                :
                <p style={{color: "red"}}>유효하지 않은 이메일</p>
              }
            </div>
            :
            <></>
        }

      </div>
    </div>
  );
};
