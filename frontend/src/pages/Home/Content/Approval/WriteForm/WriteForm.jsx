import { useLocation } from "react-router-dom";
import styles from './WriteForm.module.css';
import { Business } from '../components/ApprovalForms/Business/Business';
import { Dayoff } from '../components/ApprovalForms/Dayoff/Dayoff';
import { BsPencilSquare, BsDownload } from "react-icons/bs";
import { MdOutlineCancel } from "react-icons/md";
import { MdEmergency } from "react-icons/md";
import { useState, useEffect } from 'react';
import { useMemberStore } from "../../../../../store/store";


export const WriteForm = () => {
    const location = useLocation();
    const state=location.state;
    // console.log(state.type);
    // console.log(state.docinfo);
    // console.log(state.empinfo);

    //맵핑해서 하나로 움직이게 하기
    const formConfig = {
        업무기안: Business,
        휴가신청서: Dayoff,
        invalid: () => <div>유효하지 않은 양식입니다.</div>,
    };

    const FormComponent = formConfig[state.type] || formConfig.invalid;

    //세션정보
    const {sessionData} = useMemberStore();

    // 현재 날짜 마운트 시 한 번만
    const [currentDate, setCurrentDate] = useState('');
    useEffect(() => {
       setCurrentDate(new Date().toLocaleDateString());
    }, []);
    
    const [isInsert, setIsInsert] = useState(false);

    const handleInsert= () =>{
        setIsInsert(true);
    }

    // 긴급여부 체크박스 상태
    const [isEmergency, setIsEmergency] = useState(false);
    const handleEmergencyChange = (e) => {
       setIsEmergency(e.target.checked);
    }


    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h3 className={styles.headerText}>{state.type}</h3>
            </div>
            <div className={styles.menu}>
                <span className={styles.menuspancenter}><BsPencilSquare size={19} onClick={handleInsert} className={styles.menuright}/>결재요청</span>
                <span className={styles.menuspancenter}><BsDownload size={19} className={styles.menuright}/>임시저장</span>
                <span className={styles.menuspancenter}><MdOutlineCancel size={20} className={styles.menuright}/>취소</span>
                <span className={styles.menuspancenter}><MdEmergency className={styles.menuright}/>긴급여부<input type="checkbox" className={styles.inputcheck} onChange={handleEmergencyChange}></input></span>
            </div>
            <div className={styles.detail}>
                {/* 왼쪽 */}
                <div className={styles.left}>
                    <div className={styles.test}>
                    <div className={styles.leftcontainer}>
                    <div className={styles.insideheader}>
                        <span><h2>{state.type}</h2></span>
                    </div>
                    <div className={styles.bigcontent}>
                        <div className={styles.info}> 
                            <div className={styles.docInfo}>
                                <div className={styles.tablebox}>
                                    <div className={styles.row1}>
                                    <div className={styles.row1col1}>기안자</div>
                                    <div className={styles.row1col2}>{sessionData.empName}</div>
                                    </div>
                                    <div className={styles.row2}>
                                    <div className={styles.row2col1}>소속</div>
                                    <div className={styles.row2col2}>값</div>
                                    </div>
                                    <div className={styles.row3}>
                                    <div className={styles.row3col1}>기안일</div>
                                    <div className={styles.row3col2}>{currentDate}</div>
                                    </div>
                                    <div className={styles.row4}>
                                    <div className={styles.row4col1}>문서번호</div>
                                    <div className={styles.row4col2}></div>
                                    </div>
                                </div>
                            </div>
                            <div className={styles.lineEmptyBox}></div>
                                {state.empinfo.apvchoice && state.empinfo.apvchoice.length > 0 && (
                                        <div className={styles.apvlineInfo}>
                                            {state.empinfo.apvchoice.map((line, index) => (
                                                <div key={index} className={styles.tablelbox2}>
                                                    <div className={styles.role}><span className={styles.roleText}>{line.role}</span></div>
                                                    <div className={styles.name}><span className={styles.nameText}>{line.name}</span></div>
                                                    <div className={styles.docNumber}></div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                        </div>
                        <div className={styles.form}>
                            <FormComponent type={state.type} docinfo={state.docinfo} empinfo={state.empinfo} isInsert={isInsert}/> 
                        </div>
                    </div> 
                    </div>
                    </div>
                </div>
                {/* 오른쪽 */}
                <div className={styles.side}></div>
            </div>
        </div>
    );
};

