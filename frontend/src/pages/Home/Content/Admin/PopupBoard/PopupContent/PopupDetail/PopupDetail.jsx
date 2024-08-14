import { useNavigate } from 'react-router-dom';
import styles from './PopupDetail.module.css';
import { useMemberStore } from '../../../../../../../store/store';
import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { BaseUrl } from '../../../../../../../commons/config';
import WebEditor from '../../../../../../../components/WebEditor/WebEditor';
import { Uploader } from 'rsuite';
import { useParams } from 'react-router-dom';
import {format} from 'date-fns';
import { confirmAlert } from '../../../../../../../commons/common';



export const PopupDetail =()=>{
    const navi = useNavigate();
    const { popSeq } = useParams();

    const { sessionData } = useMemberStore();
    const editorRef = useRef(); // Editor reference
    const contentRef = useRef(null);
    const [post, setPost] = useState({});
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [boardActive, setBoardActive] = useState('T');


   // 공지 기간 옵션
   const [periodType, setPeriodType] = useState(''); // 'none', 'specific', 'monthly', 'weekly'
   const [specificStartDate, setSpecificStartDate] = useState('');  // specific
   const [specificEndDate, setSpecificEndDate] = useState('');      // specific
   const [monthlyDay, setMonthlyDay] =  useState(1);               // monthly
   const [weeklyDay, setWeeklyDay] = useState('MONDAY');                  // weekly

    // 현재 날짜
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD 형식으로 현재 날짜를 구하는 거!


    useEffect(() => {
        axios.get(`${BaseUrl()}/adminpopup/postInfo/${popSeq}`).then(resp => {
            console.log(resp.data)
            const data = resp.data;
            setPost(data);
            if (contentRef.current) {
                contentRef.current.innerHTML = post.popContent || '';
            }

            // 받아온 데이터를 상태에 대입
            setTitle(data.popTitle || '');
            console.log(data.popContent)
            setBoardActive(data.popIsActive==='true' ? 'T' : 'F');
            
            // 공지 기간 옵션 상태 설정
            if (data.periodType === 'specific') {
                setPeriodType('specific');
                setSpecificStartDate(data.specificStartDate || '');
                setSpecificEndDate(data.specificEndDate || '');
                console.log(data.specificEndDate)
            } else if (data.periodType === 'monthly') {
                setPeriodType('monthly');
                setMonthlyDay(data.monthlyDay || 1);
                console.log(data.monthlyDay)
            } else if (data.periodType === 'weekly') {
                setPeriodType('weekly');
                setWeeklyDay(data.weeklyDay || '');
                console.log(data.weeklyDay)
            }
        
        })
    }, [popSeq]);


    // // 유효성 검사: 시작일이 오늘보다 이전일 경우
    // useEffect(() => {
    //     if (specificStartDate && specificStartDate < today) {
    //         alert("시작일은 오늘보다 이전일 수 없습니다.");
    //         setSpecificStartDate(''); // 시작일을 초기화
    //     }
    // }, [specificStartDate, today]);
    // 시작일과 종료일 유효성 검사
    useEffect(() => {
        if (specificStartDate && specificEndDate && specificEndDate < specificStartDate) {
            alert("종료일은 시작일보다 전일 수 없습니다.");
            setSpecificEndDate('');  // 종료일을 초기화
        }
    }, [specificStartDate, specificEndDate]);

    // 활성화 여부
    const handleActive = (e) => {
        setBoardActive(e.target.value);
    }

    //글제목
    const handleTitleChange = (e) => {
        setTitle(e.target.value);
    }

    //첨부파일
    const [files, setFiles] = useState([]);

    useEffect(() => {
        if (editorRef.current) {
            editorRef.current.getInstance().setHTML(post.popContent || '');
        }
    }, [post.popContent]);

    //게시글 내용
    const handleContentChange = () => {
        setContent(editorRef.current.getInstance().getHTML());
    }

    const handleCancel=()=>{
        const confirm = window.confirm("글 수정을 취소하시겠습니까?");
        if(confirm){navi(-1)}
        else{return false}
        
    }
    
    const handleSubmit = () => {
        if (title.trim() === "") {
            alert("제목을 입력해주세요!");
        } else {
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = content;
            const textContent = tempDiv.textContent || tempDiv.innerText || '';

            if (textContent.trim() === "") {
                alert("내용을 입력해주세요!");
            }
            if (!periodType) {
                alert("공지기간을 선택해주세요!");
                return;
            }
            if (periodType === 'specific') {
                if (!specificStartDate || !specificEndDate) {
                    alert("특정 기간의 시작일과 종료일을 모두 선택해주세요!");
                    return;
                }
            } else if (periodType === 'monthly') {
                if (!monthlyDay) {
                    alert("매월 반복의 날짜를 선택해주세요!");
                    return;
                }
            } else if (periodType === 'weekly') {
                if (!weeklyDay) {
                    alert("매주 반복의 요일을 선택해주세요!");
                    return;
                }
            }

            // 활성화 여부가 선택되었는지 확인
            if (!boardActive) {
                alert("활성화 여부를 선택해주세요!");
                return;
            }

            else {
                const payload = {
                    popTitle: title,
                    empId: sessionData.empId,
                    popContent: content,
                    // files: files,
                    periodType: periodType,
                    popIsActive: boardActive === 'T'
                };

                // 공지기간 데이터 추가
                if (periodType === 'specific') {
                    payload.specificStartDate = specificStartDate;
                    payload.specificEndDate = specificEndDate;
                } else if (periodType === 'monthly') {
                    payload.monthlyDay = monthlyDay;
                } else if (periodType === 'weekly') {
                    payload.weeklyDay = weeklyDay;
                }
                
                console.log("확인")
                console.log(payload);

                axios.put(`${BaseUrl()}/adminpopup/${popSeq}`, payload)
                .then(resp =>{
                    console.log(resp.data)
                    if(resp.status ===200){
                        alert("공지팝업이 수정되었습니다.");
                        navi('/popup', {state:{type: '팝업공지글 목록'}}); 
                    }else {
                        alert("알 수 없는 오류가 발생했습니다. 다시 시도해주세요.");
                    }
                })
                .catch(error=>{
                    console.log("서버오류: ", error);
                    alert("서버에 문제 발생.")
                })

            }
        }
    }

    return (
        <div className={styles.container}>
            <div className={styles.headbox}>
                <h3>{post.empName} 관리자님의 팝업공지글</h3>
                <div className={styles.popWriteDate}>
                    <div>작성일: {post.popWriteDate ? format(new Date(post.popWriteDate), 'yyyy.MM.dd HH:mm') : '날짜 없음'}</div>
                    <div> {post.popUpdatedDate ? '수정일:'+ format(new Date(post.popUpdatedDate), 'yyyy.MM.dd HH:mm'): ''}</div>
                </div>
            </div>
            <div className={styles.title}>
                <input type="text" placeholder="공지 제목을 입력해 주세요 (최대 30자까지 입력 가능)"
                    name="title" className={styles.titleInput} maxLength="30" onChange={handleTitleChange} value={title}/> 
            </div>
           
            <div className={styles.editorBox}>
                <WebEditor editorRef={editorRef} handleContentChange={handleContentChange} height="500px"  defaultContent={post.popContent}/>
            </div>
            <div className={styles.fileBox}>
                <Uploader autoUpload={false} draggable multiple onChange={setFiles} fileList={files}>
                    <div style={{ height: 100, width: 800, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <span>클릭하거나 드래그하여 파일 첨부</span>
                    </div>
                </Uploader>
            </div>
            {/* 공지기간 옵션 */}
            <div className={styles.activeBox}>
                <div className={styles.activeLetter}>공지기간</div>
                <div className={styles.activeRadiobox}>
                    <label>
                        <input type="radio" name="periodType" value="specific" onChange={() => setPeriodType('specific') } checked={periodType === 'specific'} /> 특정기간
                    </label>
                    <label>
                        <input type="radio" name="periodType" value="monthly" onChange={() => setPeriodType('monthly')} checked={periodType === 'monthly'} /> 매월 반복
                    </label>
                    <label>
                        <input type="radio" name="periodType" value="weekly" onChange={() => setPeriodType('weekly')} checked={periodType === 'weekly'} /> 매주 반복
                    </label>
                </div>
            </div>
            {/* 공지기간에 따라 입력 폼  */}
            {periodType === 'specific' && (
                <div className={styles.dateBox}>
                    <h4>특정 기간을 선택하세요:</h4>
                    <input type="date" name="specificStartDate" placeholder="시작일"  value={specificStartDate} onChange={(e) => setSpecificStartDate(e.target.value) }/>
                    <input type="date" name="specificEndDate" placeholder="종료일"  value={specificEndDate} onChange={(e) => setSpecificEndDate(e.target.value)}/>
                </div>
            )}
            {periodType === 'monthly' && (
                <div className={styles.dateBox}>
                    <h4>매월 반복:</h4>
                    <label>매월
                        <select name="monthlyDay" value={monthlyDay} onChange={(e) => setMonthlyDay(e.target.value)}>
                            {[...Array(31).keys()].map(i => (
                                <option key={i + 1} value={i + 1}>{i + 1}</option>
                            ))}
                        </select>
                    </label>
                </div>
            )}
            {periodType === 'weekly' && (
                <div className={styles.dateBox}>
                    <h4>매주 반복:</h4>
                    <label>매주
                        <select name="weeklyDay" value={weeklyDay} onChange={(e) => setWeeklyDay(e.target.value)}>
                            <option value="MONDAY">월요일</option>
                            <option value="TUESDAY">화요일</option>
                            <option value="WEDNESDAY">수요일</option>
                            <option value="THURSDAY">목요일</option>
                            <option value="FRIDAY">금요일</option>
                            <option value="SATURDAY">토요일</option>
                            <option value="SUNDAY">일요일</option>
                        </select>
                    </label>
                </div>
            )}

            {/* 사용여부 */}
            <div className={styles.activeBox}>
                <div className={styles.activeLetter}>활성화 여부</div>
                <div className={styles.activeRadiobox}>
                    <label ><input type="radio" name="active" value="T" id="boardactive_true"  onChange={handleActive} checked={boardActive === 'T'} />활성화</label>
                    <label ><input type="radio" name="active" value="F" id="boardactive_false"  onChange={handleActive} checked={boardActive === 'F'} />비활성화</label>
                </div>
            </div>
            <div className={styles.btnBox}>
                <button className={styles.cancelBtn} 
                // onClick={() => {  navi(-1)}}
                onClick={handleCancel}
                >취소</button>
                <button className={styles.writeBtn} onClick={handleSubmit}>수정</button>
            </div>
            <div className={styles.footer}>

            </div>
        </div>
    );

}