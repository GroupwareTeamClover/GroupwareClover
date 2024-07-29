import styles from './Header.module.css'
import logo from '../../../test_logo.png';
import {useMemberStore} from "../../../store/store";

export const Header = () => {

  const {setSign} = useMemberStore();

  const handleSignOut = () => {
    sessionStorage.removeItem("sessionData");
    setSign(false);
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
          <p className={styles.userName}>노시온</p>
          <div className={styles.userAvatar}>Noh</div>
        </div>
      </div>
    </div>
  );
}