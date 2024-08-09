// import styles from './SignUpSub.module.css'
// import {validatePhone} from '../../../../commons/common';
// import Postcode from "react-daum-postcode";
// import React, {useEffect, useState} from "react";
// import {Modal} from "../../../../components/Modal/Modal";
// import axios from "axios";
// import {BaseUrl} from "../../../../commons/config";
//
//
// export const SignUpSub3 = ({ sendData, checkData,  setSendData, setCheckData, setSignUpState }) => {
//   const keys = ["empId", "empPw", "empName", "empEmail", "empBirth", "empGender", "empTel", "empAddress"];
//   const [ isModalOpen, setIsModalOpen ] = useState(false);
//   const openModal = () => setIsModalOpen(true);
//   const closeModal = () => setIsModalOpen(false);
//
//   const handleDataCheck = (e) => {
//     let {name, value} = e.target;
//
//     if (name === "empTel") {
//       setSendData(prev => {
//         const data = {...prev, [name]: value};
//         if (validatePhone(data.empTel)) setCheckData(prev => ({...prev, [name]: true}));
//         else setCheckData(prev => ({...prev, [name]: false}));
//         return data;
//       });
//     }
//
//     if(name === "detailAddress") {
//       setSendData(prev => ({ ...prev, [name]: value}));
//       if(sendData.postcode === "" || sendData.roadAddress === "" || sendData.detailAddress === "") {
//         setCheckData( prev => ({...prev, empAddress: false}));
//       } else {
//         setCheckData( prev => ({...prev, empAddress: true}));
//       }
//     }
//   }
//
//   const completeHandler = (data) => {
//     setSendData(prev => ({ ...prev, postcode: data.zonecode, roadAddress: data.roadAddress }))
//     closeModal();
//   }
//
//   const handleSubmit = async() => {
//     let validation = true;
//     keys.forEach(item => {
//       if(!checkData[item]) validation = false;
//     });
//
//     if(validation) {
//       let data = sendData;
//       data.empGender = data.empGender%2 === 1 ? "M" : "F";
//       data.empAddress = data.roadAddress + " " + data.detailAddress;
//       delete data.pwCheck;
//       delete data.postcode;
//       delete data.roadAddress;
//       delete data.detailAddress
//       console.log(data);
//
//       const res = await axios.post(`${BaseUrl()}/employee`, sendData);
//
//       if(res.data === "ok"){
//         alert("회원가입 완료");
//         setSignUpState(false);
//       }
//
//     } else {
//       //  checkData가 fales 인 부분으로 포커스 이동하는 로직 필요
//       alert("회원가입 입력창을 확인해주세요");
//     }
//   }
//
//   const [successBtn, setSuccessBtn] = useState(false);
//   useEffect(() => {
//     let validation = true;
//     keys.forEach(item => {
//       if(!checkData[item]) validation = false;
//     });
//     if(validation) setSuccessBtn(true);
//     else setSuccessBtn(false);
//   }, [checkData]);
//
//   useEffect(() => {
//     if(sendData.postcode === "" || sendData.roadAddress === "" || sendData.detailAddress === "") {
//       setCheckData( prev => ({...prev, empAddress: false}));
//     } else {
//       setCheckData( prev => ({...prev, empAddress: true}));
//     }
//   }, [sendData.postcode]);
//
//   return (
//       <div className={styles.container}>
//         <div className={styles.title}>
//           <h1>Join Employee!</h1>
//         </div>
//         <div className={styles.joinForm}>
//
//           <div className={styles.row}>
//             <span>전화번호</span>
//             <input type="text" name="empTel" onChange={handleDataCheck} value={sendData.empTel} placeholder=" ' - '를 제외한 전화번호를 입력하세요."/>
//           </div>
//
//           { /* Tel empty check */
//             sendData.empTel !== "" ?
//                 <div className={styles.row}>
//                   { /* Tel Check */
//                     checkData.empTel ?
//                         <p style={{color: "green"}}>확인되었습니다.</p>
//                         :
//                         <p style={{color: "red"}}>유효하지 않은 전화번호 유형입니다.</p>
//                   }
//                 </div>
//                 : <></>
//           }
//
//           <div className={styles.row}>
//             <span>주소</span>
//             <div>
//               <input type="text" name="postcode" value={sendData.postcode} placeholder="우편번호" readOnly/>
//               <button onClick={() =>  openModal()}>주소 검색</button>
//             </div>
//             <input type="text" name="roadAddress" value={sendData.roadAddress} placeholder="기본주소" readOnly/>
//             <input type="text" name="detailAddress" value={sendData.detailAddress||""} onChange={handleDataCheck} placeholder="상세주소"/>
//           </div>
//
//           { /* Address empty check */
//             sendData.detailAddress !== "" ?
//                 <div className={styles.row}>
//                   { /* Address Check */
//                     checkData.empAddress ?
//                         <p style={{color: "green"}}>확인되었습니다.</p>
//                         :
//                         <p style={{color: "red"}}>주소를 입력해주세요</p>
//                   }
//                 </div>
//                 :
//                 <></>
//           }
//           { successBtn &&
//               <div className={styles.row}>
//                 <button onClick={handleSubmit}>완료</button>
//               </div>
//           }
//
//
//           <Modal isOpen={isModalOpen} onClose={closeModal}>
//             <Postcode onComplete={ completeHandler } />
//           </Modal>
//
//         </div>
//       </div>
//   );
// };
