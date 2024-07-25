import styles from './Login.module.css';
import logo from '../../test_logo.png';
import {Modal} from "../Modal/Modal";
import {useEffect, useState} from "react";
import {useMemberStore} from "../../store/store";
import axios from "axios";
import {SignUp} from "./SignUp/SignUp";
import {FindPw} from "./FindPw/FindPw";
import {FindId} from "./FindId/FindId";

export const Login = ({ setSign }) => {

  const [ modalState, setModalState ] = useState("");

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
    alert("로그인 성공");
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

  const handleSignUp =  () => {
    setModalState("SignUp");
    openModal();
  }

  const handleFindId = () => {
    setModalState("FindId");
    openModal();
  }

  const handleFindPw = () => {
    setModalState("FindPw");
    openModal();
  }

  return (
    <div className={ styles.container }>
      <div className={ styles.signInBox }>
        <img src={ logo } alt="logo"/>
        <input type="text" name="id" onChange={handleData} placeholder='ID' />
        <input type="password" name="pw" onChange={handleData} placeholder='Password' />
        <div className={ styles.checkBox }>
          <input type="checkbox" id="id_svae"/>
          <label for="id_save"> 아이디 저장 </label>
        </div>
        <button onClick={handleSignIn}>로그인</button>
        <div className={styles.signHref}>
          <button onClick={handleSignUp}>회원가입</button>
          <button onClick={handleFindId}>아이디 찾기</button>
          <button onClick={handleFindPw}>비밀번호 찾기</button>
        </div>
      </div>

      {modalState === "SignUp" &&
        <Modal isOpen={ isModalOpen } onClose={ closeModal }>
          <div className={styles.modalForm}>
            <SignUp/>
            <div className={styles.btnBox}>
              <button onClick={closeModal}>이전</button>
              <button onClick={closeModal}>다음</button>
            </div>

          </div>
        </Modal>
      }

      {modalState === "FindId" &&
        <Modal isOpen={ isModalOpen } onClose={ closeModal }>
          <div className={styles.modalForm}>
           <FindId />
            <button onClick={ closeModal }>Close</button>
          </div>
        </Modal>
      }

      { modalState === "FindPw" &&
        <Modal isOpen={ isModalOpen } onClose={ closeModal }>
          <div className={styles.modalForm}>
            <FindPw />
            <button onClick={ closeModal }>Close</button>
          </div>
        </Modal>
      }

    </div>
  );
}