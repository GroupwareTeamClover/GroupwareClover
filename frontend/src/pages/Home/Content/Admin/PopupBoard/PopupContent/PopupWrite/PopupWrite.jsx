import React, { useEffect, useRef, useState } from 'react';
import styles from './PopupWrite.module.css'
import { SelectPicker, Uploader } from 'rsuite';
import axios from 'axios';
import 'rsuite/SelectPicker/styles/index.css';
import 'rsuite/Uploader/styles/index.css';
import { useNavigate } from 'react-router-dom';
import { BaseUrl } from '../../../../../../../commons/config';
import { useMemberStore } from '../../../../../../../store/store';
import WebEditor from '../../../../../../../components/WebEditor/WebEditor';

export const PopupWrite = () => {

    const navi = useNavigate();

    const { sessionData } = useMemberStore();

   // 공지 기간 옵션
   const [periodType, setperiodType] = useState(''); // 'none', 'specific', 'monthly', 'weekly'
   const [specificStartDate, setSpecificStartDate] = useState('');  // specific
   const [specificEndDate, setSpecificEndDate] = useState('');      // specific
   const [monthlyDay, setMonthlyDay] =  useState(1);               // monthly
   const [weeklyDay, setWeeklyDay] = useState('MONDAY');                  // weekly

    // 현재 날짜
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD 형식으로 현재 날짜를 구하는 거!

    // 유효성 검사: 시작일이 오늘보다 이전일 경우
    useEffect(() => {
        if (specificStartDate && specificStartDate < today) {
            alert("시작일은 오늘보다 이전일 수 없습니다.");
            setSpecificStartDate(''); // 시작일을 초기화
        }
    }, [specificStartDate, today]);
    // 시작일과 종료일 유효성 검사
    useEffect(() => {
        if (specificStartDate && specificEndDate && specificEndDate < specificStartDate) {
            alert("종료일은 시작일보다 전일 수 없습니다.");
            setSpecificEndDate('');  // 종료일을 초기화
        }
    }, [specificStartDate, specificEndDate]);

    // 팝업 옵션 -- popup 컴포넌트에다가 걍 설정하는 것으로!!
    // const [activeOption, setActiveOption] = useState(''); // 'none', 'asLogin', 'hideToday', 'notAnymore'
    // 활성화 여부
    const [boardActive, setBoardActive] = useState('T');
    const handleActive = (e) => {
        setBoardActive(e.target.value);
    }

    //글제목
    const [title, setTitle] = useState('');
    const handleTitleChange = (e) => {
        setTitle(e.target.value);
    }

  
    //게시글 내용
    const editorRef = useRef();
    const [content, setContent] = useState('');
    const handleContentChange = () => {
        setContent(editorRef.current.getInstance().getHTML());
    }


    const handleSubmit = () => {
        if (title.trim() === "") {
            alert("제목을 입력해주세요!");
        } else {
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = content;
            const hasImage = tempDiv.querySelector('img') !== null;
        const textContent = tempDiv.textContent || tempDiv.innerText || '';
        const strippedContent = textContent.trim();

        if (!hasImage && strippedContent === "") {
                alert("내용을 입력해주세요!");
                return;
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
                const imageUrls = content.match(/<img[^>]+src="([^">]+)"/g)?.map(imgTag => {
                    const match = imgTag.match(/src="([^">]+)"/);
                    return match ? match[1] : null;
                });

                const payload = {
                    popTitle: title,
                    empId: sessionData.empId,
                    popContent: content,
                    periodType: periodType,
                    popIsActive: boardActive === 'T',

                    fileNames: files.map(file => file.name),
                    fileUrls: files.map(file => file.url),
                    images : imageUrls
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

                axios.post(`${BaseUrl()}/adminpopup`, payload)
                .then(resp =>{
                    if(resp.status ===200){
                        alert("공지팝업이 등록되었습니다.");
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

    const handleCancel = () => {
        const confirm = window.confirm("글 작성을 취소하시겠습니까?");
        if(confirm){  navi('/popup', {state:{type: '팝업공지글 목록'}}); }
        else{return false}
    }

     //첨부파일
     const [files, setFiles] = useState([]);
     const handleFileChange = (fileList) => {
         setFiles(fileList);
     };
     const handleUploadSuccess = (response, file) => {
        console.log("제에에ㅔㅇ발 : "+response);
         const fileUrl = response;
         console.log(fileUrl);
         // 파일 리스트에 업로드된 파일 추가
         setFiles((prev) => [...prev, { name: file.name, url: fileUrl }]);
     };
     const handleRemove = (file) => {
         // 파일 리스트에서 해당 파일 제거
         setFiles((prev) => prev.filter((f) => f.name !== file.name));
     };
     
     const formData = new FormData(); 
     formData.append('file', files); 

    return (
        <div className={styles.container}>
            <h3>{sessionData.empName} 관리자님의 팝업공지글</h3>
            <div className={styles.title}>
                <input type="text" placeholder="팝업공지 제목을 입력해 주세요 (최대 30자까지 입력 가능)"
                    name="title" className={styles.titleInput} maxLength="30" onChange={handleTitleChange} value={title} />
            </div>
            <div className={styles.editorBox}>
                <WebEditor editorRef={editorRef} handleContentChange={handleContentChange} height="500px" defaultContent="" />
            </div>
            <div className={styles.fileBox}>
                <Uploader autoUpload={true} action={`${BaseUrl()}/attachment/upload/temp`} multiple draggable
                    onSuccess={handleUploadSuccess} onRemove={handleRemove} fileList={files}>
                    <div style={{lineHeight:'100px', textAlign:'center'}}>클릭하거나 드래그하여 파일을 추가하세요</div>
                </Uploader>
            </div>
            
            {/* 공지기간 옵션 */}
            <div className={styles.activeBox}>
                <div className={styles.activeLetter}>공지기간</div>
                <div className={styles.activeRadiobox}>
                    <label>
                        <input type="radio" name="periodType" value="specific" onChange={() => setperiodType('specific')} /> 특정기간
                    </label>
                    <label>
                        <input type="radio" name="periodType" value="monthly" onChange={() => setperiodType('monthly')} /> 매월 반복
                    </label>
                    <label>
                        <input type="radio" name="periodType" value="weekly" onChange={() => setperiodType('weekly')} /> 매주 반복
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
                        <select name="weeklyDay" onChange={(e) => setWeeklyDay(e.target.value)}>
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
                    <label htmlFor="boardactive_true"><input type="radio" name="active" value="T" id="boardactive_true"  onChange={handleActive} checked={boardActive == 'T'} />활성화</label>
                    <label htmlFor="boardactive_false"><input type="radio" name="active" value="F" id="boardactive_false"  onChange={handleActive} checked={boardActive == 'F'} />비활성화</label>
                </div>
            </div>
            <div className={styles.btnBox}>
                <button className={styles.cancelBtn} onClick={handleCancel}>취소</button>
                <button className={styles.writeBtn} onClick={handleSubmit}>등록</button>
            </div>
            <div className={styles.footer}>

            </div>
        </div>
    );
}
