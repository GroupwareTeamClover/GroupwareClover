
-- 변경사항
-- ReadStatus 테이블 -> LastReadMessage 테이블로 변경 
-- 사유 : 데이터가 너무 커지기 때문
-- 변경 방식 : 각 사용자별로 마지막에 읽은 메시지 ID를 저장하는 방식으로 변경
-- 1. 각 채팅방별로 사용자가 마지막으로 읽은 메시지의 ID를 저장
-- 2. 이 ID보다 작거나 같은 모든 메시지는 해당 사용자가 읽은 것으로 간주
-- 3. 이 ID보다 큰 모든 메시지는 읽지 않은 것으로 간주
-- 기대 효과 : 데이터 저장 효율과 조회 성능 모두 개선

-- 변경사항 2
-- chatMembers에 role 추가.

--조진혁
-- room_seq, emp_seq, message_seq 모두 외래키, emp_seq, room_seq는 기본키
CREATE TABLE LastReadMessage (
    emp_seq NUMBER primary key,
    room_seq NUMBER,
    last_read_message_seq NUMBER,
    last_read_time TIMESTAMP DEFAULT SYSDATE NOT NULL
);


-- 알림정보
Create table Notifications (
    notification_seq number primary key,
    notification_type varchar2(20) not null,
    is_read char(1) default 'F' not null,
    create_date timestamp default sysdate not null,
    message_seq number not null,
    emp_seq number not null    
);

Create sequence notification_sequence start with 1 INCREMENT by 1 nocache nomaxvalue;

-- 채팅방 입장 로그
Create table chatRoomLog (
    room_time_seq number primary key,
    emp_seq number not null,
    room_seq number not null,
    join_time timestamp, 
    left_time timestamp
);

Create sequence room_time_sequence start with 1 INCREMENT by 1 nocache nomaxvalue;


-- 채팅방 메시지
-- room_seq와 sender_seq가 외래키, user_confirm이 꼭 필요한가.

Create table ChatMessage (
    message_seq number primary key,
    message_content clob not null,
    message_type varchar(20) not null,
    send_time timestamp not null,
    room_seq number not null,
    sender_seq number not null
);
ALTER TABLE ChatMembers ADD last_access_time TIMESTAMP;
Create sequence message_sequence start with 1 INCREMENT by 1 nocache nomaxvalue;

-- 채팅방
Create table chatRoom (
    room_seq number primary key,
    room_name varchar(100) not null,
    room_state char(1) default 'T' not null check (room_state in ('T', 'F')),
    room_create_time timestamp default sysdate not null,
    room_type varchar(20) not null check (room_type in ('private', 'group', 'public')),
    room_description varchar2(255),
    emp_seq number not null
);

Create sequence room_sequence start with 1 INCREMENT by 1 nocache nomaxvalue;

-- 채팅방 멤버
Create table chatMembers (
    emp_seq number not null,
    room_seq number not null,
    custom_room_name varchar2(100),
    custom_room_avatar varchar2(1000),
    member_role VARCHAR2(20) DEFAULT 'MEMBER' 
        CHECK (member_role IN ('MEMBER', 'ADMIN', 'MODERATOR', 'OWNER', 'GUEST', 'BANNED')),
    join_time TIMESTAMP DEFAULT SYSDATE NOT NULL    
);

Create table userSession (
    session_id varchar(255) PRIMARY KEY,
    emp_seq int,
    login_time TIMESTAMP default sysdate,
    is_online BOOLEAN DEFAULT true
);

-- 인덱스 추가
CREATE INDEX idx_chatmessage_room_time ON ChatMessage(room_seq, send_time);
CREATE INDEX idx_chatmembers_room ON chatMembers(room_seq);
CREATE INDEX idx_notifications_emp ON Notifications(emp_seq);