import { useState } from "react";
import styles from "./SignUp.module.css";
import axios from "axios";
import { validateUserId, validatePassword } from '../../../commons/common';

export const SignUp = () => {
  const [ idSave, setIdSave ] = useState("");
  const [idCheck, setIdCheck] = useState(false);

  const [ pwCheck, setPwCheck ] = useState(false);
  const [ pwSave, setPwSave ] = useState({pw:"", pwCheck:""});
  const handleIdCheck = async (e) => {
    setIdSave(e.target.value);

    // 정규 표현식
    if(validateUserId(idSave)) setIdCheck(true);
    else setIdCheck(false);

    // const response = await axios.post("http://192.168.1.7/member", e.target.value);
    // if(response.status === 200 && response.data === "OK"){
    //   if(validateUserId(idSave)) setIdCheck(true);
    //   else setIdCheck(false);
    // } else {
    //   setIdCheck(false);
    // }

  }

  const handlePwChck = (e) => {
    let { name, value } = e.target
    setPwSave(prev => {
      let data = {...prev, [name]: value}
      if(data.pw === data.pwCheck) {
        if(validatePassword(data.pw)) setPwCheck(true);
        else setPwCheck(false);
      }
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
          <input type="text" name="id" onChange={handleIdCheck} placeholder="6~12자리로 작성해주세요!"/>
        </div>

        { /* ID empty check */
          idSave !== "" ?
            <div className={styles.row}>
              { /* ID Check */
                idCheck ?
                  <p style={{color: "green"}}>사용 가능한 아이디 입니다.</p>
                  :
                  <p style={{color: "red"}}>사용할 수 없는 아이디 입니다.</p>
              }
            </div>
            : <></>
        }

        <div className={styles.row}>
          <span>비밀번호</span>
        </div>
        <div className={styles.row}>
          <input type="text" name="pw" onChange={handlePwChck} placeholder="8~20자리로 입력하세요"/>
        </div>
        <div className={styles.row}>
          <input type="text" name="pwCheck" onChange={ handlePwChck } placeholder="8~20자리로 한번더 입력하세요"/>
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
