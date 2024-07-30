import styles from './SignUpSub.module.css'
import {validateName, validateBirth, validateGender, validateEmail} from '../../../../commons/common'

export const SignUpSub2 = ({ sendData, checkData,  setSendData, setCheckData }) => {

  const handleDataCheck = (e) => {
    let { name, value } = e.target;

    if(name === "empName") {
      setSendData( prev => {
        const data = { ...prev, [name]: value};
        if(validateName(value)) setCheckData(prev => ({ ...prev, [name]: true}));
        else setCheckData(prev => ({ ...prev, [name]: false}));
        return data;
      });
    }

    if(name === "empBirth") {
      if(parseInt(value.slice(2,4)) > 12) return false;
      if(parseInt(value.slice(4,6)) > 31) return false;
      setSendData( prev => {
        const data = { ...prev, [name]: value };
        if(validateBirth(value)) setCheckData(prev => ({ ...prev, [name]: true}));
        else setCheckData(prev => ({ ...prev, [name]: false}));
        return data;
      });

    }

    if(name === "empGender") {
      if(value > 4) return false;
      setSendData( prev => {
        const data = { ...prev, [name]: value };
        if(validateGender(value)) setCheckData(prev => ({ ...prev, [name]: true}));
        else setCheckData(prev => ({ ...prev, [name]: false}));
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

  return (
    <div className={styles.container}>
      <div className={styles.title}>
        <h1>Join Employee!</h1>
      </div>
      <div className={styles.joinForm}>
        <div className={styles.row}>
          <span>이름</span>
          <input type="text" name="empName" onChange={handleDataCheck} value={sendData.empName || ""} placeholder="이름을 입력하세요."/>
        </div>

        { /* Name empty check */
          sendData.empName !== "" ?
            <div className={styles.row}>
              { /* Name Check */
                checkData.empName ?
                    <p style={{color: "green"}}>확인되었습니다.</p>
                    :
                    <p style={{color: "red"}}>유효하지 않은 이름 유형입니다.</p>
              }
            </div>
              : <></>
        }

        <div className={styles.row}>
          <span>생년월일</span>
          <div>
            <input type="text" name="empBirth" maxLength="6" value={ sendData.empBirth || "" } onChange={handleDataCheck} placeholder=""/>　-　
            <input type="text" name="empGender" maxLength="1" value={ sendData.empGender || "" } onChange={handleDataCheck} /> ******
          </div>
        </div>

        { /* Birth & Gender empty check */
          sendData.empBirth !== "" && sendData.empGender !== "" ?
            <div className={styles.row}>
              { /* Birth & Gender check */
                checkData.empBirth && checkData.empGender ?
                  <p style={{color: "green"}}>확인되었습니다.</p>
                  :
                  <p style={{color: "red"}}>유효하지 않은 생년월일</p>
              }
            </div>
              :
            <></>
        }

        <div className={styles.row}>
          <span>이메일</span>
          <input type="text" name="empEmail" value={sendData.empEmail} onChange={handleDataCheck} placeholder="E-Mail을 입력하세요."/>
        </div>

        { /* E-Mail empty check */
          sendData.empEmail !== "" ?
              <div className={styles.row}>
                { /* E-Mail check */
                  checkData.empEmail ?
                  <p style={{color: "green"}}>확인되었습니다.</p>
                  :
                  <p style={{color: "red"}}>유효하지 않은 이메일</p>
        }
      </div>
      :
      <></>
        }
      </div>
    </div>
  );
};
