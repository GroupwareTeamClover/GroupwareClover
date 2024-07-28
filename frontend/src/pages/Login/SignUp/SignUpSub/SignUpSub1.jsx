import styles from './SignUpSub.module.css'
import { validateUserId, validatePassword } from '../../../../commons/common'
import {useEffect} from "react";
export const SignUpSub1 = ({ sendData, checkData, setSendData, setCheckData }) => {

  const handleDataCheck = (e) => {
    let { name, value } = e.target;

    if(name === "emp_id") {
      setSendData( prev => {
        const data = { ...prev, [name]: value}
        if(validateUserId(value)) setCheckData(prev => ({ ...prev, [name]: true}));
        else setCheckData(prev => ({ ...prev, [name]: false}));
        return data;
      });
    }

    if(name === "emp_pw" || name === "pw_check") {
      setSendData(prev =>  ({...prev, [name]: value}));
    }

  }

  useEffect(() => {
    if(sendData.emp_pw === sendData.pw_check) {
      if(validatePassword(sendData.emp_pw)) setCheckData(prev => ({ ...prev, emp_pw: true}));
      else setCheckData(prev => ({ ...prev, emp_pw: false}));
    } else setCheckData(prev => ({ ...prev, emp_pw: false}));
  }, [sendData.emp_pw, sendData.pw_check]);


  return (
    <div className={styles.container}>
      <div className={styles.title}>
        <h1>Join Employee!</h1>
      </div>
      <div className={styles.joinForm}>
        <div className={styles.row}>
          <span>아이디</span>
          <input type="text" name="emp_id" maxLength="12" onChange={handleDataCheck} value={sendData.emp_id}
                 placeholder="6~12자리로 작성해주세요!"/>
        </div>

        { /* ID empty check */
          sendData.emp_id !== "" ?
            <div className={styles.row}>
              { /* ID Check */
                checkData.emp_id ?
                  <p style={{color: "green"}}>사용 가능한 아이디 입니다.</p>
                  :
                  <p style={{color: "red"}}>사용할 수 없는 아이디 입니다.</p>
              }
            </div>
            : <></>
        }

        <div className={styles.row}>
          <span>비밀번호</span>
          <input type="text" name="emp_pw" maxLength="20" onChange={handleDataCheck} value={sendData.emp_pw}
                 placeholder="8~20자리로 입력하세요"/>
        </div>
        <div className={styles.row}>
          <input type="text" name="pw_check" maxLength="20" onChange={handleDataCheck} value={ sendData.pw_check } placeholder="8~20자리로 한번더 입력하세요"/>
        </div>

        { /* Password empty check */
          sendData.emp_pw !== "" ?
            <div className={styles.row}>
              { /* Password check */
                checkData.emp_pw ?
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
}