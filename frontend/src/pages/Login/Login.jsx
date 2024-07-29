import styles from './Login.module.css';
import logo from '../../test_logo.png';
import {Modal} from "../../components/Modal/Modal";
import React, {useEffect, useState} from "react";
import {useMemberStore} from "../../store/store";
import axios from "axios";
import {SignUp} from "./SignUp/SignUp";
import {FindPw} from "./FindPw/FindPw";
import {FindId} from "./FindId/FindId";

export const Login = ({ setSign }) => {

  const [ isModalOpen, setIsModalOpen ] = useState(false);
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);


  const [ signInData, setSignInData ] = useState({id: "", pw: ""});

  const handleData = (e) => {
    const { name, value } = e.target;
    setSignInData(prev => ({ ...prev, [name]: value }));
  }

  const handleSignIn = async() => {
    setSign(true);
    // const response = await axios.post("http://192.168.1.7/members", signInData);
    // if(response.status === 200 && response.data !== null) {
    //
    //   // 세션 데이터 제이슨 형식으로 저장
    //   // sessionStorage.setItem("sessionData", JSON.stringify(response.data));
    //   setSign(true);
    //   alert("로그인 성공")
    // } else {
    //   alert("로그인 실패")
    // }

  }

  const [ modalState, setModalState ] = useState("");
  const handleModalChange = (e) => {
    setModalState(e.target.name);
    openModal();
  }

  const [signUpState, setSignUpState] = useState(false);

  return (
    <div className={ styles.container }>
      { signUpState ?
        <SignUp setSignUpState={setSignUpState}/>
        :
        <div className={ styles.signInBox }>
          <img src={ logo } alt="logo"/>
          <input type="text" name="id" onChange={handleData} placeholder='ID' />
          <input type="password" name="pw" onChange={handleData} placeholder='Password' />
          <div className={styles.checkBox}>
            <div>
              <input type="checkbox" id="id_save"/>
              <label htmlFor="id_save"> 아이디 저장 </label>
            </div>
            <div>
              <input type="checkbox" id="login_svae"/>
              <label htmlFor="login_svae"> 로그인 유지 </label>
            </div>
          </div>
          <button onClick={handleSignIn}>로그인</button>
          <div className={styles.signHref}>
            <button name="SignUp" onClick={() => setSignUpState(true)}>회원가입</button>
            <button name="FindId" onClick={handleModalChange}>아이디 찾기</button>
            <button name="FindPw" onClick={handleModalChange}>비밀번호 찾기</button>
          </div>
        </div>
      }

      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <div className={styles.modalForm}>
          {modalState === "FindId" && <FindId/>}
          {modalState === "FindPw" && <FindPw/>}
        </div>
      </Modal>

    </div>
  );
}