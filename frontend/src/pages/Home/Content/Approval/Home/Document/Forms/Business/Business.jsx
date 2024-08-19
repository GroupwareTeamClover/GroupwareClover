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
                            id, setIsTemp, isTemp, isTempMenu,
                            isTempInsert, setIsTempInsert,
                            isTempEmergency, setIsTempEmergency,
                            isTempTemp, setIsTempTemp,
                            isTempCancle, setIsTempCancle
                        })=>{
    const navi = useNavigate();
    const [isContentLoaded, setIsContentLoaded] = useState(false);

    //********************************write 시 코드******************************************/
    const {cloneDocCode, cloneEmpInfo, isModalComplete, setIsModalComplete} =useApprovalStore();
    //세션정보
    const {sessionData} = useMemberStore();
    const [isReadOnly, setIsReadOnly] = useState(false); // 추가된 상태
    //날짜, 제목
    const [date, setDate]=useState(null);
    const [title, setTitle]=useState('');
    const handleDateChange = (e) => {
        const selectedDate = e.target.value;
        setDate(selectedDate === "" ? null : selectedDate); // 날짜가 입력되지 않았을 때 null로 설정
    };
    const handleTitleChange=(e)=>{setTitle(e.target.value);}

    // <handleContentChange> - 에디터 내용 변경 시 호출할 onChange함수
    const [content, setContent] = useState('');
    const editorRef = useRef('');
    const handleContentChange = () => {
        setContent(editorRef.current.getInstance().getHTML());
    }

    // defaultContent를 관리할 상태 변수 추가
    const [defaultContent, setDefaultContent] = useState("");

    // 유효성 검사 함수
    const validateForm = () => {
        if (!title) {
            alert("제목은 필수 값입니다.");
            return true;
        }
        return false;
    };

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
        // 의존성 배열에 필요한 상태만 포함
        setBusiness((prevBusiness) => {
            if (
              prevBusiness.document !== documentDTO ||
              prevBusiness.docData !== docData ||
              prevBusiness.apvline !== apvLineDTOs ||
              prevBusiness.pline !== participantsLineDTOs
            ) {
                return {
                    "document": documentDTO,
                    "apvline": apvLineDTOs,
                    "pline": participantsLineDTOs,
                    "docType": 'business', // 문서 타입
                    "docData": docData
                };
            }
            return prevBusiness;
        });
    }, [documentDTO, apvLineDTOs, participantsLineDTOs, docData]);

    // 결재양식, 라인선택 후 모달 확인 클릭시
    // 초기화
    useEffect(() => {
        if (isModalComplete) {
            setDate(null);
            setTitle('');
            setContent('');
            if (editorRef.current) {
                editorRef.current.getInstance().setHTML(''); // 에디터 내용 초기화
            }
        }
        setIsModalComplete(false);
    }, [isModalComplete]);


    //insert
    useEffect(() => {
        if (isInsert && !id) {  // id가 없는 경우에만 실행
            if (validateForm()) {
                setIsInsert(false);
            }else{
                console.log('전송할 데이터:', business); // 전송 전에 데이터를 로그로 확인
                axios.post(`${BaseUrl()}/approval/document`, business).then((resp) => {
                    alert("문서 생성 성공");
                    navi(`/approval/document/${resp.data}?type=${type}`);
                    setIsInsert(false);
                }).catch((error) => {
                    alert('문서 생성 실패');
                    setIsInsert(false);
                });
            }
        }
    }, [isInsert]);

    //임시저장 insert할 때 사용
    useEffect(() => {
        if (isTemp && !id) {  // id가 없는 경우에만 실행
            console.log('setDocumentDTO있는 영역');
            console.log(business);
            // 기존 값에 임시저장 상태로 업데이트
            setDocumentDTO((prev) => ({
                ...prev,
                docStateCode: 2
            }));
        }
    }, [isTemp]);

    useEffect(() => {
        if (isTemp && !id) {
            console.log(business);
            axios.post(`${BaseUrl()}/approval/document`, business)
              .then((resp) => {
                  alert("임시 저장 성공");
                  navi(`/approval/document/${resp.data}?type=${type}`);
                  setIsTemp(false);
              })
              .catch((error) => {
                  alert('임시 저장 실패');
                  setIsTemp(false);
              });
        }
    }, [business]);


    //********************************detail 시 코드******************************************/
    //select
    const contentRef = useRef(null);

    const getData=()=>{
        axios.get(`${BaseUrl()}/approval/document/${id}/${type}?table=business`, business).then((resp) => {
            console.log(resp.data);
            let writeDate = null;
            if (resp.data.BS_WRITE_DATE) {
                // '2024. 8. 14.' 형식으로 받은 날짜를 'YYYY-MM-DD' 형식으로 변환
                const localeDate = new Date(resp.data.BS_WRITE_DATE).toLocaleDateString('ko-KR');
                const [year, month, day] = localeDate.split('. ').map(num => num.replace('.', '').padStart(2, '0'));
                writeDate = `${year}-${month}-${day}`;
                console.log(`날짜 정보: ${writeDate}`);
            } else {
                console.log("날짜 정보: null");
            }
            //디테일 페이지에서 사용
            if (contentRef.current) {  // contentRef.current가 null이 아닌지 확인
                contentRef.current.innerHTML = resp.data.BS_CONTENT || "";
            }

            // 가져온 BS_CONTENT를 defaultContent로 설정
            setDefaultContent(()=>{
                setIsContentLoaded(true);
                return resp.data.BS_CONTENT || "";
            });

            setTitle(resp.data.BS_TITLE);
            setDate(writeDate);
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
    useEffect(() => {
        if (id) {
            getData();
        }
    }, [id]);

    //********************************temp 시 코드******************************************/
    //임시저장후 디테일페이지에 들어왔을 때 사용
    useEffect(()=>{
        if(isTempMenu){
            setIsReadOnly(false);
        }
    },[isTempMenu, docData])

    //임시저장에서 결재요청 시 documnet정보 진행중으로 변경
    useEffect(() => {
        if (isTempInsert && id) {

            if (validateForm()) {
                setIsTempInsert(false);
            }else{
                // console.log(business.docData);
                axios.put(`${BaseUrl()}/approval/document/temp/${id}/${type}?table=business`, business).then((resp) => {
                    alert("문서 생성 성공");
                    navi(`/approval/list?type=기안진행`);
                    setIsTempInsert(false);
                }).catch((error) => {
                    alert('문서 생성 실패');
                    setIsTempInsert(false);
                });
            }
        }
    }, [isTempInsert]);

    //임시저장에서 임시저장 시 정보 변경
    useEffect(()=>{

        if(isTempTemp && id){
            axios.put(`${BaseUrl()}/approval/document/temp/temp/${id}/${type}?table=business`, business).then((resp) => {
                setIsTempTemp(false);
                alert("저장 완료");
                navi(`/approval/document/${resp.data.id}?type=${resp.data.type}`);
            }).catch((error) => {
                setIsTempTemp(false);
                alert("저장 실패");
            });
        }
    },[isTempTemp])


    const today = new Date().toISOString().split('T')[0];

    //임시저장하고 결재요청시 예외처리
    useEffect(() => {
        // 컴포넌트가 마운트되거나 defaultContent가 변경될 때 content 상태를 초기화
        if (defaultContent) {
            setContent(defaultContent);
        }
    }, [defaultContent]);


    // 컴포넌트가 언마운트될 때 인스턴스 해제
    useEffect(() => {
        return () => {
            if (editorRef.current) {
                editorRef.current.getInstance().destroy();  // 인스턴스 해제
            }
        };
    }, []);



    return(
      <div className={styles.container}>
          <div className={styles.datatitle}>
              <div className={styles.date}>
                  <div className={styles.name}>시행일자</div>
                  <div className={styles.value}>
                      <input type='date' className={styles.inputdate} onChange={handleDateChange} value={date} disabled={isReadOnly}  min={today} ></input>
                  </div>
              </div>
              <div className={styles.title}>
                  <div className={styles.name}>제목</div>
                  <div className={styles.value}>
                      <input type='text' className={styles.inputtitle} placeholder='제목은 필수 값입니다.' onChange={handleTitleChange} value={title} disabled={isReadOnly}></input>
                  </div>
              </div>
          </div>
          <div className={styles.editerContainer}>
              {!id && (<WebEditor editorRef={editorRef} handleContentChange={handleContentChange} height="100%" defaultContent=""/>)}
              {id && !isTempMenu && (<div ref={contentRef} ></div>)}
              {id && isTempMenu && defaultContent!==null && isContentLoaded &&(
                <WebEditor editorRef={editorRef} handleContentChange={handleContentChange} height="100%" defaultContent={defaultContent||''} />
              )}
          </div>
      </div>

    )
}

