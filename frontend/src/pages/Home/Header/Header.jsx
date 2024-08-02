import styles from './Header.module.css'
import logo from '../../../test_logo.png';
import defaultImage from '../../../images/default_avatar.jpg';
import {useMemberStore} from "../../../store/store";
import axios from "axios";
import {BaseUrl} from "../../../commons/config";
import {useNavigate} from "react-router-dom";
import {ImExit} from "react-icons/im";

export const Header = () => {
  const navi = useNavigate();

  const {sessionData, setSign, setAdmin} = useMemberStore();
  const handleSignOut = () => {
    if(window.confirm("로그아웃 할거임?")){
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
    } else {
      alert("ㅇㅋ 안함");
    }

  }

  return (
      <div className={styles.container}>
        <div className={styles.form}>
          <div className={styles.companyLogo}>
            <img src={logo} alt=""/>
            <span>Clover Company</span>
          </div>
          <div className={styles.userInfo}>
            <p className={styles.userName}>{sessionData.empName}</p>
            <div className={styles.userAvatar}>
              {sessionData.empAvatar === null &&
                  <img src={defaultImage} alt="기본 이미지" />
              }
            </div>
            <ImExit size={30} className={styles.icons} onClick={handleSignOut} />
          </div>
        </div>
      </div>
  );
}