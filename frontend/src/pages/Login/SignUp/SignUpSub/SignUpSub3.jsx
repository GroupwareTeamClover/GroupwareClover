import {useEffect, useState} from "react";
import styles from './SignUpSub.module.css'
import axios from "axios";
import {validatePhone} from '../../../../commons/common';
import baseUrl from '../../../../api/members';

export const SignUpSub3 = ({ sendData, checkData,  setSendData, setCheckData }) => {

  const handleDataCheck = (e) => {
    let {name, value} = e.target;

    if (name === "emp_tel") {
      setSendData(prev => {
        const data = {...prev, [name]: value};
        if (validatePhone(data.emp_tel)) setCheckData(prev => ({...prev, [name]: true}));
        else setCheckData(prev => ({...prev, [name]: false}));
        return data;
      });
    }
  }

  const handleSubmit = async() => {
    console.log("sendData ==== ", sendData);
    console.log("checkData ==== ", checkData);
    const keys = ["emp_id", "emp_pw", "emp_name", "emp_email", "emp_birth", "emp_gender", "emp_tel", "emp_address"];
    let validation = true;
    keys.forEach(item => {
      if(!sendData[item]) validation = false;
    })
    // if(validation) {
    //   const res = await axios.post(`${baseUrl}/member`, sendData);
    //   console.log("res.data === ", res.data);
    // }

  }

  return (
    <div className={styles.container}>
      <div className={styles.title}>
        <h1>Join Employee!</h1>
      </div>
      <div className={styles.joinForm}>

        <div className={styles.row}>
          <span>전화번호</span>
          <input type="text" name="emp_tel" onChange={handleDataCheck} value={sendData.emp_tel} placeholder=" ' - '를 제외한 전화번호를 입력하세요."/>
        </div>

        { /* Name empty check */
          sendData.emp_tel !== "" ?
            <div className={styles.row}>
              { /* ID Check */
                checkData.emp_tel ?
                  <p/>
                  :
                  <p style={{color: "red"}}>유효하지 않은 전화번호 유형입니다.</p>
              }
            </div>
            : <></>
        }

        <div className={styles.row}>
          <span>주소</span>
          <div>
            <input type="text" name="post" placeholder="우편번호" readOnly/>
            <button>주소 검색</button>
          </div>
          <input type="text" name="address1" placeholder="기본주소" readOnly/>
          <input type="text" name="address2" placeholder="상세주소"/>
        </div>

        { /* Address empty check */
          sendData.address === "" ?
            <div className={styles.row}>
              { /* Address Check */
                checkData.address ?
                <p />
                :
                <p style={{color: "red"}}>주소를 입력해주세요</p>
              }
            </div>
            :
            <></>
        }

        <div className={styles.row}>
          <button onClick={handleSubmit}>완료</button>
        </div>

      </div>
    </div>
  );
};
