import { useState } from "react";
import styles from "./SignUp.module.css";
import axios from "axios";
import { validateName, validateUserNo } from '../../../commons/common';

export const SignUp2 = () => {

  const [nameSave, setNameSave] = useState("");
  const [nameCheck, setNameCheck] = useState(false);

  const [birthSave, setBirthSave] = useState(0);
  const [birthCheck, setBirthCheck] = useState(false);

  const [genderSave, setGenderSav] = useState(0);
  const [genderCheck, setGenderCheck] = useState(false);

  const handleNameCheck = () => {

  }

  const handleBirthCheck = () => {

  }

  const handleGenderCheck = () => {

  }

  return (
    <div className={styles.container}>
      <div className={styles.title}>
        <h1>Join Employee!</h1>
      </div>
      <div className={styles.joinForm}>
        <div className={styles.row}>
          <span>이름</span>
        </div>
        <div className={styles.row}>
          <input type="text" name="name" onChange={handleNameCheck} placeholder="이름을 입력하세요."/>
        </div>

        { /* Name empty check */
          nameSave !== "" ?
            <div className={styles.row}>
              { /* ID Check */
                nameCheck ?
                  <p/>
                  :
                  <p style={{color: "red"}}>유효하지 않은 이름 유형입니다.</p>
              }
            </div>
            : <></>
        }

        <div className={styles.row}>
          <span>생년월일</span>
        </div>
        <div className={styles.row}>
          <input type="text" name="birth" onChange={handleBirthCheck} placeholder="생년월일을 입력하세요."/>
        </div>

        { /* Birth empty check */
          birthSave.pw === "" ?
            <div className={styles.row}>
              {birthCheck ?
                <p/>
                :
                <p style={{color: "red"}}>유효하지 않은 생년월일</p>
              }
            </div>
            :
            <></>
        }

        <div className={styles.row}>
          <span>이메일</span>
        </div>
        <div className={styles.row}>
          <input type="text" name="email" onChange={handleBirthCheck} placeholder="E-Mail을 입력하세요."/>
        </div>

      </div>
    </div>
  );
};
