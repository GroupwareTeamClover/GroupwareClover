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
import { smallAlert, smallConfirmAlert } from '../../../../../../../commons/common';

export const PopupWrite = () => {

    const navi = useNavigate();

    const { sessionData } = useMemberStore();
    const {admin} = useMemberStore();
    const [uploadError, setUploadError] = useState(false);


   // 공지 기간 옵션
   const [periodType, setperiodType] = useState(''); // 'none', 'specific', 'monthly', 'weekly'
   const [specificStartDate, setSpecificStartDate] = useState('');  // specific
   const [specificEndDate, setSpecificEndDate] = useState('');      // specific
   const [monthlyDay, setMonthlyDay] =  useState(1);               // monthly
   const [weeklyDay, setWeeklyDay] = useState('MONDAY');                  // weekly

     // 컴포넌트가 언마운트될 때 인스턴스 해제
     useEffect(() => {
        return () => {
            if (editorRef.current) {
                editorRef.current.getInstance().destroy();  // 인스턴스 해제
            }
        };
    }, []);


    // 현재 날짜
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD 형식으로 현재 날짜를 구하는 거!

    // 유효성 검사: 시작일이 오늘보다 이전일 경우
    useEffect(() => {
        if (specificStartDate && specificStartDate < today) {
            smallAlert("시작일은 오늘보다 이전일 수 없습니다.");
            setSpecificStartDate(''); // 시작일을 초기화
        }
    }, [specificStartDate, today]);
    // 시작일과 종료일 유효성 검사
    useEffect(() => {
        if (specificStartDate && specificEndDate && specificEndDate < specificStartDate) {
            smallAlert("종료일은 시작일보다 전일 수 없습니다.");
            setSpecificEndDate('');  // 종료일을 초기화
        }
    }, [specificStartDate, specificEndDate]);

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
            smallAlert("제목을 입력해주세요!");
            return;
        } 
        if (uploadError) {
            smallAlert("파일 용량이 큽니다. 모든 파일이 성공적으로 업로드되었는지 확인해주세요.");
            return;
        }

        
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = content;
        const hasImage = tempDiv.querySelector('img') !== null;
        const textContent = tempDiv.textContent || tempDiv.innerText || '';
        const strippedContent = textContent.trim();

        if (!hasImage && strippedContent === "") {
            smallAlert("내용을 입력해주세요!");
                return;
            }
            if (!periodType) {
                smallAlert("공지기간을 선택해주세요!");
                return;
            }
            if (periodType === 'specific') {
                if (!specificStartDate || !specificEndDate) {
                    smallAlert("특정 기간의 시작일과 종료일을 모두 선택해주세요!");
                    return;
                }
            } else if (periodType === 'monthly') {
                if (!monthlyDay) {
                    smallAlert("매월 반복의 날짜를 선택해주세요!");
                    return;
                }
            } else if (periodType === 'weekly') {
                if (!weeklyDay) {
                    smallAlert("매주 반복의 요일을 선택해주세요!");
                    return;
                }
            }

            // 활성화 여부가 선택되었는지 확인
            if (!boardActive) {
                smallAlert("활성화 여부를 선택해주세요!");
                return;
            }

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
               

            axios.post(`${BaseUrl()}/adminpopup`, payload)
                .then(resp =>{
                    if(resp.status ===200){
                        smallAlert("공지팝업이 등록되었습니다.");
                        navi('/popup', {state:{type: '팝업공지글 목록'}}); 
                    }else {
                        smallAlert("알 수 없는 오류가 발생했습니다. 다시 시도해주세요.");
                    }
                })
                .catch(error=>{
                    console.log("서버오류: ", error);
                    smallAlert("서버에 문제 발생.")
                })

        }
    

    const handleCancel = () => {
        smallConfirmAlert("글 작성을 취소하시겠습니까?").then((result)=>{
            if(result.isConfirmed){
                navi('/popup', {state:{type: '팝업공지글 목록'}}); 
            }else{return false}
        })
        // const confirm = window.confirm("글 작성을 취소하시겠습니까?");
        // if(confirm){  navi('/popup', {state:{type: '팝업공지글 목록'}}); }
        // else{return false}
    }

      //첨부파일
      const [files, setFiles] = useState([]);
      const handleFileChange = (fileList) => {
          // setFiles(fileList.map(file => ({ name: file.name, url: file.blobUrl })));
          const newFiles = fileList.map(file => ({ name: file.name, url: file.blobUrl }));
          setFiles(prevFiles => {
              // 기존 파일 리스트에서 중복 제거 후 추가
              const existingFileNames = new Set(prevFiles.map(file => file.name));
              const filteredFiles = newFiles.filter(file => !existingFileNames.has(file.name));
              return [...prevFiles, ...filteredFiles];
          });
      };
      

      ////// 파일 갯수 제한하기 /////////
      let fileCount =0;
      const duplicateFiles = [] // 중복 파일 저장할 리스트 

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

     
       const handleUploadError = (error, file) => {
        console.error('File upload error:', error);
        smallAlert( file.name +'파일 용량이 큽니다. ');
        setUploadError(true); // 에러 상태 설정
        // 실패한 파일을 리스트에서 제거
        handleRemove(file);
    };
   
     const handleRemove = (file) => {
        setFiles(prev => {
            const updatedFiles = prev.filter(f => f.name !== file.name);
            // 파일 제거 후 업로드 오류 상태를 체크
            checkForUploadErrors(updatedFiles);
            return updatedFiles;
        });
    };
    // 업로드 오류 상태를 체크하는 함수
    const checkForUploadErrors = (updatedFiles = files) => {
        // 업로드 오류가 있는지 확인
        const hasError = updatedFiles.some(file => file.uploadError); // 파일 객체에 uploadError 속성이 있다고 가정
        setUploadError(hasError);
    };

    return ( !admin ? <div>관리자 전용임</div> :
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
                    onSuccess={handleUploadSuccess} onRemove={handleRemove} fileList={files}
                    onError={handleUploadError} 
                    >
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
