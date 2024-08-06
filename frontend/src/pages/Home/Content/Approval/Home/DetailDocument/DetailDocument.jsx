import { useLocation, useParams } from "react-router-dom";
import styles from './DetailCoument.module.css';
import {Business} from './../Document/Forms/Business/Business';
import { Dayoff } from './../Document/Forms/Dayoff/Dayoff';
import { BsPencilSquare, BsDownload } from "react-icons/bs";
import { MdOutlineCancel } from "react-icons/md";
import { MdEmergency } from "react-icons/md";
import { useState, useEffect } from 'react';
import { useMemberStore } from "../../../../../../store/store";
import { useApprovalStore } from "../../../../../../store/approvalStore";
import axios from "axios";
import { BaseUrl } from "../../../../../../commons/config";
import { DragFolder } from "../../Side/ChoiceLine/DragFolder/DragFolder";
import { ProgressBar } from "react-bootstrap";
import { DraferMenu } from "./../Document/Menus/DrafterMenu/DrafterMenu";


export const DetailDocument = ({type}) => {

    const { id } = useParams();
    // console.log(id);
    //맵핑해서 양식별 메뉴와 폼 컴포넌트 결정
    const formConfig = {
        업무기안: Business,
        휴가신청서: Dayoff,
        invalid: () => <div>유효하지 않은 양식입니다.</div>,
    };
    const FormComponent = formConfig[type] || formConfig.invalid;

    //DraferMenu
    const [isCancle, setIsCancle] = useState(false);

    /*********************detail******************** */
    //왼쪽 기안자 정보
      const [drafterData, setDrafterData]=useState([
        { label: '기안자', value: '' },
        { label: '소속', value: '' },
        { label: '기안일', value: '' },
        { label: '문서번호', value: '' }
    ]); 


    //DB에서 정보 가져오기
    const [totalLineInfo, setTotalLineInfo]=useState({
        type: '',
        empName:'',
        deptName:'',
        roleName:'',
        order:''
    });

    useEffect(()=>{
        if(id!==''){
            axios.get(`${BaseUrl()}/approval/document/${id}`, document).then((resp)=>{
                // console.log(`detail접근확인`);
                // console.log(`detail정보확인 : ${JSON.stringify(resp.data, null, 2)}`);
                const documentData = resp.data.document ? [{
                    type: 'document',
                    empName: resp.data.document.empName,
                    deptName: resp.data.document.deptName,
                    roleName: resp.data.document.roleName,
                    order: ''
                  }] : [];

        
                  const apvlineData = resp.data.apvline ? resp.data.apvline.map(item => ({
                    type: 'apvline',
                    empName: item.empName,
                    deptName: item.deptName,
                    roleName: item.roleName,
                    order: item.lineOrder
                  })) : [];
        
                  const plineData = resp.data.pline ? resp.data.pline.map(item => ({
                    type: 'pline',
                    empName: item.empName,
                    deptName: item.deptName,
                    roleName: item.roleName,
                    order: item.pcpDivision
                  })) : [];
        
                  setTotalLineInfo([...documentData, ...apvlineData, ...plineData]);

                  // drafterData 업데이트
                setDrafterData(prevData => prevData.map(item => {
                    switch (item.label) {
                        case '기안자':
                            return { ...item, value: resp.data.document.empName || '' };
                        case '소속':
                            return { ...item, value: resp.data.document.deptName || ''};
                        case '기안일':
                            const writeDate = new Date(resp.data.document.writeDate);
                            const formattedDate = writeDate.toISOString().split('T')[0]; // YYYY-MM-DD 형식으로 변환
                            return { ...item, value: formattedDate || '' };
                        case '문서번호':
                            return { ...item, value: resp.data.document.docComSeq || '' };
                        default:
                            return item;
                    }
                }));
            })
        }
    },[id])

  
   
    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h3 className={styles.headerText}>{type}</h3>
            </div>
            <div className={styles.menu}>
              <DraferMenu setIsCancle={setIsCancle}/>
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
                            {
                            drafterData && drafterData.map((row, index) => (
                                                <div className={styles[`row${index + 1}`]} key={index}>
                                                    <div className={styles[`row${index + 1}col1`]}>{row.label}</div>
                                                    <div className={styles[`row${index + 1}col2`]}>{row.value}</div>
                                                </div>
                                            ))
                            }
                            </div>
                            </div>
                            <div className={styles.lineEmptyBox}></div>
                                { totalLineInfo.length > 0 && (
                                        <div className={styles.apvlineInfo}>
                                            {totalLineInfo.map((line, index) => (
                                                line.type === 'apvline' && (
                                                    <div key={index} className={styles.tablelbox2}>
                                                        <div className={styles.role}><span className={styles.roleText}>{line.roleName}</span></div>
                                                        <div className={styles.name}><span className={styles.nameText}>{line.empName}</span></div>
                                                        <div className={styles.docNumber}></div>
                                                    </div>
                                                )
                                            ))}
                                        </div>
                                    ) }
                        </div>
                        <div className={styles.form}>
                            <FormComponent type={type} id={id} /> 
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

