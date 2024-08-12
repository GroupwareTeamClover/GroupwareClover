import { useEffect, useRef, useState } from 'react';
import styles from './WritePost.module.css';
import { SelectPicker, Uploader } from 'rsuite';
import axios from 'axios';
import { BaseUrl } from '../../../../../commons/config';
import { useMemberStore } from '../../../../../store/store';
import 'rsuite/SelectPicker/styles/index.css';
import 'rsuite/Uploader/styles/index.css';
import WebEditor from '../../../../../components/WebEditor/WebEditor';
import { useNavigate } from 'react-router-dom';

const WritePost = () => {

    const navi = useNavigate();

    //게시판종류
    const [categories, setCategories] = useState([]);
    const [category, setCategory] = useState(0);

    const { sessionData } = useMemberStore();

    //글제목
    const maxTitleLength = 30;
    const [title, setTitle] = useState('');
    const handleTitleChange = (e) => {
        if (e.target.value.length > maxTitleLength) {
            e.preventDefault();
        } else {
            setTitle(e.target.value);
        }
    }

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
        });
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
                alert("한 글자 이상의 내용을 입력해야합니다!");
            } else {
                const imageUrls = content.match(/<img[^>]+src="([^">]+)"/g)?.map(imgTag => {
                    const match = imgTag.match(/src="([^">]+)"/);
                    return match ? match[1] : null;
                });

                axios.post(`${BaseUrl()}/board`, {
                    boardlistSeq: category,
                    title: title,
                    writer: sessionData.empId,
                    content: content,
                    fileNames: files.map(file => file.name),
                    fileUrls: files.map(file => file.url),
                    images : imageUrls
                }).then(resp => {
                    if (resp.status === 200) {
                        alert("게시글이 등록되었습니다.");
                        navi(`/community/board/${category}`);
                    }
                })
                console.log(files);
            }
        }
    }

    const handleCancel = () => {
        if (window.confirm("작성중인 글은 사라집니다. 계속하시겠습니까?")) {
            (category === 0) ? navi("/community") : navi(`/community/board/${category}`)
        }
    }

    //첨부파일
    const [files, setFiles] = useState([]);
    const handleFileChange = (fileList) => {
        setFiles(fileList);
    };
    const handleUploadSuccess = (response, file) => {
        const fileUrl = response;
        // 파일 리스트에 업로드된 파일 추가
        setFiles((prev) => [...prev, { name: file.name, url: fileUrl }]);
    };
    const handleRemove = (file) => {
        // 파일 리스트에서 해당 파일 제거
        setFiles((prev) => prev.filter((f) => f.name !== file.name));
    };
    const path = encodeURIComponent("temp");

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
                    name="title" className={styles.titleInput} maxLength="30" onChange={handleTitleChange} value={title} />
            </div>
            <div className={styles.fileBox}>
                <Uploader autoUpload={true} action={`${BaseUrl()}/attachment/upload/${path}`} multiple draggable
                    onSuccess={handleUploadSuccess} onRemove={handleRemove} fileList={files}>
                    <div style={{lineHeight:'100px', textAlign:'center'}}>클릭하거나 드래그하여 파일을 추가하세요</div>
                </Uploader>
            </div>
            <div className={styles.editorBox}>
                <WebEditor editorRef={editorRef} handleContentChange={handleContentChange} height="600px" defaultContent="" />
            </div>
            <div className={styles.btnBox}>
                <button className={styles.cancelBtn} onClick={handleCancel}>취소</button>
                <button className={styles.writeBtn} onClick={handleSubmit}>등록</button>
            </div>
        </div>
    );
}

export default WritePost;