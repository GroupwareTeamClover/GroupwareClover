import styles from './FindPw.module.css'
import {useEffect, useState} from "react";
import axios from "axios";
import {BaseUrl} from "../../../commons/config";
import {validatePassword} from "../../../commons/common";

export const FindPw = ({closeModal}) => {

  const [emailCheck, setEmailCheck] = useState(false);
  const [invalidate, setInvalidate] = useState(false);

  const [exists, setExists] = useState({empId: "", empEmail: ""});
  const [accessNum, setAccessNum] = useState({ code: 0, input: 0});
  const [changePw, setChangePw] = useState({empSeq: 0, empPw: "", pwCheck: "", check: false});
  
  const handleCheckData = (e) => {
    const { name, value } = e.target;
    if(name === "code" || name === "input") setAccessNum(prev => ({ ...prev, [name]:value }));
    setExists(prev => ({ ...prev, [name]: value }));
  }

  const handleChangeDate = (e) => {
    const { name, value } = e.target;
    setChangePw(prev => ({ ...prev, [name]: value }));
  }

  const handleEmailCheck = () => {
    if(exists.empId === "" || exists.empEmail === ""){
      alert("입력하지 않은 값이 있습니다.");
      return false;
    }

    const params = { ...exists }
    // exists 계정 정보 확인 후 있다면 다음 로직 진행
    axios.get(`${BaseUrl()}/employee/exists`, {params}).then(res => {
      // 이메일 인증 후 인증 번호가 맞다면 아이디 요청
      const ranNumber =  Math.floor(100000 + Math.random() * 900000);
      console.log("ranNumber ====== ", ranNumber);
      if(res.data.empSeq > 0) {
        // 계정 조회 성공
        // const data = {
        //   to_name: exists.empId,
        //   message: ranNumber
        // }
        // sendEmail(data);
        setAccessNum(prev => ({ ...prev, code: ranNumber }));
        setChangePw(prev => ({ ...prev, empSeq: res.data.empSeq }));
        setInvalidate(true);
      }
      else alert("조건에 맞는 회원 없음");
    });
  }

  const handleAccessCode = () => {
    if(parseInt(accessNum.code) === parseInt(accessNum.input)) {
      setEmailCheck(true);
      alert("인증 완료");
    }
    else alert("인증번호 틀림");
  }

  const handleSubmit = () => {
    if(changePw.check){
      delete changePw.pwCheck;
      delete changePw.check;
      axios.put(`${BaseUrl()}/employee/${changePw.empSeq}`, changePw).then(res => {
        console.log(res.data);
        if(res.data === "ok") {
          alert("비밀번호 변경이 완료되었습니다.");
          closeModal();
        }
      });
    }
  }

  useEffect(() => {
    if(changePw.empPw === changePw.pwCheck) {
      if(validatePassword(changePw.empPw)) setChangePw(prev => ({ ...prev, check: true}));
      else setChangePw(prev => ({ ...prev, check: false}));
    } else setChangePw(prev => ({ ...prev, check: false}));
  }, [changePw.empPw, changePw.pwCheck]);

  return (
    <div className={styles.container}>
      <div className={styles.title}>
        <h1>비밀번호 찾기</h1>
      </div>
      {
        !emailCheck ?
          <div className={styles.joinForm}>
            <div className={styles.row}>
              <span>아이디</span>
              <input type="text" name="empId" onChange={handleCheckData} placeholder="ID를 입력하세요."/>
            </div>
            <div className={styles.row}>
              <span>이메일</span>
              <input type="text" name="empEmail" onChange={handleCheckData} placeholder="E-Mail을 입력하세요."/>
            </div>
            <div className={styles.row}>
              <button onClick={handleEmailCheck}>인증번호 받기</button>
            </div>
            {invalidate &&
                <div className={styles.row}>
                  <span>인증번호</span>
                  <div>
                    <input type="text" name="input" onChange={handleCheckData} value={accessNum.input || ""}
                           placeholder="인증번호"/>
                    <button onClick={handleAccessCode}>인증번호 입력</button>
                  </div>
                </div>
            }
          </div>
            :
            <div className={styles.joinForm}>
              <div className={styles.row}>
                <span>새 비밀번호</span>
                <input type="password" name="empPw" maxLength="20" value={changePw.empPw || ""}
                       onChange={handleChangeDate} placeholder="8~20자리로 입력하세요"/>
            </div>
            <div className={styles.row}>
              <input type="password" name="pwCheck" maxLength="20" value={changePw.pwCheck || ""} onChange={handleChangeDate} placeholder="8~20자리로 입력하세요"/>
              <span className={styles.description}>비밀번호는 영문 대문자, 소문자, 숫자, 특수문자를</span>
              <span className={styles.description}>각각 한개이상을 포함해야 합니다.</span>
            </div>
              { /* Password empty check */
                (changePw.empPw !== "" || changePw.pwCheck !== "")?
                    <div className={styles.row}>
                      { /* Password check */
                        changePw.check ?
                            <p style={{color: "green"}}>비밀번호 일치</p>
                            :
                            <p style={{color: "red"}}>비밀번호 불일치 또는 형식 오류</p>
                      }
                    </div>
                    :
                    <></>
              }
            <div className={styles.row}>
              <button onClick={handleSubmit}>비밀번호 변경</button>
            </div>
          </div>
      }

    </div>
  );
}