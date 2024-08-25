--노시온
CREATE TABLE employee(
    emp_seq NUMBER PRIMARY KEY,
    emp_state_code NUMBER NOT NULL,
    emp_id varchar2(50) NOT NULL,
    emp_pw varchar2(128) NOT NULL,
    emp_name varchar2(20) NOT NULL,
    emp_email varchar2(100) NOT NULL,
    emp_birth varchar2(6) NOT NULL,
    emp_gender char(1) NOT NULL,
    emp_tel varchar2(11) NOT NULL,
    emp_avatar varchar2(1000) Default NULL,
    role_code NUMBER NOT NULL,
    dept_code NUMBER NOT NULL,
    join_date TIMESTAMP NULL,
    leave_date TIMESTAMP NULL,
    annual_leave_day NUMBER DEFAULT 0 NOT NULL,
    worker_state_code NUMBER DEFAULT 99 NOT NULL
);

CREATE SEQUENCE employee_sequence START WITH 1 INCREMENT BY 1 nocache nomaxvalue;

CREATE TABLE attendance (
    att_seq NUMBER PRIMARY KEY,
    emp_seq NUMBER NOT NULL,
    att_arrive varchar2(30) NOT NULL,
    att_leave varchar2(30) DEFAULT NULL,
    att_total NUMBER DEFAULT NULL,
    work_state_seq NUMBER NOT NULL,
    att_success char(1) DEFAULT 'N',
    att_date timestamp DEFAULT sysdate NOT null
);

CREATE SEQUENCE attendance_sequence START WITH 1 INCREMENT BY 1 nocache nomaxvalue;


CREATE TABLE work_state (
    work_state_code NUMBER PRIMARY KEY,
    work_state_name varchar2(30) NOT NULL
);


CREATE TABLE employee_state (
    emp_state_code NUMBER PRIMARY KEY,
    emp_state_name varchar2(30) NOT NULL
);


CREATE TABLE ROLE (
    role_code NUMBER PRIMARY KEY,
    role_name varchar2(30) NOT NULL
);

CREATE TABLE department (
    dept_code NUMBER PRIMARY KEY,
    dept_name varchar2(30) NOT NULL
);

CREATE TABLE worker_state (
    worker_state_code NUMBER PRIMARY KEY,
    worker_state_name varchar2(30) NOT NULL
);

CREATE SEQUENCE worker_state_sequence START WITH 1 INCREMENT BY 1 nocache nomaxvalue;


CREATE TABLE dayoff_state (
    dayoff_code NUMBER PRIMARY KEY,
    dayoff_name varchar2(30) NOT NULL
);




--정하윤
create table popup_board (
pop_seq integer PRIMARY KEY,
pop_title varchar2(100) NOT NULL,
emp_id varchar2(50) NOT NULL,
pop_content long NOT NULL,
pop_is_active varchar2(10) CHECK (pop_is_active IN ('true', 'false')) NOT NULL,
pop_write_date TIMESTAMP DEFAULT SYSDATE NOT NULL,
pop_updated_date TIMESTAMP NULL
);
create sequence popup_board_sequence start with 1 increment by 1 nomaxvalue nocache;
create table popup_period(
pop_period_seq integer PRIMARY KEY,
pop_seq integer NOT NULL, --외래키
period_type VARCHAR2(15) CHECK (period_type IN ('specific', 'monthly', 'weekly')) NOT NULL,
start_date VARCHAR2(30)  NULL,
end_date VARCHAR2(30) NULL,
monthly_day VARCHAR2(15) NULL,
weekly_day VARCHAR2(15) NULL
);
CREATE SEQUENCE POPUP_PERIOD_SEQUENCE START WITH 1 INCREMENT BY 1 NOMAXVALUE NOCACHE;


create table log (
    log_seq number PRIMARY KEY,
    emp_seq number NULL,
    emp_name varchar2(50) NULL,
    emp_id varchar2(20) NULL,
    dept_code number NULL,
    client_ip varchar2(20) NOT NULL,
    local_logtime timestamp NOT NULL,
    log_status varchar2(100) NOT NULL
);
create sequence log_sequence start with 1 increment by 1 nomaxvalue nocache;



--정경호
create table boardlist(
    boardlist_seq number primary key,
    boardlist_name varchar2(100 char) not null,
    boardlist_type char(1) check(boardlist_type in ('A', 'G')) not null,
    boardlist_active char(1) check(boardlist_active in ('T', 'F')) not null
);
create table board_whitelist(
    emp_seq number,
    boardlist_seq number,
    constraint board_whitelist_pk primary key(emp_seq, boardlist_seq)
);
create table board_important(
    emp_seq number,
    board_seq number,
    constraint board_important_pk primary key(emp_seq, board_seq)
);
create table board(
    board_seq number primary key,
    boardlist_seq number not null,
    board_title varchar2(100 char) not null,
    board_writer varchar2(30 char) not null,
    board_content long not null,
    board_write_date Timestamp default sysdate not null,
    board_view_count number default 0 not null
);
create table board_comment(
    board_comment_seq number primary key,
    board_comment_writer varchar2(30 char) not null,
    board_comment_content varchar2(1000 char) not null,
    board_comment_write_date Timestamp default sysdate not null,
    board_seq number not null,
    board_comment_reply_seq number
);

