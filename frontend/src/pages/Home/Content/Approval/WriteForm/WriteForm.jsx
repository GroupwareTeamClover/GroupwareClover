import { useLocation } from "react-router-dom";
import styles from './WriteForm.module.css';
import { Business } from '../components/ApprovalForms/Business/Business';
import { Dayoff } from '../components/ApprovalForms/Dayoff/Dayoff';
import { BsPencilSquare, BsDownload } from "react-icons/bs";
import { MdOutlineCancel } from "react-icons/md";

export const WriteForm = () => {
    const location = useLocation();
    const state=location.state;

    //맵핑해서 하나로 움직이게 하기
    const formConfig = {
        업무기안: Business,
        휴가신청서: Dayoff,
        invalid: () => <div>유효하지 않은 양식입니다.</div>,
    };

    const FormComponent = formConfig[state.type] || formConfig.invalid;

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h3 className={styles.headerText}>{state.type}</h3>
            </div>
            <div className={styles.menu}>
                <span className={styles.menuspancenter}><BsPencilSquare size={19}/>결재요청</span>
                <span className={styles.menuspancenter}><BsDownload size={19}/>임시저장</span>
                <span className={styles.menuspancenter}><MdOutlineCancel size={20}/>취소</span>
            </div>
            <div className={styles.detail}>
                {/* 왼쪽 */}
                <div className={styles.left}>
                    <div className={styles.form}>
                        <FormComponent type={state.type} docinfo={state.docinfo} empinfo={state.empinfo}/>
                    </div>
                </div>
                {/* 오른쪽 */}
                <div className={styles.side}></div>
            </div>
        </div>
    );
};
