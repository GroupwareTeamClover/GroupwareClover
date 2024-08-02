import styles from './Business.module.css'
import { BsChevronDoubleLeft } from 'react-icons/bs';
import { useState, useEffect, useRef } from 'react';
import { useMemberStore } from '../../../../../../../store/store';
import  WebEditor  from '../../../../../../../components/WebEditor/WebEditor';
import axios from 'axios';
import { BaseUrl } from '../../../../../../../commons/config';

export const Business =({type, docinfo, empinfo, isInsert})=>{
   console.log(empinfo);
    // lineinfo의 apvchoice 배열을 순회하며 객체 정보 출력
    // lineinfo.apvchoice?.map((line, index) => {
    //     console.log(line.department);
    //     console.log(line.name);
    //     console.log(line.role);
    // });
    const editorRef = useRef();

    //날짜, 제목
    const [date, setDate]=useState();
    const [title, setTitle]=useState();

    const handleDateChange=(e)=>{
        setDate(e.target.value);
    }

    const handleTitleChange=(e)=>{
        setTitle(e.target.value)
    }

    // <handleContentChange> - 에디터 내용 변경 시 호출할 onChange함수
    const [content, setContent] = useState();
    const handleContentChange = () => {
        setContent(editorRef.current.getInstance().getHTML());
    }

    //dto로 쉽게 만들 수 있도록 만들자
    const [business, setBusiness]=useState({});
    //합치기
    useEffect(()=>{
        setBusiness()
    },[date, title, content])
   

    //insert
    useEffect(()=>{
        if(isInsert){
            axios.post(`${BaseUrl}/approval/document/business`,business).then((rest)=>{

            }).catch((err)=>{
                alert("요청 실패")
            })
        }

    }, [isInsert])

    



    return(
        <div className={styles.container}>
            <div className={styles.datatitle}>
                <div className={styles.date}>
                    <div className={styles.name}>시행일자</div>
                    <div className={styles.value}>
                        <input type='date' className={styles.inputdate} onChange={handleDateChange}></input>
                    </div>
                </div>
                <div className={styles.title}>
                    <div className={styles.name}>제목</div>
                        <div className={styles.value}>
                            <input type='text' className={styles.inputtitle} placeholder='제목을 입력하세요.' onChange={handleTitleChange}></input>
                        </div>
                    </div>
                </div>
            <div className={styles.editerContainer}>
                <WebEditor editorRef={editorRef} handleContentChange={handleContentChange} height="100%" defaultContent=""/>
            </div>                     
        </div>
    
    )
}

