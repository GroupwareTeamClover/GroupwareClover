import { useNavigate, useParams } from 'react-router-dom';
import styles from './DetailBoard.module.css';
import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { BaseUrl } from '../../../../../commons/config';
import { IconContext } from 'react-icons';
import { GoStar, GoStarFill } from 'react-icons/go';
import { LuEye } from 'react-icons/lu';
import { format } from 'date-fns/format';
import { useMemberStore } from '../../../../../store/store';
import Comment from './Comment/Comment';
import 'rsuite/Popover/styles/index.css';
import { Button } from 'rsuite';

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
    const [viewCount, setViewCount] = useState(0);
    const [isImportant, setIsImportant] = useState();
    const [commentCount, setCommentCount] = useState(0);

    const navi = useNavigate();
    //TOP 버튼 클릭 시 스크롤 맨 위로 이동
    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        })
    }

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
            (resp.data.boardlistName !== undefined) ? setBoardlistName(resp.data.boardlistName) : setBoardlistName("중요 게시물");
        });
        axios.get(`${BaseUrl()}/board/postInfo/${boardSeq}`).then(resp => {
            setPost(prev => ({ ...prev, ...resp.data }));
            setWriteDate(format(new Date(Date.parse(resp.data.boardWriteDate)), 'yyyy.MM.dd HH:mm'));
            contentRef.current.innerHTML = resp.data.boardContent;
            setViewCount(resp.data.boardViewCount);
        }).then(() => {
            //해당 글번호가 세션에 없으면 조회수 증가 후 세션에 추가
            const viewPage = JSON.parse(sessionStorage.getItem('viewPage')) || [];
            if (!viewPage.includes(boardSeq)) {
                axios.put(`${BaseUrl()}/board/viewCount`, null, { params: { boardSeq: boardSeq } }).then(resp => {
                    if (resp.status === 200) {
                        viewPage.push(boardSeq);
                        sessionStorage.setItem('viewPage', JSON.stringify(viewPage));
                        setViewCount(prev => prev + 1);
                    }
                })
            }
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
        });
        axios.get(`${BaseUrl()}/board/status/important/${sessionData.empSeq}/${boardSeq}`).then(resp => {
            (resp.data) ? setIsImportant(true) : setIsImportant(false);
        })
    }, [boardSeq, boardlistSeq, sessionData.empId, sessionData.empSeq]);

    //첨부파일 조회 및 다운로드
    const [isFileBoxOpen, setIsFileBoxOpen] = useState(false);
    const handleFileBox = () => {
        setIsFileBoxOpen(prev => !prev);
    }

    //게시글 삭제
    const handleDelete = () => {
        if (window.confirm("정말로 이 글을 삭제하시겠습니까?")) {
            axios.delete(`${BaseUrl()}/board/post`, { params: { boardlistSeq: boardlistSeq, boardSeq: boardSeq } }).then(resp => {
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
            setCommentCount(e.target.value.length);
        }
    }
    //댓글 작성
    const handleWriteComment = () => {
        if (comment.trim() === '') {
            alert("공백, 줄바꿈 제외 최소 한 글자 이상을 입력해야 합니다.");
        } else {
            axios.post(`${BaseUrl()}/comment`, {
                writer: sessionWriter,
                content: comment,
                boardSeq: post.boardSeq
            }).then(resp => {
                if (resp.status === 200) {
                    setComment('');
                    setCommentCount(0);
                    setComments(prev => [...prev, resp.data]);
                    setCountComments(prev => prev + 1);
                    setScrollMove(prev => prev + 1);
                }
            })
        }
    }

    //파일 다운로드
    const handleDownload = async (fileUrl, fileName) => {
        try {
            const response = await axios.get(`${BaseUrl()}/attachment/download`, {
                params: { fileUrl: fileUrl },
                responseType: 'blob',
                headers: {
                    'Content-Type': 'application/octet-stream'
                }
            });

            const blob = new Blob([response.data], { type: 'application/octet-stream' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = fileName;
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('다운로드 중 에러 발생.');
        }
    }

    // 중요게시글 추가
    const handleAddImportant = async () => {
        await axios.post(`${BaseUrl()}/board/important`, {
            empSeq: sessionData.empSeq,
            boardSeq: boardSeq
        }).then(resp => { resp.status === 200 && alert("중요 게시글에 추가되었습니다!"); setIsImportant(true); }
        )
    }
    // 중요게시글 삭제
    const handleRemoveImportant = async () => {
        await axios.delete(`${BaseUrl()}/board/important`, { params: { empSeq: sessionData.empSeq, boardSeq: boardSeq } }).then(resp => { resp.status === 200 && alert("중요 게시글에서 삭제되었습니다!"); setIsImportant(false); }
        )
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>{boardlistName}</div>
            <div className={styles.content}>
                <div className={styles.titleBox}>
                    {isImportant ?
                        <div className={styles.star}>
                            <IconContext.Provider value={{ color: "#000000", className: styles.starFillIcon }}>
                                <GoStarFill size="20" onClick={handleRemoveImportant} />
                            </IconContext.Provider>
                        </div> :
                        <div className={styles.star}>
                            <IconContext.Provider value={{ color: "#000000", className: styles.starIcon }}>
                                <GoStar size="20" onClick={handleAddImportant} />
                            </IconContext.Provider>
                        </div>
                    }
                    <p className={styles.title}>{post.boardTitle}</p>
                </div>
                <div className={styles.infoBox}>
                    <div className={styles.name}>{post.boardWriter}</div>
                    <div className={styles.infoRightBox}>
                        <div className={styles.date}>
                            {writeDate}
                        </div>
                        <div className={styles.view}><LuEye />&nbsp;{viewCount}</div>
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
                                <p className={styles.eachFile} key={i} onClick={() => { handleDownload(file.attachmentSysname, file.attachmentOriname) }}>{i + 1}. {file.attachmentOriname}</p>
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
                        {(post.boardWriter.includes(sessionData.empName) || admin) &&
                            <>
                                <button className={styles.corBtn} onClick={() => { navi("/community/modifyPost", { state: { ...post } }) }}>수정</button>
                                <button className={styles.delBtn} onClick={handleDelete}>삭제</button>
                            </>
                        }
                    </div>
                </div>
            </div>
            <div className={styles.commentBox}>
                <div className={styles.writeCommentBox}>
                    <div className={styles.commentWriter}>{sessionWriter}</div>
                    <div className={styles.commentContentBox}>
                        <div className={styles.innerCommentContentBox}>
                            <textarea
                                placeholder={`최대 ${maxCommentLength}자까지 작성 가능하며 공백, 줄바꿈 제외 최소 한 글자 이상 입력해야 합니다.`}
                                className={styles.commentContent} onChange={handleCommentChange} value={comment} maxLength={maxCommentLength}></textarea>
                            <Button color="cyan" appearance="primary" onClick={handleWriteComment} className={styles.writeCommentButton}>
                                등록
                            </Button>
                        </div>
                        <div className={styles.commentCountBox}>{commentCount}/1000자</div>
                    </div>
                </div>
                <div className={styles.commentLetter}>댓글 ({countComments})</div>
                <div className={styles.commentList}>
                    {comments.map((comment, i) =>
                        <Comment key={i} dto={comment} sessionWriter={sessionWriter} reples={reples.filter(reple => reple.boardCommentReplySeq === comment.boardCommentSeq)}
                            setCountComments={setCountComments} admin={admin} setComments={setComments} empName={sessionData.empName} />
                    )}
                </div>
            </div>
            <div appearance="link" onClick={scrollToTop} className={styles.topButton}>▲ 맨위로</div>
            <div ref={commentsEndRef} />
        </div>
    );
}

export default DetilBoard;