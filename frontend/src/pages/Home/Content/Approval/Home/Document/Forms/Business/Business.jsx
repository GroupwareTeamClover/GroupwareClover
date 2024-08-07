import styles from './Business.module.css'
import axios from 'axios';
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

import { BaseUrl } from '../../../../../../../../commons/config';
import { useApprovalStore } from '../../../../../../../../store/approvalStore';
import { useMemberStore } from '../../../../../../../../store/store';
import  WebEditor  from '../../../../../../../../components/WebEditor/WebEditor';

import { BsChevronDoubleLeft } from 'react-icons/bs';

export const Business =({type, isInsert, setIsInsert, isEmergency, 
    documentDTO, setDocumentDTO, 
    apvLineDTOs, setApvLineDTOs, 
    participantsLineDTOs, setParticipantsLineDTOs,
    id 
})=>{  
    const navi = useNavigate();

    //********************************write 시 코드******************************************/
    const {cloneDocCode, cloneEmpInfo} =useApprovalStore();
    //세션정보
    const {sessionData} = useMemberStore();
    const [isReadOnly, setIsReadOnly] = useState(false); // 추가된 상태
    //날짜, 제목
    const [date, setDate]=useState();
    const [title, setTitle]=useState();
    const handleDateChange=(e)=>{setDate(e.target.value);}
    const handleTitleChange=(e)=>{setTitle(e.target.value)}

    // <handleContentChange> - 에디터 내용 변경 시 호출할 onChange함수
    const [content, setContent] = useState();
    const editorRef = useRef();
    const handleContentChange = () => {
        setContent(editorRef.current.getInstance().getHTML());
    }
    

    // DTO로 만들 데이터
    const [business, setBusiness] = useState({});
        // console.log(cloneDocCode);
        // console.log(cloneEmpInfo);
    const [docData, setDocData] = useState({
        "bsSeq" : 0,
        "bsTitle" : title,
        "bsContent" :content,
        "bsWriteDate" : date,
        "parentSeq" : 0
    })

    useEffect(() => {
        // DTO 상태 업데이트
        setDocData((prev) => ({
            ...prev,
            bsTitle: title,
            bsContent: content,
            bsWriteDate: date
        }));
    }, [date, title, content]);
     
 
    useEffect(() => {
        // DTO 상태 업데이트
        setBusiness({
            "document" : documentDTO,
            "apvline" : apvLineDTOs,
            "pline" : participantsLineDTOs,
            "docType" : 'business', // 문서 타입
            "docData" : docData
        })
        console.log(documentDTO);
        console.log(apvLineDTOs);
        console.log(participantsLineDTOs);
        console.log(docData);

    }, [date, title, content, isEmergency, docData]);
   

    //insert
    useEffect(() => {
        if (isInsert && !id) {  // id가 없는 경우에만 실행
            axios.post(`${BaseUrl()}/approval/document`, business).then((resp) => {
                alert("문서 생성 성공");
                navi(`/approval/document/${resp.data}?type=${type}`);
                setIsInsert(false);
            }).catch((error) => {
                alert('문서 생성 실패');
                console.log(error);
                setIsInsert(false);
            });
            
        }
    }, [isInsert, business, id]);



    //********************************detail 시 코드******************************************/
    //select
    const contentRef = useRef(null);
    useEffect(() => {
        if (id) {
            axios.get(`${BaseUrl()}/approval/document/${id}/${type}?table=business`, business).then((resp) => {
                console.log(resp.data);
                const writeDate = new Date(resp.data.BS_WRITE_DATE).toISOString().split('T')[0];
                contentRef.current.innerHTML = resp.data.BS_CONTENT;
                setDocData((prev) => ({
                    ...prev,
                    bsSeq: resp.data.BS_SEQ,
                    bsTitle: resp.data.BS_TITLE,
                    bsContent: resp.data.BS_CONTENT,
                    bsWriteDate: writeDate,
                    parentSeq: resp.data.PARENT_SEQ
                }));
                setIsReadOnly(true); // 데이터를 가져온 후 읽기로 설정
            });
        }
    }, [id]);
    
    return(
        <div className={styles.container}>
            <div className={styles.datatitle}>
                <div className={styles.date}>
                    <div className={styles.name}>시행일자</div>
                    <div className={styles.value}>
                        <input type='date' className={styles.inputdate} onChange={handleDateChange} value={docData.bsWriteDate} disabled={isReadOnly}></input>
                    </div>
                </div>
                <div className={styles.title}>
                    <div className={styles.name}>제목</div>
                        <div className={styles.value}>
                            <input type='text' className={styles.inputtitle} placeholder='제목을 입력하세요.' onChange={handleTitleChange} value={docData.bsTitle} disabled={isReadOnly}></input>
                        </div>
                    </div>
                </div>
            <div className={styles.editerContainer}>
                {!id && <WebEditor editorRef={editorRef} handleContentChange={handleContentChange} height="100%" defaultContent=""/>}
                {id && <div  ref={contentRef} ></div>}
            </div>                     
        </div>
    
    )
}

