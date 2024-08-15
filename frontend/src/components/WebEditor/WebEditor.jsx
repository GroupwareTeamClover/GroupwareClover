import { Editor } from '@toast-ui/react-editor';
import '@toast-ui/editor/dist/toastui-editor.css';
import colorSyntax from '@toast-ui/editor-plugin-color-syntax';
import 'tui-color-picker/dist/tui-color-picker.css';
import '@toast-ui/editor-plugin-color-syntax/dist/toastui-editor-plugin-color-syntax.css';
import '@toast-ui/editor/dist/i18n/ko-kr';
import axios from 'axios';
import { BaseUrl } from '../../commons/config';
import { useEffect } from 'react';

const WebEditor = ({ editorRef, handleContentChange, height, defaultContent }) => {
    const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB 제한

    const onUploadImage = async (blob, callback) => {
        if (blob.size > MAX_IMAGE_SIZE) {
            alert('이미지 크기가 너무 큽니다. 최대 5MB까지 업로드할 수 있습니다.');
            return false; // 업로드 중단
        }

        try {
            const url = await uploadImage(blob);
            callback(url, 'alt text');
        } catch (error) {
            console.error('이미지 업로드 실패:', error);
            alert('이미지 업로드에 실패했습니다. 다시 시도해 주세요.');
        }
        return false; // false를 반환하여 Toast UI Editor의 기본 동작 방지
    };

    const uploadImage = (blob) => {
        const formData = new FormData();
        const path = encodeURIComponent("temp");
        formData.append('file', blob);
        return axios.post(`${BaseUrl()}/attachment/upload/${path}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        }).then(resp => {
            return resp.data;
        })
    }

    // 웹에디터 빨간줄 제거
    useEffect(() => {
        const editorInstance = editorRef.current.getInstance();
        const editorEl = editorInstance.getEditorElements().mdEditor; 
        const wysiwygEl = editorInstance.getEditorElements().wwEditor;

        editorEl.spellcheck = false;
        wysiwygEl.spellcheck = false;
      }, []);

    return (
        <Editor
            initialValue={defaultContent || ""}
            placeholder="글내용을 입력해주세요"
            previewStyle="tab"
            height={height}
            initialEditType="wysiwyg"
            useCommandShortcut={false}
            hideModeSwitch={true}
            plugins={[colorSyntax]}
            language="ko-KR"
            hooks={{
                addImageBlobHook: onUploadImage
            }}
            // 상위 Component에서 useRef 추가하여 인자로 전달할것
            ref={editorRef}
            // 상위 Component에서 content onChange 함수 추가하여 인자로 전달할것
            onChange={handleContentChange}
        />
    );
}

// 상위 컴포넌트에서 EditorBox 호출 및 인자 전달 (ref, handleContentChange, height)
// <WebEditor editorRef={editorRef} handleContentChange={handleContentChange} height="600px" defaultContent=""/>

// <ref> - 에디터 객체 접근용 useRef
// const editorRef = useRef();

// <handleContentChange> - 에디터 내용 변경 시 호출할 onChange함수
// const [content, setContent] = useState();
// const handleContentChange = () => {
//     setContent(editorRef.current.getInstance().getHTML());
// }

// <height> - 에디터 높이 설정

// <defaultContent> - 글 수정 시 기존 내용을 넘기는 인자. 글 작성 시에는 빈 값을 넘김.


// <기타 추가 정보>

// 에디터 전체 설정값 가져오기
// editorRef.current().getInstatnce()

// 에디터 글 가져오기
// editorRef.current.getInstance().getHTML()

export default WebEditor;