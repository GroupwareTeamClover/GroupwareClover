import styles from './Mypage.module.css'
import default_image from "../../../../../images/default_avatar.jpg";
import React, {useEffect, useState} from "react";
import axios from "axios";
import {BaseUrl} from "../../../../../commons/config";
import {
  failAlert,
  successAlert,
  timeAlert,
  validateEmail,
  validatePassword,
  validatePhone
} from "../../../../../commons/common";
import {useMemberStore} from "../../../../../store/store";
import {Loading} from "../../../../../components/Loading/Loading";

export const Mypage = ({ empSeq, closeModal }) => {

  const [mypage, setMypage] = useState({});
  const [loading, setLoading] = useState(false);
  const {sessionData, setAvatar} = useMemberStore();

  /** 생년월일 형식 변환하여 출력 **/
  const changeBirth = (birth) => {
    if (birth !== undefined) {
      let year = "";
      if (parseInt(birth.slice(0, 2)) > 40) year = `19${birth.slice(0, 2)}`;
      else year = `20${birth.slice(0, 2)}`;
      return year + "년 " + birth.slice(2, 4) + "월 " + birth.slice(4, 6) + "일";
    }
    return birth;
  }

  /** 전화번호 형식 변환하여 출력 **/
  const changeTel = (tel) => {
    if (tel !== undefined) return tel.slice(0, 3) + " - " + tel.slice(3, 7) + " - " + tel.slice(7, 11);
    return tel;
  }

  /** 내 정보 업데이트 폼 변경 **/
  const [updateForm, setUpdateForm] = useState(false)
  const handleUpdateForm = () => {
    setUpdateForm(true);
  }

  /** 업데이트 폼 체인지 **/
  const [ updateSelectForm, setUpdateSelectForm ] = useState(0);

  /** 폼 체인지 버튼 **/
  const handleSelectForm = (e) => {
    if(e.target.name === "avatar") setUpdateSelectForm(1);
    else if(e.target.name === "telEmail") setUpdateSelectForm(2);
    else if(e.target.name === "password") setUpdateSelectForm(3);

  }

  /** 아바타 변경 데이터 **/
  // 아바타 미리보기를 위한 상태 값
  const [changeAvatar, setChangeAvatar] = useState(sessionData.empAvatar);

  // input(type:file)을 커스텀하기위해 사용
  const reviewAvatar = React.useRef(null);
  const handleFileClick = () => {
    reviewAvatar.current.click();
  }

  const [selectedFile, setSelectedFile] = useState(null);
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if(file) {
      const fileUrl = URL.createObjectURL(file);
      setChangeAvatar(fileUrl);
      setSelectedFile(file);
    }
  }

  /** 비밀번호 업데이트 데이터 **/
  const [changePw, setChangePw] = useState({empPw: "", pwCheck: "", check: false});

  const handlePwDate = (e) => {
    const { name, value } = e.target;
    setChangePw(prev => ({...prev, [name]:value}));
  }

  useEffect(() => {
    if(changePw.empPw === changePw.pwCheck) {
      if(validatePassword(changePw.empPw)) setChangePw(prev => ({ ...prev, check: true}));
      else setChangePw(prev => ({ ...prev, check: false}));
    } else setChangePw(prev => ({ ...prev, check: false}));
  }, [changePw.empPw, changePw.pwCheck]);

  /** 전화번호, 이메일 업데이트 데이터 **/
  const [updateData, setUpdateData] = useState({empTel: mypage.EMP_TEL, empEmail: mypage.EMP_EMAIL})

  const handleUpdateData = (e) => {
    const {name, value} = e.target;
    setUpdateData(prev => ({...prev, [name]: value}));
  }

  /** 업데이트 확인 버튼 이벤트 **/
  const handleUpdate = () => {

    /** 프로필 사진 업데이트 **/
    if(updateSelectForm === 1) {
      if(!selectedFile) {
        failAlert("", "선택된 이미지 파일이 없습니다.");
        return false;
      }

      const formData = new FormData();
      formData.append("file", selectedFile);
      setLoading(true);

      axios.put(`${BaseUrl()}/employee/profile`,
        formData,
        { headers: {'Content-Type': 'multipart/form-data'}
      }).then(res => {
        if(res.data !== "fail") {
          sessionStorage.setItem("sessionUser", JSON.stringify({...sessionData, empAvatar: res.data}));
          setAvatar({empAvatar: res.data});

          setUpdateForm(false);
          setDataState(prev => !prev);
        }
      }).catch(() => failAlert("","이미지 변경에 실패했습니다."));
    }

    /**전화번호 이메일 정보 업데이트 **/
    if(updateSelectForm === 2) {
      if (validateEmail(updateData.empEmail) && validatePhone(updateData.empTel)) {
        setLoading(true);
        axios.put(`${BaseUrl()}/employee`,updateData).then(res => {
          if(res.data === "ok"){
            successAlert("", "정보 변경 완료");
            setDataState(prev => !prev);
            setUpdateForm(false);
          }
        }).catch(() => failAlert("", "정보 변경에 실패하였습니다."));
      } else {
        failAlert("", "작성 내용을 확인하세요");
      }
    }

    /** 비밀번호 업데이트 **/
    if(updateSelectForm === 3) {
      const empSeq = sessionData.empSeq;
      if(changePw.check){
        delete changePw.pwCheck;
        delete changePw.check;
        setLoading(true);
        axios.put(`${BaseUrl()}/employee/${empSeq}`, changePw).then(res => {
          if(res.data === "ok") {
            timeAlert("비밀번호 변경 완료");
            closeModal();
          }
        }).catch(() => failAlert("","비밀번호 변경에 실패하였습니다"));
      } else {
        failAlert("", "패스워드를 확인해주세요");
      }
    }

    setLoading(false);
  }

  /** 전화번호, 이메일 정보 수정 중 취소 **/
  const handleUpdateCancel = (e) => {
    if(e.target.name === "mypage") setUpdateForm(false);
    setUpdateData({empTel: mypage.EMP_TEL, empEmail: mypage.EMP_EMAIL});
    setUpdateSelectForm(0);
  }

  const [dataState, setDataState] = useState(false);
  useEffect(() => {
    setLoading(true);
    axios.get(`${BaseUrl()}/employee`).then(res => {
      setMypage(res.data);
      setUpdateData({empTel: res.data.EMP_TEL, empEmail: res.data.EMP_EMAIL});
    }).catch();
    setLoading(false);
  }, [dataState]);

  return (
    <div className={styles.container}>
      { loading && <Loading />}
      <div className={styles.top}>
        <div className={styles.avatar}>
          {(mypage.EMP_AVATAR === null || mypage.EMP_AVATAR === undefined) ?
            <img src={default_image} alt="기본이미지"/>
            :
            <img src={mypage.EMP_AVATAR} alt="기본이미지"/>
          }
        </div>
        <div className={styles.topInfo}>
          <p>이름 : {mypage.EMP_NAME}</p>
          <p>부서 : {mypage.DEPT_NAME}</p>
          <p>직급 : {mypage.ROLE_NAME}</p>
        </div>
      </div>
      <div className={styles.center}>
        <div className={styles.content}>
          { !updateForm &&
            <div className={styles.contentLabel}>
              <p>생년월일 : {changeBirth(mypage.EMP_BIRTH)}</p>
              <p>전화번호 : {changeTel(mypage.EMP_TEL)}</p>
              <p>이메일 : {mypage.EMP_EMAIL} </p>
              <p>연차 : {mypage.ANNUAL_LEAVE_DAY}일</p>
            </div>
          }
          { (updateForm && updateSelectForm === 0) &&
            <div>
              <div className={styles.row}>
                <button name="avatar" onClick={handleSelectForm} >프로필 사진 변경</button>
              </div>
              <div className={styles.row}>
                <button name="telEmail" onClick={handleSelectForm} >전화번호, 이메일 변경</button>
              </div>
              <div className={styles.row}>
                <button name="password" onClick={handleSelectForm} >비밀번호 변경</button>
              </div>
            </div>
          }
          { /* 프로필 사진 수정 */
            (updateForm && updateSelectForm === 1) &&
            <div className={styles.col}>
              <div className={styles.reviewBox}>
                <img src={changeAvatar} />
              </div>
              <div className={styles.reviewController}>
                <input type="file" ref={reviewAvatar} style={{ display : "none" }} onChange={handleFileChange}/>
                <button onClick={handleFileClick}>이미지 찾기</button>
              </div>
            </div>
          }
          { /* 전화번호, 이메일 수정 */
            (updateForm && updateSelectForm === 2)  &&
            <div>
              <div className={styles.row}>
                <span>Tel.</span>
                <input type="text" name="empTel" onChange={handleUpdateData} value={updateData.empTel}
                       placeholder=" ' - '를 제외한 전화번호를 입력하세요."/>
              </div>
              <div className={styles.row}>
                <span>E-Mail</span>
                <input type="text" name="empEmail" value={updateData.empEmail} onChange={handleUpdateData}
                       placeholder="E-Mail을 입력하세요."/>
              </div>
            </div>
          }
          { /* 비밀번호 변경 */
            (updateForm && updateSelectForm === 3) &&
              <div>
                <div className={styles.row}>
                  <span style={changePw.empPw !== "" ? (changePw.check ? {color: "#15dcdd"} : {color: "red"}) : undefined} >New Password</span>
                  <input type="password" name="empPw" maxLength="20" value={changePw.empPw || ""}
                         onChange={handlePwDate} placeholder="8~20자리로 입력하세요"/>
                </div>
                <div className={styles.row}>
                  <input type="password" name="pwCheck" maxLength="20" value={changePw.pwCheck || ""} onChange={handlePwDate} placeholder="8~20자리로 입력하세요"/>
                  <span className={styles.description}>비밀번호는 영문 대문자, 소문자, 숫자, 특수문자를</span>
                  <span className={styles.description}>각각 한개이상을 포함해야 합니다.</span>
                </div>
            </div>
          }
        </div>
      </div>
      <div className={styles.bottom}>
        {!updateForm &&
          <>
            <button onClick={handleUpdateForm}>정보 수정</button>
            <button onClick={() => closeModal()}>닫기</button>
          </>
        }
        { (updateForm && updateSelectForm === 0)  &&
          <>
            <button name="mypage" onClick={handleUpdateCancel}>돌아가기</button>
          </>
        }
        { (updateForm && updateSelectForm !== 0) &&
          <>
            <button onClick={handleUpdate}>확인</button>
            <button name="mypageSelect" onClick={handleUpdateCancel}>취소</button>
          </>
        }
      </div>
    </div>
  );
}