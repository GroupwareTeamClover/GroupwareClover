import styles from './FindPw.module.css'
import {useState} from "react";

export const FindPw = () => {

  const [emailCheck, setEmailCheck] = useState(false);

  const handleDataCheck = () => {

  }

  const handleEmailCheck = () => {

  }

  const handleSubmit = () => {
    if(emailCheck) setEmailCheck(false);
    else setEmailCheck(true);
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
              <input type="text" name="emp_id" onChange={handleDataCheck} placeholder="ID를 입력하세요."/>
            </div>
            <div className={styles.row}>
              <span>이메일</span>
              <input type="text" name="emp_email" onChange={handleDataCheck} placeholder="E-Mail을 입력하세요."/>
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
              <input type="text" name="emp_pw" maxLength="20" onChange={handleDataCheck} placeholder="8~20자리로 입력하세요"/>
            </div>
            <div className={styles.row}>
              <span>새 비밀번호 확인</span>
              <input type="text" name="pw_check" maxLength="20" onChange={handleDataCheck} placeholder="8~20자리로 입력하세요"/>
            </div>
            <div className={styles.row}>
              <button onClick={handleSubmit}>인증번호 받기</button>
            </div>
          </div>
      }

    </div>
  );
}