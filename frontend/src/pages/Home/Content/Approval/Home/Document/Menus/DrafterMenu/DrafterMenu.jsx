import styles from './DrafterMenu.module.css';
import { MdOutlineCancel } from "react-icons/md";

export const DraferMenu=({setIsCancle})=>{
     //상신취소 클릭시 각 양식에서 상태확인
     const handleCancle= () =>{
        // console.log('Cancle button clicked'); // 디버깅용
        setIsCancle(true);
    }
    return(
        <div className={styles.container}>
            <span className={styles.menuspancenter} onClick={handleCancle}><MdOutlineCancel size={20} className={styles.menuright}/>상신취소</span>
        </div>
    )
}