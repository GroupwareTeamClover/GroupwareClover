import { useEffect, useRef, useState } from 'react';
import styles from './WriteBoard.module.css';
import { SelectPicker, Uploader } from 'rsuite';
import axios from 'axios';
import { BaseUrl } from '../../../../../commons/config';
import { useMemberStore } from '../../../../../store/store';
import 'rsuite/SelectPicker/styles/index.css';
import 'rsuite/Uploader/styles/index.css';
import WebEditor from '../../../../../components/WebEditor/WebEditor';

const WriteBoard = () => {

    //게시판종류
    const [categories, setCategories] = useState([]);
    const [category, setCategory] = useState(0);

    const { sessionData } = useMemberStore();

    //글제목
    const [title, setTitle] = useState('');
    const handleTitleChange = (e) => {
        setTitle(e.target.value);
    }

    //첨부파일
    const [files, setFiles] = useState([]);

    //게시글 내용
    const editorRef = useRef();
    const [content, setContent] = useState();
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

    return (
        <div className={styles.container}>
            <h3>{sessionData.empName}님의 글</h3>
            <div className={styles.categoryBox}>
                <SelectPicker
                    data={categories}
                    groupBy="boardlistType"
                    labelKey="boardlistName"
                    valueKey="boardlistSeq"
                    style={{ width: 300 }}
                    onChange={setCategory}
                    value={category}
                    placeholder="게시판 선택"
                />
            </div>
            <div className={styles.title}>
                <input type="text" placeholder="제목을 입력해 주세요 (최대 30자까지 입력 가능)"
                    name="title" className={styles.titleInput} maxlength="30" />
            </div>
            <div className={styles.fileBox}>
                <Uploader autoUpload={false} draggable multiple onChange={setFiles} fileList={files}>
                    <div style={{ height: 100, width : 1500, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <span>클릭이나 드래그로 파일 첨부</span>
                    </div>
                </Uploader>
            </div>
            <div className={styles.editorBox}>
                <WebEditor editorRef={editorRef} handleContentChange={handleContentChange} height="600px" defaultContent=""/>
            </div>
            <div className={styles.btnBox}>
                <button className={styles.cancelBtn}>취소</button>
                <button className={styles.writeBtn}>등록</button>
            </div>
        </div>
    );
}

export default WriteBoard;