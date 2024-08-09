import styles from './Home.module.css'
import {Header} from "./Header/Header";
import {Content} from "./Content/Content";
import { PopupWindow } from './Content/Admin/PopupBoard/PopupContent/PopupWindow/PopupWindow';
import { useEffect, useState } from 'react';

export const Home = () => {

  const [showPopup, setShowPopup] = useState(false);

    useEffect(()=>{
        setShowPopup(true);
    },[]);

  return (
    <div className={styles.container}>
      <Header />
      <Content />
      {showPopup && <PopupWindow setShowPopup={setShowPopup} />}
    </div>
  );
}