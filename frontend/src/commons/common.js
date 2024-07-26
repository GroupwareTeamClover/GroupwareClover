
// =============================== [ 정규표현식 ] ===============================
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

export const validateUserNo = (userNoFront, userNoBack) => {
  let regexFront = /\d{2}([0]\d|[1][0-2])([0][1-9]|[1-2]\d|[3][0-1])$/;
  let regexBack = /^[1-4]$/;
  return regexFront.test(userNoFront) && regexBack.test(userNoBack);
}

export const validatePhone = (phone) => {
  let regex = /^01([0|1|6|7|8|9])([0-9]{8})$/;
  return regex.test(phone);
}




// =============================== [  ] ===============================