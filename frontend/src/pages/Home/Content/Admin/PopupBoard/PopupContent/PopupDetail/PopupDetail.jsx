import { useLocation, useNavigate } from 'react-router-dom';
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


export const PopupDetail = () => {
    const navi = useNavigate();
    const { popSeq } = useParams();
    const { sessionData } = useMemberStore();
    const editorRef = useRef(); // Editor reference
    const [post, setPost] = useState({});
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [boardActive, setBoardActive] = useState('T');
    const [periodType, setPeriodType] = useState('');
    const [specificStartDate, setSpecificStartDate] = useState('');
    const [specificEndDate, setSpecificEndDate] = useState('');
    const [monthlyDay, setMonthlyDay] = useState(1);
    const [weeklyDay, setWeeklyDay] = useState('MONDAY');
    const [files, setFiles] = useState([]);
    const [originFiles, setOriginFiles] = useState([]);
    const [originImageUrls, setOriginImageUrls] = useState([]);
    const [addFileUrls, setAddFileUrls] = useState([]);


     // 활성화 여부
     const handleActive = (e) => {
        setBoardActive(e.target.value);
    }

    useEffect(() => {
        axios.get(`${BaseUrl()}/adminpopup/postInfo/${popSeq}`).then(resp => {
            const data = resp.data;
            setPost(data);
            setTitle(data.popTitle || '');
            setBoardActive(data.popIsActive === 'true' ? 'T' : 'F');

            if (data.periodType === 'specific') {
                setPeriodType('specific');
                setSpecificStartDate(data.specificStartDate || '');
                setSpecificEndDate(data.specificEndDate || '');
            } else if (data.periodType === 'monthly') {
                setPeriodType('monthly');
                setMonthlyDay(data.monthlyDay || 1);
            } else if (data.periodType === 'weekly') {
                setPeriodType('weekly');
                setWeeklyDay(data.weeklyDay || '');
            }

            editorRef.current.getInstance().setHTML(data.popContent || '');
            setOriginImageUrls(data.popContent?.match(/<img[^>]+src="([^">]+)"/g)?.map(imgTag => {
                const match = imgTag.match(/src="([^">]+)"/);
                return match ? match[1] : null;
            }));

            axios.get(`${BaseUrl()}/attachment/${'popup'}/${popSeq}`).then(resp => {
                const fileData = resp.data.map(file => ({ name: file.attachmentOriname, url: file.attachmentSysname }));
                setOriginFiles(fileData);
                setFiles(fileData);
            });
        });
    }, [popSeq]);

    const handleTitleChange = (e) => setTitle(e.target.value);

    const handleContentChange = () => setContent(editorRef.current.getInstance().getHTML());


    const handleUploadSuccess = (response, file) => {
        const fileUrl = response;
        const newFile = { name: file.name, url: fileUrl };
        // 중복 파일 제거
        setFiles(prev => prev.filter(f => f.name !== file.name));
        
        // 파일 추가
        setFiles(prev => [...prev, newFile]);
        setAddFileUrls(prev => [...prev, fileUrl]); // addFileUrls 상태 업데이트
    };
    const handleUploadError = (error, file) => {
        console.error('File upload error:', error);
        alert('파일 용량이 큽니다. 파일 크기를 확인해주세요.');
        // setUploadError(true); // 에러 상태 설정
        // 실패한 파일을 리스트에서 제거
        handleRemove(file);
    };

    const handleRemove = (file) => {
        setFiles(prev => prev.filter(f => f.name !== file.name));
        setAddFileUrls(prev => prev.filter(url => url !== file.url)); // remove URL from addFileUrls
    };
    const handleCancel = () => {
        if (window.confirm("글 수정을 취소하시겠습니까?")) {
            navi(-1);
        }
    };

    const handleSubmit = () => {
        if (title.trim() === "") {
            alert("제목을 입력해주세요!");
            return;
        }

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

        if (periodType === 'specific' && (!specificStartDate || !specificEndDate)) {
            alert("특정 기간의 시작일과 종료일을 모두 선택해주세요!");
            return;
        }

        if (periodType === 'monthly' && !monthlyDay) {
            alert("매월 반복의 날짜를 선택해주세요!");
            return;
        }

        if (periodType === 'weekly' && !weeklyDay) {
            alert("매주 반복의 요일을 선택해주세요!");
            return;
        }

        if (!boardActive) {
            alert("활성화 여부를 선택해주세요!");
            return;
        }

        const deleteFiles = originFiles?.filter(file => !files.some(newFile => newFile.name === file.name));
        const addFiles = files?.filter(file => !originFiles.some(originfile => originfile.name === file.name));

        const newImageUrls = content.match(/<img[^>]+src="([^">]+)"/g)?.map(imgTag => {
            const match = imgTag.match(/src="([^">]+)"/);
            return match ? match[1] : null;
        }) || [];

        // const deleteImageUrls = originImageUrls?.filter(imageUrl =>  newImageUrls && !newImageUrls.includes(imageUrl));
        // const addImageUrls = newImageUrls?.filter(imageUrl => !originImageUrls.includes(imageUrl));

        console.log("originImageUrls:", originImageUrls);
        console.log("newImageUrls:", newImageUrls);

        const deleteImageUrls = originImageUrls?.filter(imageUrl => {
            console.log("Checking imageUrl in originImageUrls:", imageUrl);
            return newImageUrls && !newImageUrls.includes(imageUrl);
        }) || [];

        const addImageUrls = newImageUrls.filter(imageUrl => {
            console.log("Checking imageUrl in newImageUrls:", imageUrl);
            return !originImageUrls?.includes(imageUrl);
        }) || [];

        const payload = {
            popTitle: title,
            empId: sessionData.empId,
            popContent: content,
            periodType: periodType,
            popIsActive: boardActive === 'T',
            deleteFileUrls: deleteFiles.map(file => file.url),
            addFileNames: addFiles.map(file => file.name),
            addFileUrls: addFiles.map(file => file.url),
            deleteImageUrls: deleteImageUrls,
            addImageUrls: addImageUrls
        };

        if (periodType === 'specific') {
            payload.specificStartDate = specificStartDate;
            payload.specificEndDate = specificEndDate;
        } else if (periodType === 'monthly') {
            payload.monthlyDay =  monthlyDay.toString();
        } else if (periodType === 'weekly') {
            payload.weeklyDay = weeklyDay;
        }

        axios.put(`${BaseUrl()}/adminpopup/${popSeq}`, payload)
            .then(resp => {
                if (resp.status === 200) {
                    alert("공지팝업이 수정되었습니다.");
                    navi('/popup', { state: { type: '팝업공지글 목록' } });
                } else {
                    alert("알 수 없는 오류가 발생했습니다. 다시 시도해주세요.");
                }
            })
            .catch(error => {
                console.log("서버오류: ", error.response);
                if (error.response) {
                    console.log("응답 상태 코드: ", error.response.status);
                    console.log("응답 데이터: ", error.response.data);
                }
                alert("서버에 문제 발생.");
            });
    };

    const path = encodeURIComponent("temp");

    return (
        <div className={styles.container}>
            <div className={styles.headbox}>
                <h3>{post.empName} 관리자님의 팝업공지글</h3>
                <div className={styles.popWriteDate}>
                    <div>작성일: {post.popWriteDate ? format(new Date(post.popWriteDate), 'yyyy.MM.dd HH:mm') : '날짜 없음'}</div>
                    <div>{post.popUpdatedDate ? '수정일: ' + format(new Date(post.popUpdatedDate), 'yyyy.MM.dd HH:mm') : ''}</div>
                </div>
            </div>
            <div className={styles.title}>
                <input type="text" placeholder="공지 제목을 입력해 주세요 (최대 30자까지 입력 가능)"
                    name="title" className={styles.titleInput} maxLength="30" onChange={handleTitleChange} value={title} />
            </div>
            <div className={styles.editorBox}>
                <WebEditor editorRef={editorRef} handleContentChange={handleContentChange} height="500px" defaultContent={post.popContent} />
            </div>
            <div className={styles.fileBox}>
                <Uploader autoUpload={true} action={`${BaseUrl()}/attachment/upload/${path}`} multiple draggable
                    onSuccess={handleUploadSuccess} onRemove={handleRemove} fileList={files}
                    onError={handleUploadError}>
                    <div style={{lineHeight:'100px', textAlign:'center'}}>클릭하거나 드래그하여 파일을 추가하세요</div>
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