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
import {ApprovalMenu} from "./../Document/Menus/ApprovalMenu/ApprovalMenu";
import signImage from './../../../../../../images/sign.PNG';
import rejectImage from './../../../../../../images/reject.PNG';
import { format } from 'date-fns';
import { Modal } from "../../../../../../components/Modal/Modal";

export const DetailDocument = ({type}) => {

    //세션정보
    const {sessionData} = useMemberStore();

    //메인화면의 결재하기 상태변수
    const { id } = useParams();

    // console.log(id);
    //맵핑해서 양식별 메뉴와 폼 컴포넌트 결정
    const formConfig = {
        업무기안: Business,
        휴가신청서: Dayoff,
        invalid: () => <div>유효하지 않은 양식입니다.</div>,
    };
    const FormComponent = formConfig[type] || formConfig.invalid;

    //DraferMenu에서 상신취소 클릭시-메뉴컴포넌트에 전달
    const [isCancle, setIsCancle] = useState(false);

    //ApprovalMenu에서 결재 클릭시-메뉴컴포넌트에 전달
    const [isApproval, setIsApproval] =useState(false);

    //ApprovalMenu에서 반려 클릭시-메뉴컴포넌트에 전달
    const [isReject, setIsReject] =useState(false);

    //ApprovalMenu에서 보류 클릭시-메뉴컴포넌트에 전달
    const [isHoldoff, setIsHoldoff]=useState(false);

    // 날짜 변환 함수
    const formatDate = (date) => {
        if (!date) return '-';
        return format(new Date(date), 'yyyy-MM-dd');
    };
    

    /*********************detail에서 사용할 정보******************** */
    //왼쪽 기안자 정보
      const [drafterData, setDrafterData]=useState([
        { label: '기안자', value: '' },
        { label: '소속', value: '' },
        { label: '기안일', value: '' },
        { label: '문서번호', value: '' }
    ]); 

    const [totalLineInfo, setTotalLineInfo]=useState({});


    //메뉴 on 
    const [isDrafterMenu, setIsDrafterMenu]=useState(false);
    const [isApprovalMenu, setIsApprovalMenu]=useState(false);


    //DB에서 정보 가져오는함수
    const handleGetAll=()=>{
        if(id!==''){
            axios.get(`${BaseUrl()}/approval/document/${id}`, document).then((resp)=>{
                // console.log(`detail접근확인`);
                console.log(`detail정보확인 : ${JSON.stringify(resp.data, null, 2)}`);

                //상신취소메뉴 on 대기또는 예정 누군가 승인또는반려를 한명이라도 시작되었다면 상신취소할 수 없음.
                const allLinesMeetCondition = resp.data.apvline.every(line => 
                    line.apvStatusCode === 1 || line.apvStatusCode === 2
                );
                
                if (allLinesMeetCondition && resp.data.document.drafterSeq === sessionData.empSeq) {
                    setIsDrafterMenu(true);
                }
                
                //결정메뉴들 on(결재, 반려, 보류)
                resp.data.apvline.map((line, index)=>{
                    if(line.apverId===sessionData.empSeq && line.apvStatusCode===1)  setIsApprovalMenu(true)
                })

                const documentData = resp.data.document ? [{
                    type: 'document',
                    empName: resp.data.document.empName,
                    deptName: resp.data.document.deptName,
                    roleName: resp.data.document.roleName,
                    order: '',
                    drafterSeq: resp.data.document.drafterSeq,
                    docSeq:resp.data.document.docSeq
                  }] : [];

        
                  const apvlineData = resp.data.apvline ? resp.data.apvline.map(item => ({
                    type: 'apvline',
                    empName: item.empName,
                    deptName: item.deptName,
                    roleName: item.roleName,
                    order: item.lineOrder,
                    lineSeq: item.lineSeq,
                    apverId: item.apverId,
                    apvStatusCode: item.apvStatusCode,
                    lineApvDate: item.lineApvDate
                  })) : [];
        
                  const plineData = resp.data.pline ? resp.data.pline.map(item => ({
                    type: 'pline',
                    empName: item.empName,
                    deptName: item.deptName,
                    roleName: item.roleName,
                    order: item.pcpDivision,
                    lineSeq: item.lineSeq
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

    }      
             
    useEffect(()=>{
        handleGetAll();
        console.log(isApprovalMenu, isDrafterMenu);
    },[])

  
    /*********************메뉴 클릭에 따른 update******************** */
    // 나의 결재라인번호 가져오기
    const getApvLineSeq = () => {
        return totalLineInfo.filter(item => item.type === 'apvline').map(item => item.apverId===sessionData.empSeq && item.apvStatusCode === 1? item.lineSeq : '');
    };
    
    //상신취소클릭시 DB업데이트
    // useEffect(()=>{
    //     if(isCancle){
    //        const apvLineSeq=getApvLineSeq();
    //         console.log(apvLineSeq);
    //         // totalLineInfo.map((line,index)=>{
    //         //     line.type=='apvline' ? 
    //         // })
    //         // axios.put(`${BaseUrl()}/approval/line/${id}/`, line).then(()=>{
    //         //     handleGetAll();
    //         //   })
    //     }
    // },[isCancle])

    //결재클릭시 DB업데이트 
    useEffect(()=>{
        if(isApproval){
            //내 결재라인 구분 번호
            const apvLineSeq=getApvLineSeq();
            const cleanApvLineSeq=String(apvLineSeq).replace(/,/g,'');
            console.log(`결재번호 ${apvLineSeq}`)
            console.log(`클린결재번호 ${cleanApvLineSeq}`)
            //나는 결재 상태로 내 뒤는 대기상태로 그 뒤는 예정상태로
            axios.put(`${BaseUrl()}/approval/line/${cleanApvLineSeq}/${id}/approval`, {
                cleanApvLineSeq:cleanApvLineSeq,
                id: id
            }).then(()=>{
                setIsApproval(false);
                alert("결재 완료");
                handleGetAll();
            }).catch(()=>{
                setIsApproval(false);
                alert("결재 실패");
            })

            //내가 이 문서의 마지막 결재자이고 결재하기로 한다면 문서 상태를 승인으로 업데이트
            //결재자들이 모두 승인이면 문서상태 완료로 변경
            //id는 docSeq

        }
    },[isApproval])

    //반려클릭시 DB업데이트
    //반려 모달
    const [ modalState, setModalState ] = useState("");
    const [ isModalOpen, setIsModalOpen ] = useState(false);
    const [ isRejectModalComplete, setIsRejectModalComplete]=useState(false);
    const openModal = () => setIsModalOpen(true);
    const closeModal=()=>{
        setIsModalOpen(false);
        setModalState("");
        setIsReject(false);
    }
    const [Page, setPage] = useState(1);
    //모달내용
    const [reasonForRejection, setReasonForRejection]=useState();
    const handleModalInput=(e)=>{
        setReasonForRejection(e.target.value)
    }

    //모달 확인 클릭시
     const handleRejectComplete=()=>{
        setIsRejectModalComplete(true);
    }   

    //모달 취소 클릭시
    const handleRejectCancle=()=>{
        closeModal();
    }

    

    useEffect(()=>{
            if(isRejectModalComplete){
                console.log(reasonForRejection);
                const apvLineSeq=getApvLineSeq();
                const cleanApvLineSeq=String(apvLineSeq).replace(/,/g,'');
                //나는 결재 상태로 내 뒤는 대기상태로 그 뒤는 예정상태로
                axios.put(`${BaseUrl()}/approval/line/${cleanApvLineSeq}/${id}/reject`, {
                    cleanApvLineSeq:cleanApvLineSeq,
                    id: id,
                    reasonForRejection: reasonForRejection
                }).then(()=>{
                    setIsRejectModalComplete(false);
                    setIsReject(false);
                    alert("반려 완료");
                    handleGetAll();
                }).catch(()=>{
                    setIsRejectModalComplete(false);
                    setIsReject(false);
                    alert("반려 실패");
                })
            }
    },[isRejectModalComplete])

    //보류클릭시 DB업데이트
    // useEffect(()=>{
    //     if(isHoldoff){

    //     }
    // },[isHoldoff])

  
   
    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h3 className={styles.headerText}>{type}</h3>
            </div>
            <div className={styles.menu}>
              {isDrafterMenu && <DraferMenu setIsCancle={setIsCancle}/>}
              {isApprovalMenu && <ApprovalMenu setIsApproval={setIsApproval} isReject={isReject} setIsReject={setIsReject} setIsHoldoff={setIsHoldoff} 
              setModalState={setModalState} openModal={openModal} modalState={modalState} setPage={setPage}/>}
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
                                                        <div className={styles.name}>
                                                            {line.apvStatusCode===3 && (<div><img src={signImage} alt="Sign" className={styles.imgSize}/></div>)}
                                                            {line.apvStatusCode===4 && (<div><img src={rejectImage} alt="Sign" className={styles.imgSize}/></div>)}
                                                            <div><span className={styles.nameText}>{line.empName}</span></div>
                                                        </div>
                                                        <div className={styles.docNumber}>{formatDate(line.lineApvDate)}</div>
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

                   
            {/* 모달창 */}
            <Modal isOpen={isModalOpen} onClose={closeModal}>
                <div className={styles.modalForm}>
                    {modalState === "ModalForm" && (
                                <> 
                                    {Page===1 &&(
                                        <>
                                            <div className={styles.header}>반려 사유</div>
                                            <div className={styles.inputBox}>
                                                <input type="text" placeholder="반려 사유를 입력해주세요." className={styles.inputcss} onChange={handleModalInput}></input>
                                            </div>
                                            <div className={styles.modalbtnBox}>
                                                <button name="prev" onClick={handleRejectComplete} className={styles.btn}> 반려</button>
                                                <button name="next" onClick={handleRejectCancle} className={styles.btn} > 취소</button>
                                            </div>
                                        </>
                                    )}
                                </>
                            )}
                </div>
            </Modal>
        </div>
    );
};

