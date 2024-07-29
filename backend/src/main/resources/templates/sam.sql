--박새미
--박새미
CREATE TABLE document (
	doc_seq	number		 primary key,
	doc_detail_code	number		NOT NULL,
	doc_state_code	number		NOT NULL,
	drafter_seq	number		NOT NULL,
	egc_yn	CHAR(1) DEFAULT 'n' CHECK (egc_yn IN ('y', 'n')) NULL,
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
	line_apv_date	timestamp		NOT NULL,
	doc_seq	number		NOT NULL
);

CREATE sequence apv_line_sequence start with 1 INCREMENT by 1 nocache nomaxvalue;

CREATE TABLE dayoff (
	dayoff_seq	number		 primary key,
	dayoff_code	number		NOT NULL,
	start_date	timestamp		NOT NULL,
	end_date	timestamp		NOT NULL,
	dayoff_half	char(1)		NULL,
	half_type	char(1)		NULL,
	doc_seq	number		NOT NULL,
	Field	VARCHAR(255)		NULL
);

CREATE sequence dayoff_sequence start with 1 INCREMENT by 1 nocache nomaxvalue;

CREATE TABLE business (
	bs_seq	number		 primary key,
	bs_title	varchar(300)		NOT NULL,
	bs_content	clob		NULL,
	bs_write_date	timestamp		NOT NULL,
	doc_seq	number		NOT NULL
);


CREATE sequence business_sequence start with 1 INCREMENT by 1 nocache nomaxvalue;

CREATE TABLE participants_line (
    line_seq     number        primary key,
    doc_seq      number        NOT NULL,
    emp_seq      number        NOT NULL,
    pcp_division char(1)       NOT NULL,
    read_yn      CHAR(1)       DEFAULT 'n' CHECK (read_yn IN ('y', 'n')) NOT NULL,
    read_date    timestamp     NULL
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


--**************insert 데이트 문***************
--박새미
insert into doc_code values(1,'일반');
insert into doc_code values(2, '근태');

insert into doc_detail_code values(1, '업무기안' ,5, 1);
insert into doc_detail_code values(2, '휴가신청서',5, 2);

insert into doc_state_code values(1, '임시저장');
insert into doc_state_code values(2, '진행중');
insert into doc_state_code values(3, '완료');
insert into doc_state_code values(4, '반려');
insert into doc_state_code values(5, '상신취소');

insert into apv_state_code values(1, '대기');
insert into apv_state_code values(2, '예정');
insert into apv_state_code values(3, '승인');
insert into apv_state_code values(4, '반려');
insert into apv_state_code values(5, '전결');
insert into apv_state_code values(6, '후결');