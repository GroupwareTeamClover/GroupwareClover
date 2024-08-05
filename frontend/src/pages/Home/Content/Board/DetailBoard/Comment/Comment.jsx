import { useState } from 'react';
import styles from './Comment.module.css';
import Button from 'rsuite/Button';
import 'rsuite/Button/styles/index.css';
import { format } from 'date-fns';
import Reply from './Reply/Reply';
import axios from 'axios';
import { BaseUrl } from '../../../../../../commons/config';

const Comment = ({ sessionWriter, dto, reples, setCountComments }) => {
    const [list, setList] = useState(reples);
    console.log(list);

    //답글작성창표시
    const [openWriteReplyBox, setOpenWriteReplyBox] = useState(false);
    const handleOpenwriteReplyBox = () => {
        setOpenWriteReplyBox(prev => !prev);
    }

    //답글
    const maxReplyLength = 1000;
    const [reply, setReply] = useState('');
    const handleReplyChange = (e) => {
        if (e.target.value.length > maxReplyLength) {
            e.preventDefault();
        } else {
            setReply(e.target.value);
        }
    }

    //답글 작성
    const handleWriteReply = () => {
        if (reply.trim() === '') {
            alert("답글 내용을 입력하세요!");
        } else {
            axios.post(`${BaseUrl()}/comment/reply`, {
                writer: sessionWriter,
                content: reply,
                boardSeq: dto.boardSeq,
                commentSeq : dto.boardCommentSeq
            }).then(resp => {
                if (resp.status === 200) {
                    setReply('');
                    setList(prev => [...prev, resp.data]);
                    setCountComments(prev => prev + 1);
                }
            })
        }
    }

    return (
        <div className={styles.container}>
            <div className={styles.comment}>
                <div className={styles.commentWriter}>{dto.boardCommentWriter}</div>
                <div className={styles.commentContent}>{dto.boardCommentContent}</div>
                <div className={styles.commentDateBox}>
                    <div className={styles.commentDate}>{format(new Date(Date.parse(dto.boardCommentWriteDate)), 'yy.MM.dd HH:mm')}
                        <Button appearance="link" className={styles.commentModifyButton}>수정</Button>
                        <Button appearance="link" className={styles.commentDeleteButton}>삭제</Button>
                    </div>
                    <div className={styles.commentButtonBox}>
                        {openWriteReplyBox ? <Button className={styles.openRepleWriteButton} onClick={handleOpenwriteReplyBox} appearance="ghost">답글취소</Button>
                            : <Button className={styles.openRepleWriteButton} onClick={handleOpenwriteReplyBox} appearance="ghost">답글쓰기</Button>}
                    </div>
                </div>
            </div>
            {openWriteReplyBox &&
                <div className={styles.replyWriteBox}>
                    <div className={styles.replyWriter}>ㄴ {sessionWriter}</div>
                    <div className={styles.replyContentBox}>
                        <textarea
                            placeholder={`최대 ${maxReplyLength}자까지 작성 가능합니다`}
                            className={styles.replyContent} onChange={handleReplyChange} value={reply} maxLength={maxReplyLength}></textarea>
                        <button type="button" className={styles.writeReplyButton} onClick={handleWriteReply}>등록</button>
                    </div>
                </div>
            }
            {list.map((reple, i) =>
                <Reply key={i} dto={reple} sessionWriter={sessionWriter}/>
            )}
        </div>
    );
}

export default Comment;