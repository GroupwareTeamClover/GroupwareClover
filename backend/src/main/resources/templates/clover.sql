--노시온
CREATE TABLE employee(
    emp_seq NUMBER PRIMARY KEY,
    emp_state_code NUMBER NOT NULL,
    emp_id varchar2(50) NOT NULL,
    emp_pw varchar2(128) NOT NULL,
    emp_name varchar2(20) NOT NULL,
    emp_email varchar2(100) NOT NULL,
    emp_birth NUMBER NOT NULL,
    emp_gender char(1) NOT NULL,
    emp_tel NUMBER NOT NULL,
    emp_address varchar2(100) NOT NULL,
    role_code NUMBER NOT NULL,
    dept_code NUMBER NOT NULL,
    join_date TIMESTAMP DEFAULT sysdate NOT NULL,
    leave_date TIMESTAMP NULL,
    annual_leave_day NUMBER DEFAULT 0 NOT NULL
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

CREATE TABLE outside_work (
    outside_seq NUMBER PRIMARY KEY,
    outside_state_code varchar2(30) NOT NULL,
    start_date varchar2(30) NOT NULL,
    end_date varchar2(30) NOT NULL,
    outside_date timestamp DEFAULT sysdate NOT NULL
);

CREATE SEQUENCE outside_sequence START WITH 1 INCREMENT BY 1 nocache nomaxvalue;

CREATE TABLE outside_state (
    outside_state_code NUMBER PRIMARY KEY,
    outside_state_name varchar2(20) NOT NULL
);

CREATE TABLE dayoff_state (
    dayoff_code NUMBER PRIMARY KEY,
    dayoff_name varchar2(30) NOT NULL
);




--하윤

CREATE TABLE pop_board (
    pop_seq NUMBER PRIMARY KEY, 
    pop_title varchar2(100) NOT NULL, 
    emp_seq NUMBER NOT NULL, 
    pop_content long NOT NULL, 
    pop_start_date TIMESTAMP NOT NULL, 
    pop_end_date TIMESTAMP NOT NULL, 
    pop_is_active CHAR(1) DEFAULT 'n' CHECK (pop_is_active IN ('y', 'n')) NOT NULL,
    pop_write_date TIMESTAMP DEFAULT SYSDATE NOT NULL, 
    pop_updated_date TIMESTAMP NULL,
    pop_is_repeated CHAR(1) DEFAULT 'n' CHECK (pop_is_active IN ('y', 'n')) NOT NULL
);

CREATE SEQUENCE pop_board_sequence START WITH 1 INCREMENT BY 1 nocache nomaxvalue;

CREATE TABLE pop_repeated (
    pop_repeated_seq NUMBER PRIMARY KEY, 
    pop_seq NUMBER NOT NULL,
    month NUMBER NULL, 
    day NUMBER NULL, 
    week NUMBER NULL, 
    weekday NUMBER NULL
);

CREATE SEQUENCE pop_repeated START WITH 1 INCREMENT BY 1 nocache nomaxvalue;

CREATE TABLE log (
    log_seq number primary key, 
    log_date Timestamp not null, 
    emp_seq number not null, 
    emp_state_seq number not null,
    log_ip varchar2(20) not null, 
    log_state number null,
    dept_seq number not null
    );

CREATE SEQUENCE log_sequence START WITH 1 INCREMENT BY 1 nocache nomaxvalue;

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
    board_seq number not null
);

create sequence board_comment_sequence start with 1 increment by 1 nomaxvalue nocache;
create sequence board_sequence start with 1 increment by 1 nomaxvalue nocache;
create sequence boardlist_sequence start with 1 increment by 1 nomaxvalue nocache;



--조진혁
-- 채팅방 입장 로그
Create table chatRoomLog (
    room_time_seq number primary key,
    emp_seq number not null,
    singer number not null,
    join_time timestamp, 
    left_time timestamp
);

Create sequence room_time_sequence start with 1 INCREMENT by 1 nocache nomaxvalue;

-- 채팅방
Create table chatRoom (
    room_seq number primary key,
    room_name varchar(100) not null,
    room_state char(1) default 'T' not null,
    room_create_time timestamp default sysdate not null,
    room_type varchar(20) not null
);

Create sequence room_sequence start with 1 INCREMENT by 1 nocache nomaxvalue;


