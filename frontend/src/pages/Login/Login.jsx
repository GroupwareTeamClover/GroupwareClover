import styles from './Login.module.css';
import logo from '../../test_logo.png';
import {Modal} from "../../components/Modal/Modal";
import React, {useEffect, useState} from "react";
import axios from "axios";
import {SignUp} from "./SignUp/SignUp";
import {FindPw} from "./FindPw/FindPw";
import {FindId} from "./FindId/FindId";
import {BaseUrl} from "../../commons/config";
import {useNavigate} from "react-router-dom";
import {useMemberStore} from "../../store/store";

export const Login = ({ setSign, setAdmin }) => {

  const navi = useNavigate();

  const [ isModalOpen, setIsModalOpen ] = useState(false);
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const {setSessionData} = useMemberStore();

  const [ params, setParams ] = useState({id: "", pw: ""});

  const handleData = (e) => {
    const { name, value } = e.target;
    setParams(prev => ({ ...prev, [name]: value }));
  }

  const handleSignIn = async() => {
    if(params.id === "" || params.pw === "") {
      alert("아이디 또는 비밀번호를 입력하세요");
      return false;
    }
    const res = await axios.get(`${BaseUrl()}/sign`, { params });
    if(res.status === 200 && res.data !== "") {
      // 세션 데이터 제이슨 형식으로 저장
      const sessionData = {
        empSeq: res.data.empSeq,
        empId: res.data.empId,
        empName: res.data.empName,
        empAvatar: res.data.empAvatar,
      }
      setSessionData(sessionData);
      sessionStorage.setItem("sessionUser", JSON.stringify(sessionData));
      if(res.data.workerStateCode === 0) {
        sessionStorage.setItem("sessionAdmin", "true");
        setAdmin(true);
      }
      setSign(true);
      navi("/");
      alert("로그인 성공")
    } else {
      alert("로그인 실패")
    }

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