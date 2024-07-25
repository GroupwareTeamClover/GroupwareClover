import { useState } from "react";
import styles from "./SignUp.module.css";
import axios from "axios";

export const SignUp = () => {
  const [ idSave, setIdSave ] = useState("");
  const [idCheck, setIdCheck] = useState(false);

  const [ pwCheck, setPwCheck ] = useState(false);
  const [ pwSave, setPwSave ] = useState({pw:"", pwCheck:""});
  const handleIdCheck = async (e) => {
    setIdSave(e.target.value);
    if(e.target.value === "") setIdCheck(false);
    else setIdCheck(true);
    // const response = await axios.post("http://192.168.1.7/member", e.target.value);
    // if(response.status === 200 && response.data === "OK"){
    //   setIdCheck(true);
    // } else {
    //   setIdCheck(false);
    // }
  }

  const handlePwChck = (e) => {
    let { name, value } = e.target
    setPwSave(prev => {
      let data = {...prev, [name]: value}
      if(data.pw === data.pwCheck) setPwCheck(true);
      else setPwCheck(false);
      return data;
    });

  }

  return (
    <div className={styles.container}>
      <div className={styles.title}>
        <h1>Join Employee!</h1>
      </div>
      <div className={styles.joinForm}>
        <div className={styles.row}>
          <span>아이디</span>
        </div>
        <div className={styles.row}>
          <input type="text" name="id" onChange={handleIdCheck} placeholder="아이디를 입력하세요"/>
        </div>

        { /* ID empty check */
          idSave !== "" ?
            <div className={styles.row}>
              { /* ID Check */
                idCheck ?
                  <p style={{color: "green"}}>사용 가능한 아이디 입니다.</p>
                  :
                  <p style={{color: "red"}}>이미 사용중인 아이디 입니다.</p>
              }
            </div>
            : <></>
        }

        <div className={styles.row}>
          <span>비밀번호</span>
        </div>
        <div className={styles.row}>
          <input type="text" name="pw" onChange={handlePwChck} placeholder="비밀번호를 입력하세요"/>
        </div>
        <div className={styles.row}>
          <input type="text" name="pwCheck" onChange={handlePwChck} placeholder="비밀번호를 한번더 입력하세요"/>
        </div>

        { /* Password empty check */
          pwSave.pw !== "" || pwSave.pwCheck !== "" ?
            <div className={styles.row}>
              {pwCheck ?
                <p style={{color: "green"}}>비밀번호 일치</p>
                :
                <p style={{color: "red"}}>비밀번호 불일치</p>
              }
            </div>
            :
            <></>
        }

      </div>
    </div>
  );
};
