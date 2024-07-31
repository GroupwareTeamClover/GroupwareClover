import styles from './Header.module.css'
import logo from '../../../test_logo.png';
import defaultImage from '../../../images/default_avatar.jpg';
import {useMemberStore} from "../../../store/store";
import axios from "axios";
import {BaseUrl} from "../../../commons/config";
import {useNavigate} from "react-router-dom";

export const Header = () => {
  const navi = useNavigate();

  const {sessionData, setSign, setAdmin} = useMemberStore();
  const handleSignOut = () => {
    axios.delete(`${BaseUrl()}/sign`).then(resp => {
      console.log(resp.data);
      if(resp.data === "ok"){
        sessionStorage.removeItem("sessionUser");
        sessionStorage.removeItem("sessionAdmin");
        setSign(false);
        setAdmin(false);
        alert("로그아웃 성공");
        navi("/");
      } else {
        alert("로그아웃 실패")
      }

    });
  }

  return (
      <div className={styles.container}>
        <div className={styles.form}>
          <div className={styles.companyLogo}>
            <img src={logo} alt=""/>
            <span>Clover Company</span>
          </div>
          <div className={styles.userInfo}>
            <button onClick={handleSignOut}>Sign-Out</button>
            <p className={styles.userName}>{sessionData.empName}</p>
            <div className={styles.userAvatar}>
              {sessionData.empAvatar === null &&
                  <img src={defaultImage} alt="기본 이미지" />
              }
            </div>
          </div>
        </div>
      </div>
  );
}