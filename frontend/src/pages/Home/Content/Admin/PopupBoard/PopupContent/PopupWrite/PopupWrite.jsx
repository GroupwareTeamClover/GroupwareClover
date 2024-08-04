import { useEffect, useRef, useState } from 'react';
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

    //게시판종류
    const [categories, setCategories] = useState([]);
    const [category, setCategory] = useState(0);

    const { sessionData } = useMemberStore();

    // 공지 기간 옵션
    const [activePeriod, setActivePeriod] = useState(''); // 'none', 'specific', 'monthly', 'weekly'


    //글제목
    const [title, setTitle] = useState('');
    const handleTitleChange = (e) => {
        setTitle(e.target.value);
    }

    //첨부파일
    const [files, setFiles] = useState([]);

    //게시글 내용
    const editorRef = useRef();
    const [content, setContent] = useState('');
    const handleContentChange = () => {
        setContent(editorRef.current.getInstance().getHTML());
    }

    useEffect(() => {
        axios.get(`${BaseUrl()}/boardlist/categories/${sessionData.empSeq}`).then((resp) => {
            setCategories(resp.data.map((item) => {
                if (item.boardlistType == 'A') {
                    return { ...item, boardlistType: "전사게시판" }
                } else {
                    return { ...item, boardlistType: "그룹게시판" }
                }
            }));
        })
    }, []);

    const handleSubmit = () => {
        if (category === null) {
            alert("게시판을 선택해주세요!");
        } else if (title.trim() === "") {
            alert("제목을 입력해주세요!");
        } else {
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = content;
            const textContent = tempDiv.textContent || tempDiv.innerText || '';

            if (textContent.trim() === "") {
                alert("내용을 입력해주세요!");
            } else {
                axios.post(`${BaseUrl()}/board`, {
                    boardlistSeq: category,
                    title: title,
                    writer: sessionData.empId,
                    content: content,
                    files: files,
                    activePeriod: activePeriod
                }).then(resp => {
                    if (resp.status === 200) {
                        alert("게시글이 등록되었습니다!");
                        navi(`/community/board/${category}`)
                    }
                })
            }
        }
    }

    return (
        <div className={styles.container}>
            <h3>{sessionData.empName} 관리자님의 팝업공지글</h3>
            <div className={styles.title}>
                <input type="text" placeholder="공지 제목을 입력해 주세요 (최대 30자까지 입력 가능)"
                    name="title" className={styles.titleInput} maxlength="30" onChange={handleTitleChange} value={title} />
            </div>
            <div className={styles.editorBox}>
                <WebEditor editorRef={editorRef} handleContentChange={handleContentChange} height="500px" defaultContent="" />
            </div>
            <div className={styles.fileBox}>
                <Uploader autoUpload={false} draggable multiple onChange={setFiles} fileList={files}>
                    <div style={{ height: 100, width: 800, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <span>클릭하거나 드래그하여 파일 첨부</span>
                    </div>
                </Uploader>
            </div>
            <div className={styles.activeBox}>
                <div className={styles.activeLetter}>공지기간</div>
                <div className={styles.activeRadiobox}>
                    <label>
                        <input type="radio" name="activePeriod" value="specific" onChange={() => setActivePeriod('specific')} /> 특정기간
                    </label>
                    <label>
                        <input type="radio" name="activePeriod" value="monthly" onChange={() => setActivePeriod('monthly')} /> 매월 반복
                    </label>
                    <label>
                        <input type="radio" name="activePeriod" value="weekly" onChange={() => setActivePeriod('weekly')} /> 매주 반복
                    </label>
                </div>
            </div>
            {/* 조건부 렌더링: 공지기간에 따라 입력 폼 표시 */}
            {activePeriod === 'specific' && (
                <div className={styles.dateBox}>
                    <h4>특정 기간을 선택하세요:</h4>
                    <input type="date" name="specificStartDate" placeholder="시작일" />
                    <input type="date" name="specificEndDate" placeholder="종료일" />
                </div>
            )}
            {activePeriod === 'monthly' && (
                <div className={styles.dateBox}>
                    <h4>매월 반복:</h4>
                    <label>매월
                        <input type="number" name="monthlyDay" min="1" max="31" placeholder="일" />
                    </label>
                </div>
            )}
            {activePeriod === 'weekly' && (
                <div className={styles.dateBox}>
                    <h4>매주 반복:</h4>
                    <label>매주
                        <select name="weeklyDay">
                            <option value="sunday">일요일</option>
                            <option value="monday">월요일</option>
                            <option value="tuesday">화요일</option>
                            <option value="wednesday">수요일</option>
                            <option value="thursday">목요일</option>
                            <option value="friday">금요일</option>
                            <option value="saturday">토요일</option>
                        </select>
                    </label>
                </div>
            )}

            {/* 팝업 옵션 */}
            <div className={styles.activeBox}>
                <div className={styles.activeLetter}>옵션</div>
                <div className={styles.activeRadiobox}>
                    <label htmlFor="boardactive_true"><input type="radio" name="active" value="T" id="boardactive_true"  />로그인 할 때마다</label>
                    <label htmlFor="boardactive_true"><input type="radio" name="active" value="T" id="boardactive_true"  />'하루동안 열지않음'</label>
                    <label htmlFor="boardactive_true"><input type="radio" name="active" value="T" id="boardactive_true"  />'더 이상 열지 않음'</label>
                </div>
            </div>
            <div className={styles.activeBox}>
                <div className={styles.activeLetter}>활성화 여부</div>
                <div className={styles.activeRadiobox}>
                    <label htmlFor="boardactive_true"><input type="radio" name="active" value="T" id="boardactive_true"  />활성화</label>
                    <label htmlFor="boardactive_false"><input type="radio" name="active" value="F" id="boardactive_false"  />비활성화</label>
                </div>
            </div>
            <div className={styles.btnBox}>
                <button className={styles.cancelBtn}>취소</button>
                <button className={styles.writeBtn} onClick={handleSubmit}>등록</button>
            </div>
            <div className={styles.footer}>

            </div>
        </div>
    );
}
