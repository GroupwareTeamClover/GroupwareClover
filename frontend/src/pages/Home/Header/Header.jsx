import styles from './Header.module.css'
import logo from '../../../test_logo.png';
import defaultImage from '../../../images/default_avatar.jpg';
import {useMemberStore} from "../../../store/store";
import axios from "axios";
import {BaseUrl} from "../../../commons/config";
import {useNavigate} from "react-router-dom";
import {ImExit} from "react-icons/im";
import {confirmAlert, failAlert, successAlert, timeAlert} from "../../../commons/common";

export const Header = () => {
  const navi = useNavigate();

  const {sessionData, setSign, setAdmin} = useMemberStore();
  const handleSignOut = () => {
    confirmAlert("로그아웃 하시겠습니까?").then((result) => {
        if (result.isConfirmed) {
          axios.delete(`${BaseUrl()}/sign`).then(resp => {
            if(resp.data === "ok"){
              sessionStorage.removeItem("sessionUser");
              sessionStorage.removeItem("sessionAdmin");
              setSign(false);
              setAdmin(false);
              timeAlert("로그아웃 성공")
              // successAlert("Sign-Out", "로그아웃 성공");
              navi("/");
            } else {
              failAlert("Sign-Out", "로그아웃 실패");
            }
          });
        }
      });

  }

  return (
      <div className={styles.container}>
        <div className={styles.form}>
          <div className={styles.companyLogo}>
            <img src={logo} alt=""/>
            <span>Clover Office</span>
          </div>
          <div className={styles.userInfo}>
            <div className={styles.userAvatar}>
              {sessionData.empAvatar === null ?
                <img src={defaultImage} alt="기본 이미지"/>
                :
                <img src={sessionData.empAvatar} alt="기본 이미지"/>
              }

            </div>
            <ImExit size={30} className={styles.icons} onClick={handleSignOut} />
          </div>
        </div>
      </div>
  );
}