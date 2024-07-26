import { useState } from "react";
import styles from "./SignUp.module.css";
import axios from "axios";
import { validateUserId, validatePassword } from '../../../commons/common';

export const SignUp3 = () => {

  const [nameSave, setNameSave] = useState("");
  const [nameCheck, setNameCheck] = useState(false);

  const [birthSave, setBirthSave] = useState("");
  const [birthCheck, setBirthCheck] = useState(false);

  const handleNameCheck = () => {

  }

  const handleBirthChck = () => {

  }

  return (
    <div className={styles.container}>
      <div className={styles.title}>
        <h1>Join Employee!</h1>
      </div>
      <div className={styles.joinForm}>
        <div className={styles.row}>
          <span>전화번호</span>
        </div>
        <div className={styles.row}>
          <input type="text" name="name" onChange={handleNameCheck} placeholder=" ' - '를 제외한 전화번호를 입력하세요."/>
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
          <span>주소</span>
        </div>
        <div className={styles.row}>
          <div>
            <button>주소 검색</button>
            <input type="text" name="post" placeholder="우편번호"/>
          </div>
          <input type="text" name="address1" placeholder="기본주소"/>
          <input type="text" name="address2" placeholder="상세주소"/>
        </div>

        { /* Birth empty check */
          birthSave.pw === "" ?
            <div className={styles.row}>
              {birthCheck ?
                <p style={{color: "green"}}>비밀번호 일치</p>
                :
                <p style={{color: "red"}}>비밀번호 불일치</p>
              }
            </div>
            :
            <></>
        }

        <div className={styles.row}>
          <button>완료</button>
        </div>

      </div>
    </div>
  );
};
