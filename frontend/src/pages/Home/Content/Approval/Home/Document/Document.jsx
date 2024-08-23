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
import axios from "axios";
import {WriterMenu} from './Menus/WriterMenu/WriterMenu';
import { BaseUrl } from "../../../../../../commons/config";
import { DragFolder } from "../../Side/ChoiceLine/DragFolder/DragFolder";
import { ProgressBar } from "react-bootstrap";
import { DraferMenu } from "./Menus/DrafterMenu/DrafterMenu";
import 'rsuite/Uploader/styles/index.css';
import { Uploader } from 'rsuite';
import { smallAlert } from "../../../../../../commons/common";

export const Document = ({type}) => {
    //type==Business
    //맵핑해서 양식별 메뉴와 폼 컴포넌트 결정
    // const formConfig = {
    //     업무기안: Business,
    //     휴가신청서: Dayoff,
    //     invalid: () => <div>유효하지 않은 양식입니다.</div>,
    // };
    // const FormComponent = formConfig[type] || formConfig.invalid;

    /*********************writer******************** */

    //모달정보
    const {cloneDocCode, cloneEmpInfo, isModalComplete, setIsModalComplete} =useApprovalStore();
    //세션정보
    const {sessionData} = useMemberStore();

        // DocumentDTO 구성
        const [documentDTO, setDocumentDTO] = useState({
            docSeq: 0,
            docDetailCode: cloneDocCode.children.detailcode, // 예시 값
            docStateCode: 1, // 진행중의미
            drafterSeq: sessionData.empSeq, // 기안자seq
            egcYn: 'n', //긴급여부
            writeDate: null,
            finishDate: null,
            currentApverSeq: cloneEmpInfo.apvchoice[0].seq, // 현재결재자
            finalApverSeq: cloneEmpInfo.apvchoice[cloneEmpInfo.apvchoice.length - 1].seq, // 최종결재자
            docComSeq: null
        });
    
        // ApvLineDTO
        const initialApvLineDTOs = cloneEmpInfo.apvchoice.map((line, index) => ({
            apvStatusCode:  index === 0 ? 1 : 2,
            apverId: line.seq,
            lineApverCmt: '',
            lineOrder: index + 1
        }));
        const [apvLineDTOs, setApvLineDTOs] = useState(initialApvLineDTOs);
    
        // ParticipantsLineDTO 구성
        const initialRefParticipants = cloneEmpInfo.refchoice.map((line, index) => ({
            lineSeq: 0,
            empSeq: line.seq,
            pcpDivision: 'r',
            readYN: 'n',
            readDate: null,
            docSeq: 0
        }));
        const [refParticipants, setRefParticipants] = useState(initialRefParticipants);
    
        const initialVieParticipants = cloneEmpInfo.viechoice.map((line, index) => ({
            lineSeq: 0,
            empSeq: line.seq,
            pcpDivision: 'v',
            readYN: 'n',
            readDate: null,
            docSeq: 0
        }));
        const [vieParticipants, setVieParticipants] = useState(initialVieParticipants);
    
        const [participantsLineDTOs, setParticipantsLineDTOs] = useState([...refParticipants, ...vieParticipants]);
    
        // 현재 날짜 마운트 시 한 번만
        const [currentDate, setCurrentDate] = useState(null);
        useEffect(() => {
            setDrafterData((prev)=>
                prev.map((item)=>
                    item.label==='기안일' ? {...item, value: new Date().toLocaleDateString()}: item
                )
            )
        }, []);

        //왼쪽 기안자 정보
        const [drafterData, setDrafterData]=useState([ 
            { label: '기안자', value: sessionData.empName },
            { label: '소속', value: sessionData.empDeptName },
            { label: '기안일', value: currentDate },
            { label: '문서번호', value: '' }
        ]); 
    
     //결재요청 클릭시 각 양식에서 상태확인
     const [isInsert, setIsInsert] = useState(false);
     // 긴급여부 체크박스 상태
     const [isEmergency, setIsEmergency] = useState('n');
     // 임시저장 클릭 시
     const [isTemp, setIsTemp]=useState(false);

    //긴급처리
     useEffect(() => {
        setDocumentDTO((prev) => ({ ...prev, egcYn: isEmergency }));
    }, [isEmergency]);


     //첨부파일
     const [files, setFiles] = useState([]);
     const handleFileChange = (fileList) => {
         setFiles(fileList);
     };
     //누적
    let fileCount=0;  
    const duplicateFiles = []; // 중복된 파일들을 저장할 리스트   
    const handleUploadSuccess = (response, file) => {
        fileCount++;

        //한꺼번에 5개 초과 넣을 때 막기 
        if(fileCount>5){
            smallAlert("파일은 최대 5개까지만 업로드 가능합니다.")
            setFiles([]);
            return;
        }

        // 하나씩 들어올 때 막기
        if (files.length >= 5) {
            smallAlert("파일은 최대 5개까지만 업로드 가능합니다.");
            // handleRemove(file) 대신 아래 코드를 사용하여 신규 파일만 제거
            setFiles((prevFiles) => prevFiles.filter(f => f.name !== file.name || f.url !== response));
            return;
        }

        
         // 파일 리스트에 업로드된 파일 추가
         setFiles((prevFiles) => {
            // 새로운 파일을 추가한 리스트 생성
            let newFiles = [...prevFiles, { name: file.name, url: response }];

            
            // 중복된 파일을 확인하고 제거
            const uniqueFiles = newFiles.filter((file, index, self) =>
                index === self.findIndex(f => f.name === file.name)
            );

            // 중복 파일이 제거되었는지 확인하고 알림 표시
            if (newFiles.length !== uniqueFiles.length) {
                smallAlert("중복된 파일이 제거되었습니다.");
            }

            newFiles = uniqueFiles; // 중복 파일이 제거된 리스트로 업데이트

            // 부분적으로 막는 방법: 누적된 파일 리스트의 길이로 개수를 판단
            if (newFiles.length > 5) {
                smallAlert("파일은 최대 5개까지만 업로드 가능합니다.");
                return prevFiles; // 누적하지 않음
            }

            return newFiles; // 새로운 파일 리스트를 업데이트

         })
    };
     const handleRemove = (file) => {
         // 파일 리스트에서 해당 파일 제거
         setFiles((prev) => prev.filter((f) => f.name !== file.name));
     };
     const path = encodeURIComponent("temp");

     // 모달이 완료된 후 파일 리스트 초기화
    useEffect(() => {
        if (isModalComplete) {
            handleFileChange([]); // 파일 리스트 초기화
        }
    }, [isModalComplete]);






    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h3 className={styles.headerText}>
                     {/* 원래 type===업무기안이었음 */}
                    업무기안</h3>
            </div>
            <div className={styles.menu}>
                <WriterMenu setIsInsert={setIsInsert} setIsEmergency={setIsEmergency} setIsTemp={setIsTemp}/>
            </div>
            <div className={styles.detail}>
                {/* left와 side 섹션을 감싸는 래퍼 추가 */}
                <div className={styles.contentWrapper}>
                    {/* 왼쪽 */}
                    <div className={styles.left}>
                        <div className={styles.test}>
                            <div className={styles.leftcontainer}>
                                    <div className={styles.insideheader}>
                                         {/* 원래 type===업무기안이었음 */}
                                        <span><h2>업무기안</h2></span>
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
                                            <Business type={type} isInsert={isInsert} setIsInsert={setIsInsert} isEmergency={isEmergency}
                                                documentDTO={documentDTO} setDocumentDTO={setDocumentDTO}
                                                apvLineDTOs={apvLineDTOs} setApvLineDTOs={setApvLineDTOs}
                                                participantsLineDTOs={participantsLineDTOs} setParticipantsLineDTOs={setParticipantsLineDTOs}
                                                isTemp={isTemp} setIsTemp={setIsTemp} files={files} setFiles={setFiles}
                                                
                                            /> 
                                        </div>
                                    </div> 
                            </div>
                        </div>
                        <div className={styles.fileBox}>
                            <Uploader autoUpload={true} action={`${BaseUrl()}/attachment/upload/${path}`} multiple draggable
                                onSuccess={handleUploadSuccess} onRemove={handleRemove} fileList={files} defaultFileList={files}  
                                handleFileChange={handleFileChange} >
                                <div style={{ lineHeight: '100px', textAlign: 'center' }}>클릭하거나 드래그하여 파일을 추가하세요</div>
                            </Uploader>
                        </div> 
                    </div>
                    {/* 오른쪽 */}
                    <div className={styles.side}></div>
                </div>
            </div>
        </div>
    );
};

