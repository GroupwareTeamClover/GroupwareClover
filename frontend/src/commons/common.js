import emailjs from '@emailjs/browser'
import Swal from "sweetalert2";
import axios from "axios";
import {BaseUrl} from "./config";

// =============================== [ Alert ] ===============================

export const timeAlert = (title) => {
  Swal.fire({
    position: "top-center",
    icon: "success",
    title,
    showConfirmButton: false,
    timer: 1000
  });
}

export const successAlert = (title, text) => {
  Swal.fire({
    title,
    text,
    icon: "success"
  });
}

export const failAlert = (title, text) => {
  Swal.fire({
    title,
    text,
    icon: "error"
  });
}

export const confirmAlert = (title, text) => {
  return Swal.fire({
    title,
    text,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    cancelButtonText: "취소",
    confirmButtonText: "확인"
  })
}

// 조그마한 Alert
export const smallAlert = (text) => {
	Swal.fire({
		// position:" top",
		text,
    confirmButtonColor: "#3085d6",
    confirmButtonText: "확인"
	});
} 
export const smallConfirmAlert = (text) => {
	return Swal.fire({
		// position:" top",
		text,
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "gray",
    confirmButtonText: "확인",
    cancelButtonText: "취소",
    reverseButtons: true
	});
} 

export const validateUserId = (userId) => {
  let regex = /^(?=.*[a-zA-Z])([a-zA-Z0-9]{6,12})$/;
  return regex.test(userId);
}

export const validatePassword = (userPw) => {
  let regex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[`~!@#$%^&*()\-_=+]).{8,20}$/;
  return regex.test(userPw);
}

export const validateName = (name) => {
  let regex = /^[가-힣]{2,5}$/;
  return regex.test(name);
}

export const validateEmail = (email) => {
  let regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/i;
  return regex.test(email);
}

export const validateBirth = (birth) => {
  let regex = /\d{2}([0]\d|[1][0-2])([0][1-9]|[1-2]\d|[3][0-1])$/;
  return regex.test(birth);
}

export const validateGender = (gender) => {
  let regex = /^[1-4]$/;
  return regex.test(gender);
}

// export const validateUserNo = (userNoFront, userNoBack) => {
//   let regexFront = /\d{2}([0]\d|[1][0-2])([0][1-9]|[1-2]\d|[3][0-1])$/;
//   let regexBack = /^[1-4]$/;
//   return regexFront.test(userNoFront) && regexBack.test(userNoBack);
// }

export const validatePhone = (phone) => {
  let regex = /^01([0|1|6|7|8|9])([0-9]{8})$/;
  return regex.test(phone);
}


// =============================== [ 이메일 인증 ] ===============================

export const sendEmail = (data) => {
  let result = "";

  const { REACT_APP_EMAIL_SERVICE_ID, REACT_APP_EMAIL_TEMPLATE_ID, REACT_APP_EMAIL_PUBLIC_KEY } = process.env;

  const send = emailjs.send(REACT_APP_EMAIL_SERVICE_ID, REACT_APP_EMAIL_TEMPLATE_ID, data, { publicKey: REACT_APP_EMAIL_PUBLIC_KEY })
  send.then(res => {
    if(res.status === 200 && res.text === "OK") result = "ok";
    else result = "fail";
  });

  return result;
}


// =============================== [ 캘린더 스케줄 ] ===============================

export const scheduleType = (group, seq, emp) => {

  let isEmp  = false;
  if(seq === emp.empSeq) isEmp = true;

  if(group === emp.empDeptCode && isEmp === true) return "individual";
  else if(group === emp.empDeptCode && isEmp === false) return "department";
  else if(group === 0) return "company";
  else return "individual";
}

// =============================== [ 날짜 변환 ] ===============================

export const dateYMD = (timestamp) => {
  let today = new Date(timestamp);
  let year = today.getFullYear();
  let month = ('0' + (today.getMonth() + 1)).slice(-2);
  let day = ('0' + today.getDate()).slice(-2);
  return `${year}-${month}-${day}`;
}
export const dateSettingOrigin = (date) => {
  const newDate = new Date(date);

  const isoString = newDate.toISOString().slice(0, 19).replace('T', ' ');

  const [datePart, timePart] = isoString.split(' ');
  const [hour, minute] = timePart.split(':');

  const formattedTime = `${hour}시 ${minute}분`;
  return `${datePart} ${formattedTime}`;
}


export const dateSetting = (date) => {
  const newDate = new Date(date);
  // 원하는 형식으로 포맷
  const options = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' };
  return newDate.toLocaleString('ko-KR', options);
}

// =============================== [ 분 단위 시간으로 변환 ] ===============================

export const workTime = (time) => {
  const hour = Math.floor(time/60);
  const minute = time%60;
  return `${hour}시간 ${minute}분`
}
