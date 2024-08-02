import styles from './Login.module.css';
import logo from '../../test_logo.png';
import {Modal} from "../../components/Modal/Modal";
import React, {useEffect, useRef, useState} from "react";
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

  /** Sign-In Data setup **/
  const handleData = (e) => {
    const { name, value } = e.target;
    setParams(prev => ({ ...prev, [name]: value }));
  }

  /** Sign-In Event **/
  const handleSignIn = async() => {
    if(params.id === "" || params.pw === "") {
      alert("아이디 또는 비밀번호를 입력하세요");
      return false;
    }

    if(saveCheck) localStorage.setItem("saveId", params.id);
    else localStorage.removeItem("saveId");

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

  /** Find id, pw : State에 따른 Modal Change **/
  const [ modalState, setModalState ] = useState("");
  const handleModalChange = (e) => {
    setModalState(e.target.name);
    openModal();
  }

  const [signUpState, setSignUpState] = useState(false);

  /** Enter 키를 통한 로그인 **/
  const handleEnter = (e) => {
    if(e.key === "Enter") handleSignIn();
  }

  /** 아이디 저장 **/
  const [saveCheck, setSaveCheck] = useState(false);
  const handleCheckBox = (e) => {
    setSaveCheck(e.target.checked);
  }

  useEffect(() => {
    const svId = localStorage.getItem("saveId");
    if(svId !== null) {
      setParams(prev => ({ ...prev, id: svId }));
      setSaveCheck(true);
    }
  }, []);

  return (
      <div className={ styles.container }>
        { signUpState ?
            <SignUp setSignUpState={setSignUpState}/>
            :
            <div className={ styles.signInBox }>
              <img src={ logo } alt="logo"/>
              <input type="text" name="id" onChange={handleData} onKeyDown={handleEnter} value={ params.id || "" } placeholder='ID' />
              <input type="password" name="pw" onChange={handleData} onKeyDown={handleEnter} placeholder='Password' />
              <div className={styles.checkBox}>
                <div>
                  <input type="checkbox" name="saveId" onChange={ handleCheckBox } checked={saveCheck} id="id_save"/>
                  <label htmlFor="id_save"> 아이디 저장 </label>
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
            {modalState === "FindPw" && <FindPw closeModal={closeModal}/>}
          </div>
        </Modal>

      </div>
  );
}