create sequence board_comment_sequence start with 1 increment by 1 nomaxvalue nocache;
create sequence board_sequence start with 1 increment by 1 nomaxvalue nocache;
create sequence boardlist_sequence start with 1 increment by 1 nomaxvalue nocache;

-- 첨부파일
create table attachment (
    attachment_seq number primary key,
    attachment_oriname varchar2(300 char) not null,
    attachment_sysname varchar2(400 char) not null,
    attachment_from varchar2(20 char) not null,
    attachment_parent_seq number not null
);

create sequence attachment_sequence start with 1 increment by 1 nomaxvalue nocache;

-- 게시판 외래키
--1.[화이트리스트]
ALTER TABLE board_whitelist
ADD CONSTRAINTS board_whitelist_boardFK foreign KEY (boardlist_seq)
REFERENCES boardlist(boardlist_seq) on delete cascade;

ALTER TABLE board_whitelist
ADD CONSTRAINTS board_whitelist_empFK foreign KEY (emp_seq)
REFERENCES employee(emp_seq) on delete cascade;
--2.[중요글]
ALTER TABLE board_important
ADD CONSTRAINTS board_important_empFK foreign KEY (emp_seq)
REFERENCES employee(emp_seq) on delete cascade;

ALTER TABLE board_important
ADD CONSTRAINTS board_important_boardFK foreign KEY (board_seq)
REFERENCES board(board_seq) on delete cascade;
--3.[게시판]
ALTER TABLE board
ADD CONSTRAINTS board_boardlistFK foreign KEY (boardlist_seq)
REFERENCES boardlist(boardlist_seq) on delete cascade;
--4.[댓글]
ALTER TABLE board_comment
ADD CONSTRAINTS board_comment_boardFK foreign KEY (board_seq)
REFERENCES board(board_seq) on delete cascade;


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

-- 멤버채팅방 연결엔티티
Create table chatMembers (
    emp_seq number primary key,
    room_seq number not null,
    member_role VARCHAR2(20) DEFAULT 'MEMBER'
        CHECK (member_role IN ('MEMBER', 'ADMIN', 'MODERATOR', 'OWNER', 'GUEST', 'BANNED')),
    join_time TIMESTAMP DEFAULT SYSDATE NOT NULL
);


--박새미
CREATE TABLE document (
	doc_seq	number		 primary key,
	doc_detail_code	number		NOT NULL,
	doc_state_code	number		NOT NULL,
	drafter_seq	number		NOT NULL,
	egc_yn	CHAR(1) DEFAULT 'n' CHECK (egc_yn IN ('y', 'n')) NOT NULL,
	write_date	timestamp	DEFAULT sysdate	NULL,
	finish_date	timestamp		NULL,
	current_apver_seq	number	NULL,
	final_apver_seq	number		NULL,
	doc_com_seq	varchar(30)		NULL
);


CREATE sequence document_sequence start with 0001 INCREMENT by 1 nocache nomaxvalue;

CREATE TABLE apv_line (
	line_seq	number		 primary key,
	apv_status_code	number		NOT NULL,
	apver_id	number		NOT NULL,
	line_apver_cmt	varchar(300)		NULL,
	line_order	number	NOT NULL,
	line_apv_date	timestamp  NULL,
	doc_seq	number		NOT NULL
);

CREATE sequence apv_line_sequence start with 1 INCREMENT by 1 nocache nomaxvalue;

CREATE TABLE business (
	bs_seq	number		 primary key,
	bs_title	varchar(300)	NULL,
	bs_content	long		NULL,
	bs_write_date	timestamp	NULL,
	doc_seq	number		NOT NULL
);


CREATE sequence business_sequence start with 1 INCREMENT by 1 nocache nomaxvalue;

CREATE TABLE participants_line (
    line_seq     number        primary key,
    emp_seq      number        NOT NULL,
    pcp_division char(1)       CHECK (pcp_division IN ('c', 'f')) NOT NULL,
    read_yn      CHAR(1)       DEFAULT 'n' CHECK (read_yn IN ('y', 'n')) NOT NULL,
    read_date    timestamp     NULL,
    doc_seq      number        NOT NULL
);

CREATE sequence participants_line_sequence start with 1 INCREMENT by 1 nocache nomaxvalue;


