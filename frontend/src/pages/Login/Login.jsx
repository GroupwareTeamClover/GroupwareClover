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
import { connectWebSocket } from '../../commons/websocket';
import { useChatStore } from '../../store/messengerStore';
import {failAlert, successAlert, timeAlert} from "../../commons/common";
import {Loading} from "../../components/Loading/Loading";


export const Login = ({ setSign, setAdmin }) => {
  const { addMessage, setOnlineUsers, addChatRoom } = useChatStore();
  const navi = useNavigate();

  const [loading, setLoading] = useState(false);
  const [ isModalOpen, setIsModalOpen ] = useState(false);
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const {setSessionData} = useMemberStore();

  const [ params, setParams ] = useState({empId: "", empPw: ""});

  /** Sign-In Data setup **/
  const handleData = (e) => {
    const { name, value } = e.target;
    setParams(prev => ({ ...prev, [name]: value }));
  }

  /** Sign-In Event **/
  const handleSignIn = async() => {
    if(params.empId === "" || params.empPw === "") {
      failAlert("", "아이디 또는 비밀번호를 입력하세요");
      return false;
    }

    if(saveCheck) localStorage.setItem("saveId", params.empId);
    else localStorage.removeItem("saveId");

    setLoading(true);

    const res = await axios.post(`${BaseUrl()}/sign`,params);
    if(res.status === 200 && res.data.employeeInfo) {
      // 가입 대기 상태 로그인 차단
      if(res.data.employeeInfo.workerStateCode === 99) {
        failAlert("", "가입 대기중입니다. 잠시만 기다려주세요.");
        setLoading(false);
        return false;
      }

      // 응답 데이터에서 employeeInfo와 wsToken을 구조 분해 할당으로 추출
      const {employeeInfo, wsToken} = res.data;

      // 세션 데이터 제이슨 형식으로 저장
      const sessionData = {
        empSeq: employeeInfo.empSeq,
        empId: employeeInfo.empId,
        empName: employeeInfo.empName,
        empAvatar: employeeInfo.empAvatar,
        empDeptCode: employeeInfo.deptCode,
        empDeptName: employeeInfo.deptName,
        empRoleCode: employeeInfo.roleCode,
        wsToken: wsToken                   // WebSocket 연결을 위한 토큰
      }
      setSessionData(sessionData);

      // wsToken을 localStorage에 저장
      localStorage.setItem("wsToken", wsToken);

      // WebSocket 연결
      connectWebSocket((payload) => {
        const message = JSON.parse(payload.body);
        console.log('메시지 수신:', message);

        switch (message.type) {
          case 'CHAT':
            addMessage(message.roomSeq, message);
            break;
          case 'USER_STATUS':
            setOnlineUsers(message.onlineUsers);
            break;
          case 'NEW_CHAT_ROOM':
            addChatRoom(message.room);
            break;
          default:
            console.log('알 수 없는 메시지 타입:', message.type);
        }
      });

      sessionStorage.setItem("sessionUser", JSON.stringify(sessionData));
      if(res.data.employeeInfo.workerStateCode === 0) {
        sessionStorage.setItem("sessionAdmin", "true");
        setAdmin(true);
      }
      setSign(true);
      timeAlert("로그인 성공")
      navi("/");
    } else {
      failAlert("Sgin-In", "로그인 실패");
    }

    setLoading(false);
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
      setParams(prev => ({ ...prev, empId: svId }));
      setSaveCheck(true);
    }
  }, []);

  return (
    <div className={ styles.container }>
      { loading && <Loading />}
      { signUpState ?
        <SignUp setSignUpState={setSignUpState}/>
        :
        <div className={ styles.signInBox }>
          <img src={ logo } alt="logo"/>
          <input type="text" name="empId" onChange={handleData} onKeyDown={handleEnter} value={ params.empId || "" } placeholder='ID' />
          <input type="password" name="empPw" onChange={handleData} onKeyDown={handleEnter} placeholder='Password' />
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