import { Button } from 'rsuite';
import styles from './Reply.module.css';
import 'rsuite/Button/styles/index.css';
import { format } from 'date-fns';

const Reply = ({ dto, sessionWriter }) => {
    return (
        <div className={styles.container}>
            <div className={styles.reply}>
                <div className={styles.replyWriter}>ㄴ {dto.boardCommentWriter}</div>
                <div className={styles.replyContent}>{dto.boardCommentContent}</div>
                <div className={styles.replyDateBox}>
                    <div className={styles.replyDate}>{format(new Date(Date.parse(dto.boardCommentWriteDate)), 'yy.MM.dd HH:mm')}
                        <Button appearance="link" className={styles.replyModifyButton}>수정</Button>
                        <Button appearance="link" className={styles.replyDeleteButton}>삭제</Button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Reply;