import styles from './ApprovalMenu.module.css'
import { BsPencilSquare} from "react-icons/bs";
import { FaArrowRightLong } from "react-icons/fa6";
import { TfiTime } from "react-icons/tfi";

export const ApprovalMenu=({setIsApproval, setIsReject, setIsHoldoff})=>{

    const handleApproval =()=>{
        setIsApproval(true);
    }

    const handleReject=()=>{
        setIsReject(true);
    }

    const handleHoldoff=()=>{
        setIsHoldoff(true);
    }
 
    return(
        <div className={styles.container}>
            <span className={styles.menuspancenter} onClick={handleApproval}><BsPencilSquare size={19}  className={styles.menuright} />결재</span>
            <span className={styles.menuspancenter} onClick={handleReject}><FaArrowRightLong size={19} className={styles.menuright} />반려</span>
            <span className={styles.menuspancenter} onClick={handleHoldoff}><TfiTime  size={20} className={styles.menuright} />보류</span>
        </div>
    )
}