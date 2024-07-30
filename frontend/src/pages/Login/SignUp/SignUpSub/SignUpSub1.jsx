import styles from './SignUpSub.module.css'
import { validateUserId, validatePassword } from '../../../../commons/common'
import {useEffect} from "react";
import axios from "axios";
import {BaseUrl} from "../../../../commons/config";
export const SignUpSub1 = ({ sendData, checkData, setSendData, setCheckData }) => {

  const handleDataCheck = (e) => {
    let { name, value } = e.target;

    if(name === "empId") {
      if(value !== ""){
        axios.get(`${BaseUrl()}/sign/${value}`).then(resp => {
          if(resp.data === "ok") {
            if(validateUserId(value)) setCheckData(prev => ({ ...prev, [name]: true}));
            else setCheckData(prev => ({ ...prev, [name]: false}));
          } else setCheckData(prev => ({ ...prev, [name]: false}));
        });
      }
      setSendData( prev => ({ ...prev, [name]: value}));
    }

    if(name === "empPw" || name === "pwCheck") {
      setSendData(prev =>  ({...prev, [name]: value}));
    }

  }

  useEffect(() => {
    if(sendData.empPw === sendData.pwCheck) {
      if(validatePassword(sendData.empPw)) setCheckData(prev => ({ ...prev, empPw: true}));
      else setCheckData(prev => ({ ...prev, empPw: false}));
    } else setCheckData(prev => ({ ...prev, empPw: false}));
  }, [sendData.empPw, sendData.pwCheck]);


  return (
      <div className={styles.container}>
        <div className={styles.title}>
          <h1>Join Employee!</h1>
        </div>
        <div className={styles.joinForm}>
          <div className={styles.row}>
            <span>아이디</span>
            <input type="text" name="empId" maxLength="12" onChange={handleDataCheck} value={sendData.empId}
                   placeholder="6~12자리로 작성해주세요!"/>
          </div>

          { /* ID empty check */
            sendData.empId !== "" ?
                <div className={styles.row}>
                  { /* ID Check */
                    checkData.empId ?
                        <p style={{color: "green"}}>사용 가능한 아이디 입니다.</p>
                        :
                        <p style={{color: "red"}}>사용할 수 없는 아이디 입니다.</p>
                  }
                </div>
                : <></>
          }

          <div className={styles.row}>
            <span>비밀번호</span>
            <input type="password" name="empPw" maxLength="20" onChange={handleDataCheck} value={sendData.empPw}
                   placeholder="8~20자리로 입력하세요"/>
          </div>
          <div className={styles.row}>
            <input type="password" name="pwCheck" maxLength="20" onChange={handleDataCheck} value={ sendData.pwCheck } placeholder="8~20자리로 한번더 입력하세요"/>
          </div>

          { /* Password empty check */
            sendData.empPw !== "" ?
                <div className={styles.row}>
                  { /* Password check */
                    checkData.empPw ?
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