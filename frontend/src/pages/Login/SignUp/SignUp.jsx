import { useState } from "react";
import styles from "./SignUp.module.css";
import axios from "axios";
import { validateUserId, validatePassword } from '../../../commons/common';
import {SignUpSub1} from "./SignUpSub/SignUpSub1";
import {SignUpSub2} from "./SignUpSub/SignUpSub2";
import {SignUpSub3} from "./SignUpSub/SignUpSub3";

export const SignUp = ({ signUpPage }) => {

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

  // 회원가입 직전에 delete sendData.pw_check 해야됨

  return (
    <div className={styles.container}>
      {signUpPage === 1 && <SignUpSub1 sendData={sendData} checkData={checkData} setSendData={setSendData} setCheckData={setCheckData} />}
      {signUpPage === 2 && <SignUpSub2 sendData={sendData} checkData={checkData} setSendData={setSendData} setCheckData={setCheckData} />}
      {signUpPage === 3 && <SignUpSub3 sendData={sendData} checkData={checkData} setSendData={setSendData} setCheckData={setCheckData} />}
    </div>
  );
};
