import styles from './FindId.module.css'
import {useState} from "react";

export const FindId = () => {

  const [emailCheck, setEmailCheck] = useState(false);
  const [invalidate, setInvalidate] = useState(false);

  const handleDataCheck = () => {

  }

  const handleEmailCheck = () => {
    if(emailCheck) setEmailCheck(false);
    else setEmailCheck(true);
  }

  const handleSubmit = () => {
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
          <input type="text" name="emp_name" onChange={handleDataCheck} placeholder="이름을 입력하세요"/>
        </div>
        <div className={styles.row}>
          <span>이메일</span>
          <input type="text" name="emp_email" onChange={handleDataCheck} placeholder="E-Mail을 입력하세요."/>
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