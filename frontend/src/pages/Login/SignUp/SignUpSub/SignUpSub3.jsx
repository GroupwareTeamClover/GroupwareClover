import styles from './SignUpSub.module.css'
import {validatePhone} from '../../../../commons/common';
import Postcode from "react-daum-postcode";
import React, {useState} from "react";
import {Modal} from "../../../../components/Modal/Modal";


export const SignUpSub3 = ({ sendData, checkData,  setSendData, setCheckData }) => {
  const [ isModalOpen, setIsModalOpen ] = useState(false);
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleDataCheck = (e) => {
    let {name, value} = e.target;

    if (name === "emp_tel") {
      setSendData(prev => {
        const data = {...prev, [name]: value};
        if (validatePhone(data.emp_tel)) setCheckData(prev => ({...prev, [name]: true}));
        else setCheckData(prev => ({...prev, [name]: false}));
        return data;
      });
    }
  }

  const completeHandler = (data) => {
    setSendData(prev => ({ ...prev, postcode: data.zonecode, roadAddress: data.roadAddress }))
    closeModal();
  }

  const handleDetailAddress = (e) => {
    let { name, value } = e.target;
    setSendData(prev => ({ ...prev, [name]: value}));
    if(sendData.postcode === "" || sendData.roadAddress === "") {
      setCheckData( prev => ({...prev, emp_address: false}));
    } else {
      setCheckData( prev => ({...prev, emp_address: true}));
    }
  }



  const handleSubmit = async() => {
    console.log("sendData ==== ", sendData);
    console.log("checkData ==== ", checkData);
    const keys = ["emp_id", "emp_pw", "emp_name", "emp_email", "emp_birth", "emp_gender", "emp_tel", "emp_address"];
    let validation = true;
    keys.forEach(item => {
      if(!checkData[item]) validation = false;
    });

    if(validation) {
      let data = sendData;
      data.emp_gender = data.emp_gender%2 === 1 ? "M" : "F";
      data.emp_address = data.roadAddress + " " + data.detailAddress;
      delete data.pw_check;
      delete data.postcode;
      delete data.roadAddress;
      delete data.detailAddress
      console.log(data);
    }

    // if(validation) {
    //   const res = await axios.post(`${baseUrl}/member`, sendData);
    //   console.log("res.data === ", res.data);
    // }

  }

  return (
    <div className={styles.container}>
      <div className={styles.title}>
        <h1>Join Employee!</h1>
      </div>
      <div className={styles.joinForm}>

        <div className={styles.row}>
          <span>전화번호</span>
          <input type="text" name="emp_tel" onChange={handleDataCheck} value={sendData.emp_tel} placeholder=" ' - '를 제외한 전화번호를 입력하세요."/>
        </div>

        { /* Name empty check */
          sendData.emp_tel !== "" ?
            <div className={styles.row}>
              { /* ID Check */
                checkData.emp_tel ?
                    <p style={{color: "green"}}>확인되었습니다.</p>
                    :
                    <p style={{color: "red"}}>유효하지 않은 전화번호 유형입니다.</p>
              }
            </div>
              : <></>
        }

        <div className={styles.row}>
          <span>주소</span>
          <div>
            <input type="text" value={sendData.postcode} placeholder="우편번호" readOnly/>
            <button onClick={() =>  openModal()}>주소 검색</button>
          </div>
          <input type="text" value={sendData.roadAddress} placeholder="기본주소" readOnly/>
          <input type="text" value={sendData.detailAddress||""} onChange={handleDetailAddress} name="detailAddress" placeholder="상세주소"/>
        </div>

        { /* Address empty check */
          sendData.detailAddress !== "" ?
            <div className={styles.row}>
              { /* Address Check */
                checkData.emp_address ?
                    <p style={{color: "green"}}>확인되었습니다.</p>
                    :
                    <p style={{color: "red"}}>주소를 입력해주세요</p>
              }
            </div>
              :
              <></>
        }

        <div className={styles.row}>
          <button onClick={handleSubmit}>완료</button>
        </div>

        <Modal isOpen={isModalOpen} onClose={closeModal}>
          <Postcode onComplete={ completeHandler } />
        </Modal>

      </div>
    </div>
  );
};
