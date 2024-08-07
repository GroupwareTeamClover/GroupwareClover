import { useNavigate, useParams } from 'react-router-dom';
import styles from './DetailBoard.module.css';
import React, { forwardRef, useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { BaseUrl } from '../../../../../commons/config';
import { IconContext } from 'react-icons';
import { GoStar } from 'react-icons/go';
import { LuEye } from 'react-icons/lu';
import { format } from 'date-fns/format';
import { useMemberStore } from '../../../../../store/store';
import Comment from './Comment/Comment';
import { Button, Loader, Popover, Whisper } from 'rsuite';
import 'rsuite/Popover/styles/index.css';

const DetilBoard = () => {
    const { sessionData, admin } = useMemberStore();
    const [sessionWriter, setSessionWriter] = useState();
    const { boardlistSeq, boardSeq } = useParams();
    const [boardlistName, setBoardlistName] = useState('');
    const [post, setPost] = useState({ boardSeq: 0, boardlistSeq: 0, boardTitle: '', boardWriter: '', boardContent: '', boardWriteDate: '', boardViewCount: 0 });
    const [writeDate, setWriteDate] = useState();
    const contentRef = useRef(null);
    const [comments, setComments] = useState([]);
    const [reples, setReples] = useState([]);
    const [scrollMove, setScrollMove] = useState(0);
    const [countComments, setCountComments] = useState(0);
    const [files, setFiles] = useState([]);

    const navi = useNavigate();

    //스크롤 변화 시 스크롤 맨 아래로 이동
    const commentsEndRef = useRef(null);
    const scrollToBottom = () => {
        commentsEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [scrollMove])

    useEffect(() => {
        axios.get(`${BaseUrl()}/boardlist/boardInfo`, { params: { boardlistSeq: boardlistSeq } }).then(resp => {
            setBoardlistName(resp.data.boardlistName);
        });
        axios.get(`${BaseUrl()}/board/postInfo/${boardSeq}`).then(resp => {
            setPost(prev => ({ ...prev, ...resp.data }));
            setWriteDate(format(new Date(Date.parse(resp.data.boardWriteDate)), 'yyyy.MM.dd HH:mm'));
            contentRef.current.innerHTML = resp.data.boardContent;
        });
        axios.get(`${BaseUrl()}/board/writerInfo/${sessionData.empId}`).then(resp => {
            setSessionWriter(resp.data);
        });
        axios.get(`${BaseUrl()}/comment/${boardSeq}`).then(resp => {
            setComments(resp.data.filter(dto => dto.boardCommentReplySeq === 0));
            setReples(resp.data.filter(dto => dto.boardCommentReplySeq !== 0));
            setCountComments(resp.data.length);
        });
        axios.get(`${BaseUrl()}/attachment/${'board'}/${boardSeq}`).then(resp => {
            setFiles(resp.data);
        })
    }, [boardSeq, boardlistSeq, sessionData.empId]);

    //첨부파일 조회 및 다운로드
    const [isFileBoxOpen, setIsFileBoxOpen] = useState(false);
    const handleFileBox = () => {
        setIsFileBoxOpen(prev => !prev);
    }

    //게시글 삭제
    const handleDelete = () => {
        if (window.confirm("정말로 이 글을 삭제하시겠습니까?")) {
            axios.delete(`${BaseUrl()}/board/${boardSeq}`).then(resp => {
                if (resp.status === 200) {
                    navi(`/community/board/${boardlistSeq}`);
                } else {
                    alert("오류가 발생했습니다. 지속 시 관리자에게 문의하세요.");
                }
            })
        }
    }

    //댓글
    const maxCommentLength = 1000;
    const [comment, setComment] = useState('');
    const handleCommentChange = (e) => {
        if (e.target.value.length > maxCommentLength) {
            e.preventDefault();
        } else {
            setComment(e.target.value);
        }
    }
    //댓글 작성
    const handleWriteComment = () => {
        if (comment.trim() === '') {
            alert("댓글 내용을 입력하세요!");
        } else {
            axios.post(`${BaseUrl()}/comment`, {
                writer: sessionWriter,
                content: comment,
                boardSeq: post.boardSeq
            }).then(resp => {
                if (resp.status === 200) {
                    setComment('');
                    setComments(prev => [...prev, resp.data]);
                    setCountComments(prev => prev + 1);
                    setScrollMove(prev => prev + 1);
                }
            })
        }
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>{boardlistName}</div>
            <div className={styles.content}>
                <div className={styles.titleBox}>
                    <div className={styles.star}>
                        <IconContext.Provider value={{ color: "#000000", className: styles.starIcon }}>
                            <GoStar size="20" />
                        </IconContext.Provider>
                    </div>
                    <p className={styles.title}>{post.boardTitle}</p>
                </div>
                <div className={styles.infoBox}>
                    <div className={styles.name}>{post.boardWriter}</div>
                    <div className={styles.infoRightBox}>
                        <div className={styles.date}>
                            {writeDate}
                        </div>
                        <div className={styles.view}><LuEye />&nbsp;{post.boardViewCount}</div>
                    </div>
                </div>
                {files.length > 0 &&
                    ((isFileBoxOpen) ? <div className={styles.fileHeader}>
                        <div className={styles.fileLetter} onClick={handleFileBox}>첨부파일 ({files.length}) ▲</div>
                    </div> : <div className={styles.fileHeader}>
                        <div className={styles.fileLetter} onClick={handleFileBox}>첨부파일 ({files.length}) ▼</div>
                    </div>)
                }
                <div className={styles.fileBox}>
                    {isFileBoxOpen && files.map((file, i) => {
                        return (
                            <>
                                <p className={styles.eachFile} key={i} onClick={()=>{
                                    axios.get(`${BaseUrl()}/attachment/download`, { params : {fileUrl:file.attachmentSysname}})
                                }}>{i + 1}. {file.attachmentOriname}</p>
                                <br></br>
                            </>
                        );
                    })
                    }
                </div>
                <div className={styles.viewCont} ref={contentRef}></div>
                <div className={styles.buttonBox}>
                    <div className={styles.leftBox}>
                        <button className={styles.goListBtn} onClick={() => { navi(`/community/board/${boardlistSeq}`) }}>목록</button>
                    </div>
                    <div className={styles.rightBox}>
                        <button className={styles.corBtn}>수정</button>
                        <button className={styles.delBtn} onClick={handleDelete}>삭제</button>
                    </div>
                </div>
            </div>
            <div className={styles.commentBox}>
                <div className={styles.writeCommentBox}>
                    <div className={styles.commentWriter}>{sessionWriter}</div>
                    <div className={styles.commentContentBox}>
                        <textarea
                            placeholder={`최대 ${maxCommentLength}자까지 작성 가능합니다`}
                            className={styles.commentContent} onChange={handleCommentChange} value={comment} maxLength={maxCommentLength}></textarea>
                        <button type="button" className={styles.writeCommentButton} onClick={handleWriteComment}>등록</button>
                    </div>
                </div>
                <div className={styles.commentLetter}>댓글 ({countComments})</div>
                <div className={styles.commentList}>
                    {comments.map((comment, i) =>
                        <Comment key={i} dto={comment} sessionWriter={sessionWriter} reples={reples.filter(reple => reple.boardCommentReplySeq === comment.boardCommentSeq)}
                            setCountComments={setCountComments} admin={admin} setComments={setComments} />
                    )}
                </div>
            </div>
            <div ref={commentsEndRef} />
        </div>
    );
}

export default DetilBoard;