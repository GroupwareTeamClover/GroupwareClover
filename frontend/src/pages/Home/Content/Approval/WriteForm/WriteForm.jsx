import { Route, Routes, useLocation } from "react-router-dom";
import styles from './WriteForm.module.css';
import {Business} from '../components/ApprovalForms/Business/Business';
import {Dayoff} from '../components/ApprovalForms/Dayoff/Dayoff'
import { BsPencilSquare, BsDownload } from "react-icons/bs";
import { MdOutlineCancel } from "react-icons/md";


export const WriteForm = () => {
    const location = useLocation();
    const state = location.state;
    // console.log(state.type); 업무기안, 휴가신청서
    // console.log(state.data); 
    //data내용 
    // const combinedData = {
    //     docdto: data.docdto,
    //     apvlist: data.apvlist,
    //     plist: data.plist
    // };

    // 양식에 따라 header 내용 설정
    const headerText = state?.type || '양식명';

    return (
        <div className={styles.container}>
                <div className={styles.header}>
                    <h3 className={styles.headerText}>{headerText}</h3>
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
                            <Routes>
                                {/* 동적 경로에 따라 컴포넌트를 렌더링합니다. */}
                                <Route path="/business" element={<Business data={state.data}/>} />
                                <Route path="/dayoff" element={<Dayoff data={state.data}/>} />
                                {/* 잘못된 경로 처리 */}
                                <Route path="/invalid" element={<div>유효하지 않은 양식입니다.</div>} />
                            </Routes>
                        </div>
                    </div>
                    {/* 오른쪽 */}
                     <div className={styles.side}></div>
               
                </div>
        </div>
     
      
    );
};
