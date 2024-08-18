import styles from './ParticipantMenu.module.css';
import { BsFileEarmarkCheck } from "react-icons/bs";

export const ParticipantMenu=({setIsPartCheck})=>{

     const handleCheck= () =>{
        setIsPartCheck(true);
    }
    return(
        <div className={styles.container}>
            <span className={styles.menuspancenter} onClick={handleCheck}><BsFileEarmarkCheck  size={20} className={styles.menuright}/>확인</span>
        </div>
    )
}