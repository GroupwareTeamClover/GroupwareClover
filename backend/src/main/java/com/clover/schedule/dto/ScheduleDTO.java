package com.clover.schedule.dto;

import java.sql.Timestamp;

public class ScheduleDTO {
    private int scheduleSeq;
    private String scheduleContent;
    private int empSeq;
    private String empName;
    private int deptCode;
    private Timestamp startDate;
    private Timestamp endDate;

    public int getScheduleSeq() {
        return scheduleSeq;
    }

    public void setScheduleSeq(int scheduleSeq) {
        this.scheduleSeq = scheduleSeq;
    }

    public String getScheduleContent() {
        return scheduleContent;
    }

    public void setScheduleContent(String scheduleContent) {
        this.scheduleContent = scheduleContent;
    }

    public int getEmpSeq() {
        return empSeq;
    }

    public void setEmpSeq(int empSeq) {
        this.empSeq = empSeq;
    }

    public String getEmpName() {
        return empName;
    }

    public void setEmpName(String empName) {
        this.empName = empName;
    }

    public int getDeptCode() {
        return deptCode;
    }

    public void setDeptCode(int deptCode) {
        this.deptCode = deptCode;
    }

    public Timestamp getStartDate() {
        return startDate;
    }

    public void setStartDate(Timestamp startDate) {
        this.startDate = startDate;
    }

    public Timestamp getEndDate() {
        return endDate;
    }

    public void setEndDate(Timestamp endDate) {
        this.endDate = endDate;
    }

    public ScheduleDTO(){}
    public ScheduleDTO(int scheduleSeq, String scheduleContent, int empSeq, int deptCode, Timestamp startDate, Timestamp endDate) {
        this.scheduleSeq = scheduleSeq;
        this.scheduleContent = scheduleContent;
        this.empSeq = empSeq;
        this.empName = null;
        this.deptCode = deptCode;
        this.startDate = startDate;
        this.endDate = endDate;
    }
    public ScheduleDTO(int scheduleSeq, String scheduleContent, int empSeq, String empName, int deptCode, Timestamp startDate, Timestamp endDate) {
        this.scheduleSeq = scheduleSeq;
        this.scheduleContent = scheduleContent;
        this.empSeq = empSeq;
        this.empName = empName;
        this.deptCode = deptCode;
        this.startDate = startDate;
        this.endDate = endDate;
    }
}
