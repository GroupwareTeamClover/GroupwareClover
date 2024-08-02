import { Editor } from '@toast-ui/react-editor';
import '@toast-ui/editor/dist/toastui-editor.css';
import colorSyntax from '@toast-ui/editor-plugin-color-syntax';
import 'tui-color-picker/dist/tui-color-picker.css';
import '@toast-ui/editor-plugin-color-syntax/dist/toastui-editor-plugin-color-syntax.css';
import '@toast-ui/editor/dist/i18n/ko-kr';

const WebEditor = ({ editorRef, handleContentChange, height, defaultContent }) => {
    return (
        <Editor
            initialValue = {defaultContent || ""}
            placeholder="글내용을 입력해주세요"
            previewStyle="tab"
            height={height}
            initialEditType="wysiwyg"
            useCommandShortcut={false}
            hideModeSwitch={true}
            plugins={[colorSyntax]}
            language="ko-KR"
            // 상위 Component에서 useRef 추가하여 인자로 전달할것
            ref={editorRef}
            // 상위 Component에서 content onChange 함수 추가하여 인자로 전달할것
            onChange={handleContentChange}
        />
    );
}

// 상위 컴포넌트에서 EditorBox 호출 및 인자 전달 (ref, handleContentChange, height)

// <ref> - 에디터 객체 접근용 useRef
// const editorRef = useRef();

// <handleContentChange> - 에디터 내용 변경 시 호출할 onChange함수
// const [content, setContent] = useState();
// const handleContentChange = () => {
//     setContent(editorRef.current.getInstance().getHTML());
// }

// <height> - 에디터 높이 설정

// <defaultContent> - 글 수정 시 기존 내용을 넘기는 인자. 글 작성 시에는 빈 값을 넘김.

// <WebEditor editorRef={editorRef} handleContentChange={handleContentChange} height="600px" defaultContent=""/>


// <기타 추가 정보>

// 에디터 전체 설정값 가져오기
// editorRef.current().getInstatnce()

// 에디터 글 가져오기
// editorRef.current.getInstance().getHTML()



export default WebEditor;