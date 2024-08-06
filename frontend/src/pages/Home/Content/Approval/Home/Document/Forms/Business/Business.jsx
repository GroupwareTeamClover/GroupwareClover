import styles from './Business.module.css'
import axios from 'axios';
import { useState, useEffect, useRef } from 'react';

import { BaseUrl } from '../../../../../../../../commons/config';
import { useApprovalStore } from '../../../../../../../../store/approvalStore';
import { useMemberStore } from '../../../../../../../../store/store';
import  WebEditor  from '../../../../../../../../components/WebEditor/WebEditor';

import { BsChevronDoubleLeft } from 'react-icons/bs';

export const Business =({isInsert, setIsInsert, isEmergency})=>{  
    const {cloneDocCode, cloneEmpInfo} =useApprovalStore();
    //세션정보
    const {sessionData} = useMemberStore();

    const editorRef = useRef();

    //날짜, 제목
    const [date, setDate]=useState();
    const [title, setTitle]=useState();
    const handleDateChange=(e)=>{setDate(e.target.value);}
    const handleTitleChange=(e)=>{setTitle(e.target.value)}

    // <handleContentChange> - 에디터 내용 변경 시 호출할 onChange함수
    const [content, setContent] = useState();
    const handleContentChange = () => {
        setContent(editorRef.current.getInstance().getHTML());
    }

    // DTO로 만들 데이터
    const [business, setBusiness] = useState({
        // DocumentDTO: {},
        // ApvLineDTO: {},
        // ParticipantsLineDTO: {},
        // docType: '',
        // docData:{}
    });


        console.log(cloneDocCode);
        console.log(cloneEmpInfo);
        console.log(cloneEmpInfo.apvchoice[0].seq);
     

        // DocumentDTO 구성
        const documentDTO = {
            docSeq:0,
            docDetailCode: cloneDocCode.children.detailcode, // 예시 값
            docStateCode: 1, // 진행중의미
            drafterSeq: sessionData.empSeq, // 기안자seq
            egcYn: isEmergency, //긴급여부
            writeDate: null,
            finishDate: null,
            currentApverSeq: cloneEmpInfo.apvchoice[0].seq, // 현재결재자
            finalApverSeq: cloneEmpInfo.apvchoice[cloneEmpInfo.apvchoice.length-1].seq, // 최종결재자
            docComSeq: null
        };

        // ApvLineDTO 
        const apvLineDTOs= cloneEmpInfo.apvchoice.map((line, index)=>({
            apvStatusCode:  index === 0 ? 1 : 2,
            apverId: line.seq,
            lineApverCmt: '',
            lineOrder: index + 1
        }))

    // ParticipantsLineDTO 구성
    // refchoice
    const refParticipants = cloneEmpInfo.refchoice.map((line, index) => ({
        lineSeq:0,
        empSeq: line.seq,
        pcpDivision: 'r',
        readYN: 'n',
        readDate: null,
        docSeq: 0
    }));

    // viechoice
    const vieParticipants = cloneEmpInfo.viechoice.map((line, index) => ({
        lineSeq:0,
        empSeq: line.seq,
        pcpDivision: 'v',
        readYN: 'n',
        readDate: null,
        docSeq: 0
    }));

    const participantsLineDTOs = [...refParticipants, ...vieParticipants];

    useEffect(() => {
        // DTO 상태 업데이트
        setBusiness({
            "document" : documentDTO,
            "apvline" : apvLineDTOs,
            "pline" : participantsLineDTOs,
            "docType" : 'business', // 문서 타입
            "docData" : {
                "bsSeq" : 0,
                "bsTitle" : title,
                "bsContent" :content,
                "bsWriteDate" : date,
                "parentSeq" : 0
            }

    })}, [date, title, content, isEmergency]);
   

    //insert
    useEffect(() => {
        if (isInsert) {
            console.log('Business state:', business); // 디버깅용
            console.log(`refParticipants : ${refParticipants}`);
            console.log(`vieParticipants : ${vieParticipants}`);
            
            axios.post(`${BaseUrl()}/approval/document`, business).then((resp) => {
                console.log("응답 생성된 seq번호: "+ resp.data);
                setIsInsert(false);
            }).catch((error) => {
                alert('문서 생성 실패');
                console.log(error);
                setIsInsert(false);
            });
        }
    }, [isInsert, business]);
    



    return(
        <div className={styles.container}>
            <div className={styles.datatitle}>
                <div className={styles.date}>
                    <div className={styles.name}>시행일자</div>
                    <div className={styles.value}>
                        <input type='date' className={styles.inputdate} onChange={handleDateChange}></input>
                    </div>
                </div>
                <div className={styles.title}>
                    <div className={styles.name}>제목</div>
                        <div className={styles.value}>
                            <input type='text' className={styles.inputtitle} placeholder='제목을 입력하세요.' onChange={handleTitleChange}></input>
                        </div>
                    </div>
                </div>
            <div className={styles.editerContainer}>
                <WebEditor editorRef={editorRef} handleContentChange={handleContentChange} height="100%" defaultContent=""/>
            </div>                     
        </div>
    
    )
}

