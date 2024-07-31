package com.clover.attendance.dto;

import java.sql.Timestamp;

public class AttendanceDTO {

    private int attSeq;
    private int empSeq;
    private String attArrive;
    private String attLeave;
    private int attTotal;
    private String attSuccess;
    private Timestamp attDate;

    public AttendanceDTO(){}

    public AttendanceDTO(int attSeq, int empSeq, String attArrive, String attLeave, int attTotal, String attSuccess, Timestamp attDate) {
        this.attSeq = attSeq;
        this.empSeq = empSeq;
        this.attArrive = attArrive;
        this.attLeave = attLeave;
        this.attTotal = attTotal;
        this.attSuccess = attSuccess;
        this.attDate = attDate;
    }

    public int getAttSeq() {
        return attSeq;
    }

    public void setAttSeq(int attSeq) {
        this.attSeq = attSeq;
    }

    public int getEmpSeq() {
        return empSeq;
    }

    public void setEmpSeq(int empSeq) {
        this.empSeq = empSeq;
    }

    public String getAttArrive() {
        return attArrive;
    }

    public void setAttArrive(String attArrive) {
        this.attArrive = attArrive;
    }

    public String getAttLeave() {
        return attLeave;
    }

    public void setAttLeave(String attLeave) {
        this.attLeave = attLeave;
    }

    public int getAttTotal() {
        return attTotal;
    }

    public void setAttTotal(int attTotal) {
        this.attTotal = attTotal;
    }

    public String getAttSuccess() {
        return attSuccess;
    }

    public void setAttSuccess(String attSuccess) {
        this.attSuccess = attSuccess;
    }

    public Timestamp getAttDate() {
        return attDate;
    }

    public void setAttDate(Timestamp attDate) {
        this.attDate = attDate;
    }
}