-- 멤버채팅방 연결엔티티
Create table chatMembers (
    emp_seq number primary key,
    room_seq number not null
);

-- 1:1 채팅방
Create table privateMessage (
    private_room_seq number primary key,
    send_time timestamp default sysdate not null,
    room_seq number not null,
    sender_seq number not null,
    reciver_seq number not null
);

Create sequence private_room_sequence start with 1 INCREMENT by 1 nocache nomaxvalue;


-- 그룹 채팅방
Create table GroupChatRoom (
    group_room_seq number primary key,
    description varchar(255) null,
    create_emp_seq number not null,
    create_time timestamp default sysdate not null,
    room_seq number not null
);

Create sequence group_room_sequence start with 1 INCREMENT by 1 nocache nomaxvalue;


-- 채팅방 메시지
Create table ChatMessage (
    message_seq number primary key,
    message_content clob not null,
    message_type varchar(20) not null,
    user_confirm char(1) default 'F' not null,
    send_time timestamp not null,
    room_seq number not null,
    sender_seq number not null
);

Create sequence message_sequence start with 1 INCREMENT by 1 nocache nomaxvalue;

-- 알림정보
Create table Notifications (
    notification_seq number primary key,
    is_read char(1) default 'F' not null,
    create_date timestamp default sysdate not null,
    message_seq number not null,
    emp_seq number not null    
);

Create sequence notification_sequence start with 1 INCREMENT by 1 nocache nomaxvalue;

-- 읽은 상태
Create table ReadStatus (
    read_seq number primary key,
    read_time timestamp not null,
    message_seq number not null,
    emp_seq number not null
);

Create sequence read_sequence start with 1 INCREMENT by 1 nocache nomaxvalue;



--박새미
CREATE TABLE document (
	doc_seq	number		NOT NULL,
	doc_detail_code	number		NOT NULL,
	doc_state_code	number		NOT NULL,
	drafter_seq	number		NOT NULL,
	egc_yn	CHAR(1) DEFAULT 'n' CHECK (egc_yn IN ('y', 'n')) NOT NULL,
	write_date	timestamp	DEFAULT sysdate	NOT NULL,
	finish_date	timestamp		NULL,
	current_apver_seq	number		NOT NULL,
	final_apver_seq	number		NOT NULL,
	doc_com_seq	varchar(30)		NULL
);


CREATE TABLE apv_line (
	line_seq	number		NOT NULL,
	apv_status_code	number		NOT NULL,
	apver_id	number		NOT NULL,
	line_apver_cmt	varchar(300)		NULL,
	line_order	number	NOT NULL,
	line_apv_date	timestamp		NOT NULL,
	doc_seq	number		NOT NULL
);



CREATE TABLE dayoff (
	dayoff_seq	number		NOT NULL,
	dayoff_code	number		NOT NULL,
	start_date	timestamp		NOT NULL,
	end_date	timestamp		NOT NULL,
	dayoff_half	char(1)		NULL,
	half_type	char(1)		NULL,
	doc_seq	number		NOT NULL,
	Field	VARCHAR(255)		NULL
);



CREATE TABLE business (
	bs_seq	number		NOT NULL,
	bs_title	varchar(300)		NOT NULL,
	bs_content	clob		NULL,
	bs_write_date	timestamp		NOT NULL,
	doc_seq	number		NOT NULL
);




CREATE TABLE participants_line (
	line_seq	number		NOT NULL,
	doc_seq	number		NOT NULL,
	emp_seq	number		NOT NULL,
	pcp_ division	char(1)		NOT NULL,
	read_yn	CHAR(1) DEFAULT 'n' CHECK (egc_yn IN ('y', 'n')) NOT NULL,
	read_date	timestamp		NULL
);


CREATE TABLE apv_state_code (
	apv_state_code	number		NOT NULL,
	apv_state_name	varchar(30)		NOT NULL
);

CREATE TABLE doc_state_code (
	doc_state_code	number		NOT NULL,
	doc_state_name	varchaar(30)		NOT NULL
);

CREATE TABLE doc_detail_code (
	doc_detail_code	number		NOT NULL,
	doc_detail_name	varchar(30)		NOT NULL,
	doc_code	number		NOT NULL
);

CREATE TABLE doc_code (
	doc_code	number		NOT NULL,
	doc_code_name	varchar(30)		NOT NULL
);




