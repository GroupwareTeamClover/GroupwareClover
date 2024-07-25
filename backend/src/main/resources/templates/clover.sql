--노시온
CREATE TABLE employee(
    emp_seq NUMBER PRIMARY KEY,
    emp_state_seq NUMBER NOT NULL,
    emp_id varchar(50) NOT NULL,
    emp_pw varchar(128) NOT NULL,
    emp_name varchar(20) NOT NULL,
    emp_email varchar(100) NOT NULL,
    emp_birth NUMBER NOT NULL,
    emp_gender varchar(1) NOT NULL,
    emp_tel NUMBER NOT NULL,
    emp_address varchar(100) NOT NULL,
    role_seq NUMBER NOT NULL,
    dept_seq NUMBER NOT NULL,
    join_data TIMESTAMP DEFAULT sysdate NOT NULL,
    leave_date TIMESTAMP DEFAULT NULL
);

CREATE SEQUENCE employee_sequence
START WITH 1
INCREMENT BY 1
nocache
nomaxvalue;

CREATE TABLE attendance (
    att_seq NUMBER PRIMARY KEY,
    emp_seq NUMBER NOT NULL,
    att_arrive varchar(20) NOT NULL,
    att_leave varchar(20) DEFAULT NULL,
    att_total NUMBER DEFAULT NULL,
    work_state_seq NUMBER NOT NULL,
    att_success varchar(1) DEFAULT 'N',
    att_date timestamp DEFAULT sysdate NOT null
);

CREATE SEQUENCE attendance_sequence
START WITH 1
INCREMENT BY 1
nocache
nomaxvalue;


CREATE TABLE work_state (
    work_state_seq NUMBER PRIMARY KEY,
    work_state_name varchar(20) NOT NULL
);

CREATE SEQUENCE work_state_sequence
START WITH 1
INCREMENT BY 1
nocache
nomaxvalue;

CREATE TABLE schedule (
    schedule NUMBER PRIMARY KEY,
    emp_seq NUMBER NOT NULL,
    work_state_seq NUMBER NOT NULL,
    request_date timestamp NOT NULL,
    response_date timestamp NOT NULL,
    start_date timestamp NOT NULL,
    end_date timestamp NOT NULL,
    dayoff_seq NUMBER NOT NULL
);

CREATE SEQUENCE schedule_sequence
START WITH 1
INCREMENT BY 1
nocache
nomaxvalue;


CREATE TABLE employee_state (
    emp_state_seq NUMBER PRIMARY KEY,
    emp_state_name varchar(20) NOT NULL
);

CREATE SEQUENCE employee_state_sequence
START WITH 1
INCREMENT BY 1
nocache
nomaxvalue;


CREATE TABLE ROLE (
    role_seq NUMBER PRIMARY KEY,
    role_name varchar(20) NOT NULL
);

CREATE SEQUENCE role_sequence
START WITH 1
INCREMENT BY 1
nocache
nomaxvalue;

CREATE TABLE department (
    dept_seq NUMBER PRIMARY KEY,
    dept_name varchar(20) NOT NULL
);

CREATE SEQUENCE department_sequence
START WITH 1
INCREMENT BY 1
nocache
nomaxvalue;

CREATE TABLE worker_state (
    worker_state_seq NUMBER PRIMARY KEY,
    worker_state_name varchar(20) NOT NULL
);

CREATE SEQUENCE worker_state_sequence
START WITH 1
INCREMENT BY 1
nocache
nomaxvalue;

CREATE TABLE outside_work (
    outside_seq NUMBER PRIMARY KEY,
    outside_state_name varchar(20) NOT NULL,
    start_date varchar(20) NOT NULL,
    end_date varchar(20) NOT NULL,
    outside_date timestamp DEFAULT sysdate NOT NULL
);

CREATE SEQUENCE outside_sequence
START WITH 1
INCREMENT BY 1
nocache
nomaxvalue;

CREATE TABLE outside_state (
    outside_state_seq NUMBER PRIMARY KEY,
    outside_state_name varchar(20) NOT NULL
);

CREATE SEQUENCE outside_state_sequence
START WITH 1
INCREMENT BY 1
nocache
nomaxvalue;











