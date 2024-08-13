import { Button } from 'rsuite';
import styles from './Reply.module.css';
import 'rsuite/Button/styles/index.css';
import { format } from 'date-fns';
import axios from 'axios';
import { BaseUrl } from '../../../../../../../commons/config';
import { useEffect, useRef, useState } from 'react';

const Reply = ({ dto, sessionWriter, admin, setList, maxReplyLength, empName }) => {
    //답글 삭제
    const handleDelete = () => {
        if (window.confirm("이 답글을 삭제하시겠습니까?")) {
            axios.delete(`${BaseUrl()}/comment/reply/${dto.boardCommentSeq}`).then(resp => 
                { resp.status === 200 && setList(prev => prev.filter(item => (item.boardCommentSeq !== dto.boardCommentSeq))) }
            )
        }
    }

    //답글 수정
    const [isModify, setIsmodify] = useState(false);
    const modifyInput = useRef(null);

    useEffect(() => {
        if (isModify && modifyInput.current) {
            modifyInput.current.style.height = 'auto';
            modifyInput.current.style.height = `${modifyInput.current.scrollHeight}px`;
        }
    }, [isModify]);

    const handleIsModify = () => {
        setIsmodify(prev => !prev);
        setNewReply(dto.boardCommentContent);

        setTimeout(() => {
            if (modifyInput.current) {
                modifyInput.current.focus();
                modifyInput.current.selectionStart = modifyInput.current.value.length;
                modifyInput.current.selectionEnd = modifyInput.current.value.length;
            }
        }, 0);
    }
    
    const [newReply, setNewReply] = useState(dto.boardCommentContent);

    const handleModifyChange = (e) => {
        if (e.target.value.length > maxReplyLength) {
            e.preventDefault();
        } else {
            modifyInput.current.style.height = 'auto'; //height 초기화
            modifyInput.current.style.height = modifyInput.current.scrollHeight + 'px';
            setNewReply(e.target.value);
        }
    }

    const handleModify = () => {
        if (newReply.trim() === '') {
            alert("댓글 내용을 입력하세요!");
        } else {
            axios.put(`${BaseUrl()}/comment`, {
                seq: dto.boardCommentSeq,
                content: newReply
            }).then(resp => {
                if (resp.status === 200) {
                    setIsmodify(false);
                    setList(prev => prev.map(reply => {
                        if (reply.boardCommentSeq === resp.data.boardCommentSeq) {
                            return ({ ...reply, boardCommentContent: resp.data.boardCommentContent, boardCommentWriteDate: resp.data.boardCommentWriteDate });
                        } else {
                            return reply;
                        }
                    }))
                }
            })
        }
    }

    return (
        <div className={styles.container}>
            <div className={styles.reply}>
                <div className={styles.replyWriter}>ㄴ {dto.boardCommentWriter}</div>
                <div className={styles.replyContent}>
                    <textarea className={styles.modifyInput} onChange={handleModifyChange} value={newReply} autoFocus={true} ref={modifyInput} spellCheck={false} hidden={!isModify} />
                    {!isModify && dto.boardCommentContent}</div>
                <div className={styles.replyDateBox}>
                    {isModify ?
                        <div className={styles.modifyButtonBox}>
                            <Button appearance="link" className={styles.modifyYesButton} onClick={handleIsModify}>취소</Button>
                            <Button appearance="link" className={styles.modifyNoButton} onClick={handleModify}>완료</Button>
                        </div> :
                        <div className={styles.replyDate}>{format(new Date(Date.parse(dto.boardCommentWriteDate)), 'yy.MM.dd HH:mm')}
                            {(dto.boardCommentWriter.includes(empName) || admin) && <>
                                <Button appearance="link" className={styles.replyModifyButton} onClick={handleIsModify}>수정</Button>
                                <Button appearance="link" className={styles.replyDeleteButton} onClick={handleDelete}>삭제</Button>
                            </>}
                        </div>
                    }
                </div>
            </div>
        </div>
    );
}

export default Reply;