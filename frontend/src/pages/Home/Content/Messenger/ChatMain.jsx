import React from 'react';
import styles from './ChatMain.module.css';

export const ChatMain = () => {
    return (
        <div className={styles.container}>
            <div className={styles.chatMenu}>
                <div> 본인 프로필, 프로필 위에 알람 있어야함. 몇개인지</div>
                <br></br><br></br><br></br>
                <div> 조직도 출력 </div>
                <br></br><br></br><br></br>
                <div> 공지톡 모달창 띄우기 </div>
                <br></br><br></br><br></br>
                <div> 메시지 기록 출력</div>

            </div>
            <div className={styles.chatList}>
                <div className={styles.searchButton}>
                    <input className={styles.searchInput} type="text" placeholder="검색어 입력">
                    </input>
                </div>
                <p className={styles.memberStatus}> Online Now 접속중인 사람 출력 </p> 
                <br></br><br></br><br></br>
                <div> 프로필 부분 </div>
                <br></br><br></br><br></br>
                <div> 대화 목록/개인 방, 단톡 방 분류 </div>
                <br></br><br></br><br></br>
                <div> 대화방 목록 출력</div>
                <br></br><br></br><br></br>
                <div> 대화방 생성 버튼 +-</div>
            </div>
           
            <div className={styles.chatWindow}>
                <div className={styles.chatHeader}>
                    <h2>사람 프로필 정경호 액티브 상태 </h2>
                </div>
                <div className={styles.chatBody}>
                    <div className={styles.message}>
                        <div className={styles.messageContent}>ChatMessage 테이블 message_content, user_confirm </div>
                        <div className={styles.messageTimestamp}>ChatMessage 테이블 send_time</div>
                    </div>
                        <div className={styles.message}>
                        <div className={styles.messageContent}>Jin.pdf</div>
                        <div className={styles.messageTimestamp}>보낸 시간 </div>
                    </div>
                        <div className={styles.message}>
                        <div className={styles.messageContent}>녹음 파일</div>
                        <div className={styles.messageTimestamp}>9:35 AM</div>
                    </div>
                        <div className={styles.message}>
                        <div className={styles.messageContent}>***</div>
                        <div className={styles.messageTimestamp}>상대가 작성 중</div>
                    </div>   
                </div>
                <div className={styles.chatFooter}>
                    <input type = "text" placeholder="메시지를 입력해 주세요. 이모티콘 버튼, 파일 전송 버튼"></input>
                    <button>전송</button>
                </div>

            </div>
        </div>
    )
}
