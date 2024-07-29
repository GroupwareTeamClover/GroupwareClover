import {useEffect, useState} from "react";
import styles from "./SignUp.module.css";
import axios from "axios";
import {SignUpSub1} from "./SignUpSub/SignUpSub1";
import {SignUpSub2} from "./SignUpSub/SignUpSub2";
import {SignUpSub3} from "./SignUpSub/SignUpSub3";
import {validatePassword, validateUserId} from "../../../commons/common";

export const SignUp = ({setSignUpState}) => {

  const defaultData = {
    emp_id: "",
    emp_pw: "",
    emp_name: "",
    emp_email: "",
    emp_birth: "",
    emp_gender: "",
    emp_tel: "",
    emp_address: "",
    pw_check: ""
  }
  const [sendData, setSendData] = useState(defaultData);

  const defaultCheckData = {
    emp_id: false,
    emp_pw: false,
    emp_name: false,
    emp_email: false,
    emp_birth: false,
    emp_gender: false,
    emp_tel: false,
    emp_address: false
  }
  const [checkData, setCheckData] = useState(defaultCheckData);

  const [signUpPage, setSignUpPage] = useState(1);

  const handlePageChange = (e) =>{
    setSignUpPage(prev => {
      if(e.target.name === "prev") {
        if(prev === 1) return 1;
        else return prev - 1;
      } else {
        if(prev === 3) return 3;
        else return prev + 1;
      }
    });
  }


  return (
      <div className={styles.container}>
        <div className={styles.form}>
          {signUpPage === 1 && <SignUpSub1 sendData={sendData} checkData={checkData} setSendData={setSendData}
                                           setCheckData={setCheckData}/>}
          {signUpPage === 2 && <SignUpSub2 sendData={sendData} checkData={checkData} setSendData={setSendData}
                                           setCheckData={setCheckData}/>}
          {signUpPage === 3 && <SignUpSub3 sendData={sendData} checkData={checkData} setSendData={setSendData}
                                           setCheckData={setCheckData}/>}
          <div className={styles.btnBox}>
            <button onClick={() => setSignUpState(false)}>취소</button>
            <div className={styles.prevNext}>
              <button name="prev" onClick={handlePageChange}>이전</button>
              <button name="next" onClick={handlePageChange}>다음</button>
            </div>
          </div>

        </div>
      </div>
  );
};
