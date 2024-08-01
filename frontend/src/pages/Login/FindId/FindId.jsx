import styles from './FindId.module.css'
import {useState} from "react";
import axios from "axios";
import {BaseUrl} from "../../../commons/config";

export const FindId = () => {

  const [emailCheck, setEmailCheck] = useState(false);
  const [invalidate, setInvalidate] = useState(false);

  const [exists, setExists] = useState({empName: "", empEmail: ""});

  const handleDataCheck = (e) => {
    const { name, value } = e.target;
    setExists(prev => ({ ...prev, [name]: value }));
  }

  const handleEmailCheck = () => {
    if(emailCheck) setEmailCheck(false);
    else setEmailCheck(true);
  }

  const handleSubmit = () => {
    if(exists.empName === "" || exists.empEmail === ""){
      alert("입력하지 않은 값이 있습니다.");
      return false;
    }
    const params = { ...exists }
    // exists 계정 정보 확인 후 있다면 다음 로직 진행
    axios.get(`${BaseUrl()}/employee/exists`, {params}).then(res => {
      if(res.data) alert("확인");
      else alert("조건에 맞는 회원 없음");
    });
    // 이메일 인증 후 인증 번호가 맞다면 아이디 요청
    setInvalidate(true);
  }

  return (
    <div className={styles.container}>
      <div className={styles.title}>
        <h1>아이디 찾기</h1>
      </div>
      <div className={styles.joinForm}>
        <div className={styles.row}>
          <span>이름</span>
          <input type="text" name="empName" onChange={handleDataCheck} placeholder="이름을 입력하세요"/>
        </div>
        <div className={styles.row}>
          <span>이메일</span>
          <input type="text" name="empEmail" onChange={handleDataCheck} placeholder="E-Mail을 입력하세요."/>
        </div>
        <div className={styles.row}>
          <button onClick={handleEmailCheck}>인증번호 받기</button>
        </div>
        {
          emailCheck &&
          <div className={styles.row}>
            <span>인증번호</span>
            <div>
              <input type="text" name="post" placeholder="인증번호"/>
              <button onClick={handleSubmit}>인증번호 입력</button>
            </div>
          </div>
        }
        {
          invalidate &&
          <div className={styles.row}>
            <p>tester001 입니다.</p>
          </div>
        }
      </div>
    </div>
  )
    ;
}