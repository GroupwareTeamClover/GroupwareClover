import {useState} from "react";
import styles from "./SignUp.module.css";
import {SignUpSub1} from "./SignUpSub/SignUpSub1";
import {SignUpSub2} from "./SignUpSub/SignUpSub2";
import {SignUpSub3} from "./SignUpSub/SignUpSub3";

export const SignUp = ({setSignUpState}) => {

  const defaultData = {
    empId: "",
    empPw: "",
    empName: "",
    empEmail: "",
    empBirth: "",
    empGender: "",
    empTel: "",
    empAddress: "",
    pwCheck: "",
    postcode: "",
    roadAddress: "",
    detailAddress: "",
  }
  const [sendData, setSendData] = useState(defaultData);

  const defaultCheckData = {
    empId: false,
    empPw: false,
    empName: false,
    empEmail: false,
    empBirth: false,
    empGender: false,
    empTel: false,
    empAddress: false
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
                                           setCheckData={setCheckData} setSignUpState={setSignUpState}/>}
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
