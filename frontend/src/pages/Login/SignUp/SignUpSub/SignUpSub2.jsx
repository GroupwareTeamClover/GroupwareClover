import styles from './SignUpSub.module.css'
import {failAlert, sendEmail, successAlert, timeAlert, validateEmail, validatePhone} from '../../../../commons/common'
import React, {useEffect, useState} from "react";
import axios from "axios";
import {BaseUrl} from "../../../../commons/config";
import {Loading} from "../../../../components/Loading/Loading";

export const SignUpSub2 = ({ sendData, checkData,  setSendData, setCheckData, setSignUpState }) => {

  const keys = ["empId", "empPw", "empName", "empEmail", "empBirth", "empGender", "empTel"];

  /** 로딩 상태 **/
  const [loading, setLoading] = useState(false);

  /** 입력 데이터 체크 **/
  const handleDataCheck = (e) => {
    let { name, value } = e.target;

    if (name === "empTel") {
      setSendData(prev => {
        const data = {...prev, [name]: value};
        if (validatePhone(data.empTel)) setCheckData(prev => ({...prev, [name]: true}));
        else setCheckData(prev => ({...prev, [name]: false}));
        return data;
      });
    }

    if(name === "empEmail") {
      setSendData( prev => {
        const data = { ...prev, [name]: value };
        if(validateEmail(sendData.empEmail)) setCheckData(prev => ({ ...prev, [name]: true}));
        else setCheckData(prev => ({ ...prev, [name]: false}));
        return data;
      });
    }

  }

  const [emailCheck, setEmailCheck] = useState(false);
  const [invalidate, setInvalidate] = useState(false);
  const [accessNum, setAccessNum] = useState({ code: 0, input: 0});

  /** E-mail 데이터 체크 **/
  const handleCodeDataCheck = (e) => {
    const { name, value } = e.target;
    if(name === "code" || name === "input") setAccessNum(prev => ({ ...prev, [name]:value }));
  }

  /** 인증번호 체크 **/
  const handleCheckCode = () => {
    if(parseInt(accessNum.code) === parseInt(accessNum.input)) {
      setInvalidate(true);
      successAlert("", "인증이 완료되었습니다.");
    }
    else failAlert("", "인증번호를 확인해주세요.");
  }

  /** 이메일로 인증번호 발송 **/
  const handleEmailCheck = () => {
    if(checkData.empEmail){
      successAlert("","인증번호를 발송하였습니다.");
      const ranNumber =  Math.floor(100000 + Math.random() * 900000);
      // 계정 조회 성공
      const data = {
        to_name: sendData.empName,
        to_email: sendData.empEmail,
        message: ranNumber
      }
      sendEmail(data);
      setAccessNum(prev => ({ ...prev, code: ranNumber }));
      setEmailCheck(true);
    } else {
      failAlert("", "E-mail을 확인하세요");
    }
  }

  /** 회원가입 완료 버튼 이벤트 **/
  const handleSubmit = async() => {
    let validation = true;
    keys.forEach(item => {
      if(!checkData[item]) validation = false;
    });

    if(validation) {
      let data = sendData;
      data.empGender = data.empGender%2 === 1 ? "M" : "F";
      delete data.pwCheck;

      setLoading(true);

      const res = await axios.post(`${BaseUrl()}/employee`, data);
      if(res.data === "ok"){
        timeAlert("회원가입 완료");
        setSignUpState(false);
        setLoading(false);
      }
    } else {
      //  checkData가 fales 인 부분으로 포커스 이동하는 로직 필요
      failAlert("", "회원가입 입력창을 확인해주세요");
    }

    setLoading(false);
  }

  const [successBtn, setSuccessBtn] = useState(false);
  useEffect(() => {
    let validation = true;
    keys.forEach(item => {
      if(!checkData[item]) validation = false;
    });
    if(validation) setSuccessBtn(true);
    else setSuccessBtn(false);
  }, [checkData]);

  return (
    <div className={styles.container}>

      { loading && <Loading /> }

      <div className={styles.title}>
        <h1>Join Employee!</h1>
      </div>
      <div className={styles.joinForm}>

        <div className={styles.row}>
          <span style={sendData.empTel !== "" ? (checkData.empTel ? { color: "#15dcdd" } : { color: "red" }) : undefined} >Tel.</span>
          <input type="text" name="empTel" onChange={handleDataCheck} value={sendData.empTel} placeholder=" ' - '를 제외한 전화번호를 입력하세요."/>
        </div>

        <div className={styles.row}>
          <span style={sendData.empEmail !== "" ? (checkData.empEmail ? { color: "#15dcdd" } : { color: "red" }) : undefined} >E-Mail</span>
          <input type="text" name="empEmail" value={sendData.empEmail} onChange={handleDataCheck} placeholder="E-Mail을 입력하세요."/>
        </div>
      </div>

      <div className={styles.row}>
        <button onClick={handleEmailCheck}>인증번호 받기</button>
      </div>

      {
        emailCheck &&
        <div className={styles.row}>
          <span style={accessNum.input !== "" ? (invalidate ? { color: "#15dcdd" } : { color: "black" }) : undefined} >인증번호</span>
          <div>
            <input type="text" name="input" onChange={handleCodeDataCheck} value={accessNum.input || ""} placeholder="인증번호"/>
            <button onClick={handleCheckCode}>인증번호 입력</button>
          </div>
        </div>
      }

      { invalidate &&
        <div className={styles.row}>
          <button onClick={handleSubmit}>완료</button>
        </div>
      }

    </div>
  );
};
