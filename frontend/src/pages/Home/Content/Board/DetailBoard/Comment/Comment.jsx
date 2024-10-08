import { useEffect, useRef, useState } from 'react';
import styles from './Comment.module.css';
import Button from 'rsuite/Button';
import 'rsuite/Button/styles/index.css';
import { format } from 'date-fns';
import Reply from './Reply/Reply';
import axios from 'axios';
import { BaseUrl } from '../../../../../../commons/config';

const Comment = ({ sessionWriter, dto, reples, setCountComments, admin, setComments, empName }) => {
    const [list, setList] = useState(reples);
    const replyWriteInput = useRef(null);
    const [replyCount, setReplyCount] = useState(0);

    //답글작성창표시
    const [openWriteReplyBox, setOpenWriteReplyBox] = useState(false);
    const handleOpenwriteReplyBox = () => {
        setOpenWriteReplyBox(prev => !prev);
    }
    useEffect(() => {
        if (openWriteReplyBox && replyWriteInput.current) {
            replyWriteInput.current.focus();
        }
    }, [openWriteReplyBox]);

    //답글
    const maxReplyLength = 1000;
    const [reply, setReply] = useState('');
    const handleReplyChange = (e) => {
        if (e.target.value.length > maxReplyLength) {
            e.preventDefault();
        } else {
            setReply(e.target.value);
            setReplyCount(e.target.value.length);
        }
    }

    //답글 작성
    const handleWriteReply = () => {
        if (reply.trim() === '') {
            alert("공백, 줄바꿈 제외 최소 한 글자 이상을 입력해야 합니다.");
        } else {
            axios.post(`${BaseUrl()}/comment/reply`, {
                writer: sessionWriter,
                content: reply,
                boardSeq: dto.boardSeq,
                commentSeq: dto.boardCommentSeq
            }).then(resp => {
                if (resp.status === 200) {
                    setReply('');
                    setReplyCount(0);
                    setList(prev => [...prev, resp.data]);
                    setCountComments(prev => prev + 1);
                    setOpenWriteReplyBox(false);
                }
            })
        }
    }

    //댓글 수정
    const [isModify, setIsmodify] = useState(false);
    const modifyInput = useRef(null);
    const [charCount, setCharCount] = useState(0);

    useEffect(() => {
        if (isModify && modifyInput.current) {
            modifyInput.current.style.height = 'auto';
            modifyInput.current.style.height = `${modifyInput.current.scrollHeight}px`;
        }
    }, [isModify]);

    const handleIsModify = () => {
        modifyInput.current.focus();
        setIsmodify(prev => !prev);
        setNewComment(dto.boardCommentContent);
        setCharCount(dto.boardCommentContent.length);

        setTimeout(() => {
            if (modifyInput.current) {
                modifyInput.current.focus();
                modifyInput.current.selectionStart = modifyInput.current.value.length;
                modifyInput.current.selectionEnd = modifyInput.current.value.length;
            }
        }, 0);
    }

    const [newComment, setNewComment] = useState(dto.boardCommentContent);

    const handleModifyChange = (e) => {
        if (e.target.value.length > maxReplyLength) {
            e.preventDefault();
        } else {
            modifyInput.current.style.height = 'auto'; //height 초기화
            modifyInput.current.style.height = modifyInput.current.scrollHeight + 'px';
            setNewComment(e.target.value);
            setCharCount(e.target.value.length);
        }
    }

    const handleModify = () => {
        if (newComment.trim() === '') {
            alert("공백, 줄바꿈 제외 최소 한 글자 이상을 입력해야 합니다.");
        } else {
            axios.put(`${BaseUrl()}/comment`, {
                seq: dto.boardCommentSeq,
                content: newComment
            }).then(resp => {
                if (resp.status === 200) {
                    setIsmodify(false);
                    setComments(prev => prev.map(comment => {
                        if (comment.boardCommentSeq === resp.data.boardCommentSeq) {
                            return ({ ...comment, boardCommentContent: resp.data.boardCommentContent, boardCommentWriteDate: resp.data.boardCommentWriteDate });
                        } else {
                            return comment;
                        }
                    }))
                }
            })
        }
    }

    //댓글 삭제 (답글들도 함께 삭제)
    const handleDelete = () => {
        if (window.confirm("이 댓글을 삭제하시겠습니까?")) {
            setCountComments(prev => (prev - 1 - list.length));
            axios.delete(`${BaseUrl()}/comment/${dto.boardCommentSeq}`).then(resp => {
                if (resp.status === 200) {
                    setList([]);
                    setComments(prev => prev.filter(item => item.boardCommentSeq !== dto.boardCommentSeq))
                }
            }
            );
        }
    }

    return (
        <div className={styles.container}>
            <div className={styles.comment}>
                <div className={styles.commentWriter}>{dto.boardCommentWriter}</div>
                <div className={styles.commentContent}>
                    <textarea className={styles.modifyInput} onChange={handleModifyChange} value={newComment} ref={modifyInput} spellCheck={false}
                        hidden={!isModify} />
                    {!isModify && dto.boardCommentContent}
                </div>
                <div className={styles.commentDateBox}>
                    {isModify ?
                        <div className={styles.modifyButtonBox}>
                            <div className={styles.charCount}>{charCount}/1000자</div>
                            <Button appearance="link" className={styles.modifyYesButton} onClick={handleIsModify}>취소</Button>
                            <Button appearance="link" className={styles.modifyNoButton} onClick={handleModify}>완료</Button>
                        </div> :
                        <>
                            <div className={styles.commentDate}>{format(new Date(Date.parse(dto.boardCommentWriteDate)), 'yy.MM.dd HH:mm')}
                                {(dto.boardCommentWriter.includes(empName) || admin) && <>
                                    <Button appearance="link" className={styles.commentModifyButton} onClick={handleIsModify}>수정</Button>
                                    <Button appearance="link" className={styles.commentDeleteButton} onClick={handleDelete}>삭제</Button>
                                </>}
                            </div>
                            <div className={styles.commentButtonBox}>
                                {openWriteReplyBox ? <Button color="green" className={styles.openRepleWriteButton} onClick={handleOpenwriteReplyBox} appearance="ghost">답글취소</Button>
                                    : <Button color="green" className={styles.openRepleWriteButton} onClick={handleOpenwriteReplyBox} appearance="ghost">답글쓰기</Button>}
                            </div>
                        </>
                    }
                </div>
            </div>
            {openWriteReplyBox &&
                <div className={styles.replyWriteBox}>
                    <div className={styles.replyWriter}>ㄴ {sessionWriter}</div>
                    <div className={styles.replyContentBox}>
                        <div className={styles.innerReplyContentBox}>
                            <textarea
                                placeholder={`최대 ${maxReplyLength}자까지 작성 가능합니다`} ref={replyWriteInput}
                                className={styles.replyContent} onChange={handleReplyChange} value={reply} maxLength={maxReplyLength}></textarea>
                            <Button color="green" appearance="primary" onClick={handleWriteReply} className={styles.writeReplyButton}>
                                등록
                            </Button>
                        </div>
                        <div className={styles.replyCountBox}>{replyCount}/1000자</div>
                    </div>
                </div>
            }
            {list.map((reple, i) =>
                <Reply key={i} dto={reple} setCountComments={setCountComments} sessionWriter={sessionWriter} admin={admin} setList={setList} maxReplyLength={maxReplyLength} empName={empName} />
            )}
        </div>
    );
}

export default Comment;