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
import {ParticipantMenu} from "./../Document/Menus/ParticipantMenu/ParticipantMenu";
import {TempMenu} from './../Document/Menus/TempMenu/TempMenu';
import signImage from './../../../../../../images/sign.PNG';
import rejectImage from './../../../../../../images/reject.PNG';
import { format } from 'date-fns';
import { Modal } from "../../../../../../components/Modal/Modal";
import { useNavigate } from 'react-router-dom';


export const DetailDocument = ({type}) => {
    const navi = useNavigate();

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

    //보류 클릭 여부 확인
    const [isHoldoffClicked, setIsHoldoffClicked] = useState(false); // 보류 버튼 클릭 여부를 관리

    //TempMenu에서 결재요청 클릭시 - 메뉴컴포넌트에 전달
    const [isTempInsert, setIsTempInsert] = useState(false);

    //TempMenu에서 임시저장 클릭시
    const [isTempTemp, setIsTempTemp] =useState(false);

    //TempMenu에서 긴급여부
    const [isTempEmergency, setIsTempEmergency]=useState(false);

    //TempMenu에서 취소 클릭시
    const [isTempCancle, setIsTempCancle]=useState(false);

    //ParticipantMenu에서 읽음 클릭시
    const [isPartCheck, setIsPartCheck]=useState(false);

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

    const [totalLineInfo, setTotalLineInfo]=useState([]);


    //메뉴 on 
    const [isDrafterMenu, setIsDrafterMenu]=useState(false);
    const [isApprovalMenu, setIsApprovalMenu]=useState(false);
    const [isTempMenu, setIsTempMenu]=useState(false);
    const [isPartMenu, setIsPartMenu]=useState(false);

    useEffect(()=>{
        handleGetAll();
    },[])


    //DB에서 정보 가져오는함수
    const handleGetAll=()=>{
        if(id!==''){
            axios.get(`${BaseUrl()}/attachment/${'approval'}/${id}`).then(resp => {
                setFiles(resp.data);
            });
            axios.get(`${BaseUrl()}/approval/document/${id}`, document).then((resp)=>{
                // console.log(`detail접근확인`);
                console.log(`detail정보확인 : ${JSON.stringify(resp.data, null, 2)}`);

                //상신취소메뉴 on 대기또는 예정 누군가 승인또는반려를 한명이라도 시작되었다면 상신취소할 수 없음.
                const allLinesMeetCondition = resp.data.apvline.every(line => 
                    line.apvStatusCode === 1 || line.apvStatusCode === 2
                );
                
                if (allLinesMeetCondition && resp.data.document.drafterSeq === sessionData.empSeq && resp.data.document.docStateCode===1) {
                    setIsDrafterMenu(true);
                }
                
                //결정메뉴들 on(결재, 반려, 보류)
                //대기와 보류일때 
                resp.data.apvline.map((line, index)=>{
                    if(line.apverId===sessionData.empSeq && (line.apvStatusCode===1 || line.apvStatusCode===8))  setIsApprovalMenu(true)
                    if(line.apvStatusCode===8) setIsHoldoffClicked(true)
                })

                //임시저장메뉴들 on 2==임시저장문서상태의미
                //내가 기안자인 임시저장상태 문서처리위한 메뉴
                if(resp.data.document.drafterSeq === sessionData.empSeq && resp.data.document.docStateCode===2){
                    setIsTempMenu(true);
                    console.log(resp.data.document.egcYn);
                    if(resp.data.document.egcYn==='y'){
                        setIsTempEmergency('y');
                    }
                    
                }

                //참조자/열람자 메뉴 on
                resp.data.pline.map((line, index)=>{
                    if(line.empSeq===sessionData.empSeq && line.readYN === 'n') setIsPartMenu(true)
                })

                const documentData = resp.data.document ? [{
                    type: 'document',
                    empName: resp.data.document.empName,
                    deptName: resp.data.document.deptName,
                    roleName: resp.data.document.roleName,
                    order: '',
                    drafterSeq: resp.data.document.drafterSeq,
                    docSeq:resp.data.document.docSeq,
                    egcYn:resp.data.document.egcYn,
                    docStateCode: resp.data.document.docStateCode
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
                    lineApvDate: item.lineApvDate,
                    lineApvCmt:item.lineApverCmt
                  })) : [];
        
                  const plineData = resp.data.pline ? resp.data.pline.map(item => ({
                    type: 'pline',
                    empName: item.empName,
                    deptName: item.deptName,
                    roleName: item.roleName,
                    order: item.pcpDivision,
                    lineSeq: item.lineSeq,
                    empSeq: item.empSeq,
                    readYN: item.readYN,
                    readDate: item.readDate
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
             
 

  
    /*********************메뉴 클릭에 따른 update******************** */
    // 나의 결재라인번호 가져오기 대기또는 보류일때만
    const getApvLineSeq = () => {
        return totalLineInfo.filter(item => item.type === 'apvline').map(item => item.apverId===sessionData.empSeq && (item.apvStatusCode === 1 || item.apvStatusCode === 8 )? item.lineSeq : '');
    };
    //나의 참가자라인번호 가져오기
    const getPartLineSeq = () => {
        return totalLineInfo.filter(item => item.type === 'pline').map(item =>  item.empSeq === sessionData.empSeq && item.readYN === 'n' ? item.lineSeq : '');
    };

    
    //상신취소클릭시 DB업데이트
    //상신취소는 결재처리를 아무도 하지 않았을 때 기안자만 할 수 있다.
    useEffect(()=>{
        if(isCancle){
            if(window.confirm("상신취소하시겠습니까? 모든 내용은 사라집니다.")){
                axios.delete(`${BaseUrl()}/approval/document/${id}?table=${formConfig[type].name.toLowerCase()}`, id)
                .then(()=>{
                    setIsCancle(false);
                    navi(`/approval`); // 절대 경로 사용
                }).catch(()=>{
                    setIsCancle(false);
                    alert("취소 실패");
                })
            }else{
                setIsCancle(false);
            }
     
        }
    },[isCancle])

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
                setIsApprovalMenu(false);
                alert("결재 완료");
                handleGetAll();
            }).catch(()=>{
                setIsApproval(false);
                setIsApprovalMenu(false);
                alert("결재 실패");
            })

            //내가 이 문서의 마지막 결재자이고 결재하기로 한다면 문서 상태를 승인으로 업데이트
            //결재자들이 모두 승인이면 문서상태 완료로 변경
            //id는 docSeq

        }
    },[isApproval, totalLineInfo])

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
                    setIsRejectModalComplete(false); //모달창 반려버튼
                    setIsReject(false); //반려버튼
                    setIsApprovalMenu(false);
                    alert("반려 완료");
                    handleGetAll();
                    closeModal();
                    
                }).catch(()=>{
                    setIsRejectModalComplete(false);
                    setIsReject(false);
                    setIsApprovalMenu(false);
                    alert("반려 실패");
                    closeModal();
                })
            }
    },[isRejectModalComplete, totalLineInfo])

    //모달 취소 클릭시
    const handleRejectCancle=()=>{
        closeModal();
    }

    //보류클릭시 DB업데이트
    useEffect(()=>{
        if(isHoldoff){
            const apvLineSeq=getApvLineSeq();
            const cleanApvLineSeq=String(apvLineSeq).replace(/,/g,'');
            console.log(`결재번호 ${apvLineSeq}`)
            console.log(`클린결재번호 ${cleanApvLineSeq}`)
            //나는 결재 상태로 내 뒤는 대기상태로 그 뒤는 예정상태로
            axios.put(`${BaseUrl()}/approval/line/${cleanApvLineSeq}/holdoff`, {
                cleanApvLineSeq:cleanApvLineSeq,
            }).then(()=>{
                setIsHoldoff(false);
                alert("보류 완료");
                handleGetAll();
            }).catch(()=>{
                setIsHoldoff(false);
                alert("보류 실패");
            })
        }
    },[isHoldoff, totalLineInfo])

     //임시저장에서 취소 시 DB삭제
     useEffect(()=>{
        if(isTempCancle && id){
            if(window.confirm("삭제하시겠습니까?")){
                axios.delete(`${BaseUrl()}/approval/document/${id}?table=${formConfig[type].name.toLowerCase()}`, id)
                .then(()=>{
                    setIsTempCancle(false);
                    alert("삭제 성공");
                    navi(`/approval/list?type=임시문서함`); //임시문서함으로 이동되게 하기
                }).catch(()=>{
                    setIsTempCancle(false);
                    alert("삭제 실패");
                })
            }else{
                setIsTempCancle(false);
            }
        }
    },[isTempCancle, id])

    //wirte시에는 business내용까지 insert해야해서 긴급처리를 business에서 했지만
    //임시저장 후 긴급여부 같은 경우에는 엄연히 따지면 update처리이기 때문에 이곳에 한다.
    //임시저장에서 긴급여부 선택시 문서 정보 변경
    useEffect(()=>{
        if(isTempEmergency && id){
            console.log(isTempEmergency)
            axios.put(`${BaseUrl()}/approval/document/temp/emergency/${id}`,  { isTempEmergency: isTempEmergency } ).then((resp)=>{
            })
        }
    },[isTempEmergency, id])


    //참조자, 열람자 확인 클릭시
    useEffect(()=>{
        if(isPartCheck){
            //내 결재라인 구분 번호
            const partLineSeq=getPartLineSeq();
            const cleanPartLineSeq=String(partLineSeq).replace(/,/g,'');
            console.log(`결재번호 ${partLineSeq}`)
            console.log(`클린결재번호 ${cleanPartLineSeq}`)
            //나는 결재 상태로 내 뒤는 대기상태로 그 뒤는 예정상태로
            axios.put(`${BaseUrl()}/approval/line/${cleanPartLineSeq}/${id}/part`, {
                cleanPartLineSeq:cleanPartLineSeq,
                id: id
            }).then(()=>{
                setIsPartCheck(false);
                setIsPartMenu(false);
                alert("읽음 처리 완료");
                handleGetAll();
            }).catch(()=>{
                setIsPartCheck(false);
                setIsPartMenu(false);
                alert("읽음 처리 실패");
            })

        }
    },[isPartCheck, totalLineInfo])



    // 사이드 메뉴 상태 관리
    const [activeMenu, setActiveMenu] = useState('checkInfo'); // 기본값 설정

    // 메뉴 변경 핸들러
    const handleMenuClick = (menu) => {
        setActiveMenu(menu);
    };

    const menuItems = [
        { id: 'checkInfo', label: '확인기록' },
        ...(totalLineInfo.some(item => item.type === 'document' && item.docStateCode === 4) ? [{ id: 'rejectInfo', label: '반려정보' }] : [])
    ];
    
    useEffect(()=>{
        console.log(totalLineInfo)
    },[totalLineInfo])

    //첨부파일    
    const [files, setFiles] = useState([]);

     //첨부파일 조회 및 다운로드
     const [isFileBoxOpen, setIsFileBoxOpen] = useState(false);
     const handleFileBox = () => {
         setIsFileBoxOpen(prev => !prev);
     }

      //파일 다운로드
    const handleDownload = async (fileUrl, fileName) => {
        try {
            const response = await axios.get(`${BaseUrl()}/attachment/download`, {
                params: { fileUrl: fileUrl },
                responseType: 'blob',
                headers: {
                    'Content-Type': 'application/octet-stream'
                }
            });

            const blob = new Blob([response.data], { type: 'application/octet-stream' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = fileName;
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('다운로드 중 에러 발생.');
        }
    }

 
  
   
    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h3 className={styles.headerText}>{type} 
                {totalLineInfo.some(item => item.type === 'document' && item.egcYn === 'y') && (
                         <span className={styles.egcstate}>긴급</span>
                    )}
                </h3>
            </div>
            <div className={styles.menu}>
                {isPartMenu && <ParticipantMenu setIsPartCheck={setIsPartCheck}/>}
                {isDrafterMenu && <DraferMenu setIsCancle={setIsCancle}/>}
                {isApprovalMenu && <ApprovalMenu setIsApproval={setIsApproval} isReject={isReject} setIsReject={setIsReject} setIsHoldoff={setIsHoldoff} setIsHoldoffClicked={setIsHoldoffClicked} isHoldoffClicked={isHoldoffClicked}
                 setModalState={setModalState} openModal={openModal} modalState={modalState} setPage={setPage}/>}
                {isTempMenu && <TempMenu isTempEmergency={isTempEmergency} setIsTempInsert={setIsTempInsert} setIsTempEmergency={setIsTempEmergency}  setIsTempTemp={setIsTempTemp} setIsTempCancle={setIsTempCancle}/>}
            </div>
            <div className={styles.detail}>
                {/* left와 side 섹션을 감싸는 래퍼 추가 */}
                <div className={styles.contentWrapper}>
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
                            <FormComponent type={type} id={id} isTempMenu={isTempMenu} 
                            isTempInsert={isTempInsert} setIsTempInsert={setIsTempInsert} 
                            isTempEmergency={isTempEmergency} setIsTempEmergency={setIsTempEmergency}
                            isTempTemp={isTempTemp} setIsTempTemp={setIsTempTemp}
                            isTempCancle={isTempCancle} setIsTempCancle={setIsTempCancle}/> 
                        </div>
                    </div> 
                    </div>
                    </div>
                        {files.length > 0 &&
                        ((isFileBoxOpen) ? <div className={styles.fileHeader}>
                            <div className={styles.fileLetter} onClick={handleFileBox}>첨부파일 ({files.length}) ▲</div>
                        </div> : <div className={styles.fileHeader}>
                            <div className={styles.fileLetter} onClick={handleFileBox}>첨부파일 ({files.length}) ▼</div>
                        </div>)
                    }
                    <div className={styles.fileBox}>
                        {isFileBoxOpen && files.map((file, i) => {
                            return (
                                <>
                                    <p className={styles.eachFile} key={i} onClick={() => { handleDownload(file.attachmentSysname, file.attachmentOriname) }}>{i + 1}. {file.attachmentOriname}</p>
                                </>
                            );
                        })
                        }
                    </div>
                </div>
                {/* 오른쪽 */}
                <div className={styles.side}>
                    <div className={styles.menuBox}>
                        {menuItems.map((item) => (
                            <div
                                key={item.id}
                                className={`${styles.menudiv} ${activeMenu === item.id ? styles.active : ''}`}
                                onClick={() => handleMenuClick(item.id)}
                            >
                                <span className={styles.menuspan}>{item.label}</span>
                            </div>
                        ))}
                    </div>
                    <div className={styles.menuInfo}>
                        <div className={styles.sideinfo}>
                            {menuItems.map((item) => (
                                activeMenu === item.id && (
                                    <div key={item.id}>
                                        {/* 메뉴에 따른 내용을 여기서 구분해서 출력 */}
                                        {item.id === 'checkInfo' && (
                                            <div className={styles.infocontainer}>
                                                {/* 참조자 섹션 */}
                                                {totalLineInfo.filter(line => line.type === 'pline' && line.order === 'r').length > 0 ? (
                                                    <div className={`${styles.section} ${styles.referenceSection}`}>
                                                        <h4 className={styles.sectionTitle}>참조자</h4>
                                                        {totalLineInfo.filter(line => line.type === 'pline' && line.order === 'r').map((line, index) => (
                                                            <div key={index} className={styles.row}>
                                                                <div className={styles.rightdiv}>
                                                                    <span>{line.empName}</span> <span>{line.roleName}</span> <span>({line.deptName}) : </span> <span>{line.readDate ? formatDate(line.readDate) : '미확인'}</span>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <div className={styles.section}>
                                                        <h4 className={styles.sectionTitle}>참조자</h4>
                                                        <div className={styles.row}>
                                                            <span>참조자 정보가 없습니다.</span>
                                                        </div>
                                                    </div>
                                                )}

                                                {/* 열람자 섹션 */}
                                                {totalLineInfo.filter(line => line.type === 'pline' && line.order === 'v').length > 0 ? (
                                                    <div className={styles.section}>
                                                        <h4 className={styles.sectionTitle}>열람자</h4>
                                                        {totalLineInfo.filter(line => line.type === 'pline' && line.order === 'v').map((line, index) => (
                                                            <div key={index} className={styles.row}>
                                                                <div className={styles.rightdiv}>
                                                                    <span>{line.empName}</span> <span>{line.roleName}</span> <span>({line.deptName}) : </span> <span>{line.readDate ? formatDate(line.readDate) : '미확인'}</span>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <div className={styles.section}>
                                                        <h4 className={styles.sectionTitle}>열람자</h4>
                                                        <div className={styles.row}>
                                                            <span>열람자 정보가 없습니다.</span>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                       {item.id === 'rejectInfo' && (
                                        <div className={styles.infocontainer}>
                                            <div className={`${styles.section} ${styles.referenceSection}`}>
                                                <h4 className={styles.sectionTitle}>반려자</h4>
                                                {totalLineInfo.filter(line => line.type === 'apvline' && line.apvStatusCode === 4).map((line, index) => (
                                                    <div key={index} className={styles.row}>
                                                        <div className={styles.rightdiv}>
                                                            <span>{line.empName}</span> <span>{line.roleName}</span> <span>({line.deptName})</span>
                                                        </div>
                                                    </div>
                                                ))}
                                                <h4 className={styles.sectionTitle}>반려 이유</h4>
                                                {totalLineInfo.filter(line => line.type === 'apvline' && line.apvStatusCode === 4).map((line, index) => (
                                                    <div key={index} className={styles.row}>
                                                        <div className={styles.rightdiv}>
                                                            <span>{line.lineApvCmt}</span>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                    </div>
                                )
                            ))}
                        </div>
                    </div>
                </div>
            </div>    
            </div>

                   
            {/* 모달창 */}
            <Modal isOpen={isModalOpen} onClose={closeModal}>
                <div className={styles.modalForm}>
                    {modalState === "ModalForm" && (
                                <> 
                                    {Page===1 &&(
                                        <>
                                            <div className={styles.modalheader}>반려 사유</div>
                                            <div className={styles.inputBox}>
                                                <input type="text" placeholder="반려 사유를 입력해주세요 최대(30자)" className={styles.inputcss} onChange={handleModalInput} maxLength="30"></input>
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

