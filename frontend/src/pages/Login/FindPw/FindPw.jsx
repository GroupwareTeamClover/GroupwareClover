import styles from './FindPw.module.css'
import {useState} from "react";
import axios from "axios";
import {BaseUrl} from "../../../commons/config";

export const FindPw = () => {

  const [emailCheck, setEmailCheck] = useState(false);

  const [exists, setExists] = useState({empId: "", empEmail: ""});
  const [changePw, setChangePw] = useState({empSeq: "", empPw: "", pwCheck: ""});
  
  const handleCheckData = (e) => {
    const { name, value } = e.target;
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
      if(res.data) {
        alert("확인");
        setEmailCheck(true);
      }
      else alert("조건에 맞는 회원 없음");
    });
  }

  const handleSubmit = () => {

  }

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
            <div className={styles.row}>
              <span>인증번호</span>
              <div>
                <input type="text" name="post" placeholder="인증번호"/>
                <button onClick={handleSubmit}>인증번호 입력</button>
              </div>
            </div>
          </div>
          :
          <div className={styles.joinForm}>
            <div className={styles.row}>
              <span>새 비밀번호</span>
              <input type="password" name="empPw" maxLength="20" value={changePw.empPw || ""} onChange={handleChangeDate} placeholder="8~20자리로 입력하세요"/>
            </div>
            <div className={styles.row}>
              <span>새 비밀번호 확인</span>
              <input type="password" name="pwCheck" maxLength="20" value={changePw.pwCheck || ""} onChange={handleChangeDate} placeholder="8~20자리로 입력하세요"/>
            </div>
            <div className={styles.row}>
              <button onClick={handleSubmit}>비밀번호 변경</button>
            </div>
          </div>
      }

    </div>
  );
}