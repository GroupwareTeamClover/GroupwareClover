import { useLocation } from "react-router-dom";
import styles from './Document.module.css';
import {Business} from './Forms/Business/Business'
import { Dayoff } from './Forms/Dayoff/Dayoff';
import { BsPencilSquare, BsDownload } from "react-icons/bs";
import { MdOutlineCancel } from "react-icons/md";
import { MdEmergency } from "react-icons/md";
import { useState, useEffect } from 'react';
import { useMemberStore } from "../../../../../../store/store";
import { useApprovalStore } from "../../../../../../store/approvalStore";


export const Document = ({type, seq}) => {
    // if(seq===''){
    //     console.log("insert 확인");
    // }

    const {cloneDocCode, cloneEmpInfo} =useApprovalStore();


    //맵핑해서 양식별 메뉴와 폼 컴포넌트 결정
    const formConfig = {
        업무기안: Business,
        휴가신청서: Dayoff,
        invalid: () => <div>유효하지 않은 양식입니다.</div>,
    };
    const FormComponent = formConfig[type] || formConfig.invalid;

    //세션정보
    const {sessionData} = useMemberStore();


    // 현재 날짜 마운트 시 한 번만
    const [currentDate, setCurrentDate] = useState('');
    useEffect(() => {
       setCurrentDate(new Date().toLocaleDateString());
    }, []);

    const drafterData = [
        { label: '기안자', value: sessionData.empName },
        { label: '소속', value: '값' },
        { label: '기안일', value: currentDate },
        { label: '문서번호', value: '' }
    ];
    
    //결재요청 클릭시 각 양식에서 상태확인
    const [isInsert, setIsInsert] = useState(false);
    const handleInsert= () =>{
        console.log('Insert button clicked'); // 디버깅용
        setIsInsert(true);
    }

    // 긴급여부 체크박스 상태
    const [isEmergency, setIsEmergency] = useState('n');
    const handleEmergencyChange = (e) => {
        if(e.target.checked){
            setIsEmergency('y');
        }else{
            setIsEmergency('n');
        }
    }


    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h3 className={styles.headerText}>{type}</h3>
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
                        <span><h2>{type}</h2></span>
                    </div>
                    <div className={styles.bigcontent}>
                        <div className={styles.info}> 
                            <div className={styles.docInfo}>
                            <div className={styles.tablebox}>
                                {drafterData.map((row, index) => (
                                <div className={styles[`row${index + 1}`]} key={index}>
                                    <div className={styles[`row${index + 1}col1`]}>{row.label}</div>
                                    <div className={styles[`row${index + 1}col2`]}>{row.value}</div>
                                </div>
                                ))}
                            </div>
                            </div>
                            <div className={styles.lineEmptyBox}></div>
                                {cloneEmpInfo.apvchoice && cloneEmpInfo.apvchoice.length > 0 && (
                                        <div className={styles.apvlineInfo}>
                                            {cloneEmpInfo.apvchoice.map((line, index) => (
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
                            <FormComponent isInsert={isInsert} setIsInsert={setIsInsert} isEmergency={isEmergency}/> 
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