CREATE TABLE apv_state_code (
	apv_state_code	number		 primary key,
	apv_state_name	varchar(30)		NOT NULL
);

CREATE TABLE doc_state_code (
	doc_state_code	number		 primary key,
	doc_state_name	varchar(30)		NOT NULL
);

CREATE TABLE doc_detail_code (
    doc_detail_code number        primary key,
    doc_detail_name varchar(30)   NOT NULL,
    retention_period number       NOT NULL,
    doc_code        number        NOT NULL
);

CREATE TABLE doc_code (
	doc_code	number		 primary key,
	doc_code_name	varchar(30)		NOT NULL
);


/*CREATE TABLE dayoff (
	dayoff_seq	number		 primary key,
	dayoff_code	number		NOT NULL,
	start_date	timestamp		NOT NULL,
	end_date	timestamp		NOT NULL,
	dayoff_half	char(1)		NULL,
	half_type	char(1)		NULL,
	doc_seq	number		NOT NULL
);*/

/*CREATE sequence dayoff_sequence start with 1 INCREMENT by 1 nocache nomaxvalue;
*/


/*CREATE TABLE schedule (
    schedule_seq NUMBER PRIMARY KEY,
    schedule_content VARCHAR2(300) NOT NULL,
    emp_seq NUMBER NOT NULL,
    dept_code NUMBER NOT NULL,
    start_date TIMESTAMP NOT NULL,
    end_date TIMESTAMP NOT NULL
);

CREATE SEQUENCE schedule_sequence start with 1 INCREMENT by 1 nocache nomaxvalue;

ALTER TABLE schedule
    ADD CONSTRAINTS schedule_empFK foreign KEY (emp_seq)
REFERENCES employee(emp_seq) on delete cascade;*/


--**************insert 데이트 문***************
--박새미
insert into doc_code values(1,'일반');

insert into doc_detail_code values(1, '업무기안' ,5, 1);

insert into doc_state_code values(1, '진행중');
insert into doc_state_code values(2, '임시저장');
insert into doc_state_code values(3, '완료');
insert into doc_state_code values(4, '반려');
insert into doc_state_code values(5, '상신취소');

insert into apv_state_code values(1, '대기');
insert into apv_state_code values(2, '예정');
insert into apv_state_code values(3, '승인');
insert into apv_state_code values(4, '반려');
insert into apv_state_code values(8, '보류');
insert into apv_state_code values(9, '중지');

-- 노시온
-- Detartment dummy data
INSERT INTO department values(1, '총무');
INSERT INTO department values(2, '인사');
INSERT INTO department values(3, '사무');
INSERT INTO department values(4, '유통');
INSERT INTO department values(5, '경영');
INSERT INTO department values(99, '미정');

-- Role dummy data
INSERT INTO role values(1, '사장');
INSERT INTO role values(2, '부사장');
INSERT INTO role values(3, '이사');
INSERT INTO role values(4, '부장');
INSERT INTO role values(5, '차장');
INSERT INTO role values(6, '과장');
INSERT INTO role values(7, '대리');
INSERT INTO role values(8, '사원');
INSERT INTO role values(9, '인턴');
INSERT INTO role values(99, '미정');

-- Worker_state dummy data
INSERT INTO worker_state VALUES( 0, '관리자' );
INSERT INTO worker_state VALUES( 1, '정규직' );
INSERT INTO worker_state VALUES( 2, '비정규직' );
INSERT INTO worker_state VALUES( 3, '계약직' );
INSERT INTO worker_state VALUES( 99, '미정' );

-- Employee_state dummy data
INSERT INTO employee_state VALUES(0, '가입대기');
INSERT INTO employee_state VALUES(1, '재직중');
INSERT INTO employee_state VALUES(2, '퇴사');

-- Dayoff_state dummy data
INSERT INTO dayoff_state VALUES(1, '연차');
INSERT INTO dayoff_state VALUES(2, '조퇴');
INSERT INTO dayoff_state VALUES(3, '지각');
INSERT INTO dayoff_state VALUES(4, '경조');
INSERT INTO dayoff_state VALUES(5, '공가');
INSERT INTO dayoff_state VALUES(6, '질병휴가');

-- Employee dummy data test90 (admin) / password → test
INSERT INTO employee VALUES ( employee_sequence.nextval, 0, 'test90', 'ee26b0dd4af7e749aa1a8ee3c10ae9923f618980772e473f8819a5d4940e0db27ac185f8a0e1d5f84f88bc887fd67b143732c304cc5fa9ad8e6f57f50028a8ff', '김철수', 'test0@gmail.com', '790123', 'M', '01012345678', 'https://groupwareteamclover.s3.ap-northeast-2.amazonaws.com/profile/man.png', 99, 99, NULL,NULL, 0, 0 );
--**************트리거 or 함수***************


