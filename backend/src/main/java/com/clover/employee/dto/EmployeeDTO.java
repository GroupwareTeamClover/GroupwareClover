package com.clover.employee.dto;

import java.sql.Timestamp;

public class EmployeeDTO {
    private int empSeq;
    private int empStateCode;
    private String empId;
    private String empPw;
    private String empName;
    private String empEmail;
    private int empBirth;
    private String empGender;
    private String empTel;
    private String empAddress;
    private String empAvatar;
    private int roleCode;
    private int deptCode;
    private Timestamp joinDate;
    private Timestamp leaveDate;
    private int annualLeaveDay;

    public int getEmpSeq() {
        return empSeq;
    }

    public void setEmpSeq(int empSeq) {
        this.empSeq = empSeq;
    }

    public int getEmpStateCode() {
        return empStateCode;
    }

    public void setEmpStateCode(int empStateCode) {
        this.empStateCode = empStateCode;
    }

    public String getEmpId() {
        return empId;
    }

    public void setEmpId(String empId) {
        this.empId = empId;
    }

    public String getEmpPw() {
        return empPw;
    }

    public void setEmpPw(String empPw) {
        this.empPw = empPw;
    }

    public String getEmpName() {
        return empName;
    }

    public void setEmpName(String empName) {
        this.empName = empName;
    }

    public String getEmpEmail() {
        return empEmail;
    }

    public void setEmpEmail(String empEmail) {
        this.empEmail = empEmail;
    }

    public int getEmpBirth() {
        return empBirth;
    }

    public void setEmpBirth(int empBirth) {
        this.empBirth = empBirth;
    }

    public String getEmpGender() {
        return empGender;
    }

    public void setEmpGender(String empGender) {
        this.empGender = empGender;
    }

    public String getEmpTel() {
        return empTel;
    }

    public void setEmpTel(String empTel) {
        this.empTel = empTel;
    }

    public String getEmpAddress() {
        return empAddress;
    }

    public void setEmpAddress(String empAddress) {
        this.empAddress = empAddress;
    }

    public String getEmpAvatar() {
        return empAvatar;
    }

    public void setEmpAvatar(String empAvatar) {
        this.empAvatar = empAvatar;
    }

    public int getRoleCode() {
        return roleCode;
    }

    public void setRoleCode(int roleCode) {
        this.roleCode = roleCode;
    }

    public int getDeptCode() {
        return deptCode;
    }

    public void setDeptCode(int deptCode) {
        this.deptCode = deptCode;
    }

    public Timestamp getJoinDate() {
        return joinDate;
    }

    public void setJoinDate(Timestamp joinDate) {
        this.joinDate = joinDate;
    }

    public Timestamp getLeaveDate() {
        return leaveDate;
    }

    public void setLeaveDate(Timestamp leaveDate) {
        this.leaveDate = leaveDate;
    }

    public int getAnnualLeaveDay() {
        return annualLeaveDay;
    }

    public void setAnnualLeaveDay(int annualLeaveDay) {
        this.annualLeaveDay = annualLeaveDay;
    }

    public EmployeeDTO(){}
    public EmployeeDTO(int empSeq, int empStateCode, String empId, String empPw, String empName, String empEmail, int empBirth, String empGender, String empTel, String empAddress, String empAvatar, int roleCode, int deptCode, Timestamp joinDate, Timestamp leaveDate, int annualLeaveDay) {
        this.empSeq = empSeq;
        this.empStateCode = empStateCode;
        this.empId = empId;
        this.empPw = empPw;
        this.empName = empName;
        this.empEmail = empEmail;
        this.empBirth = empBirth;
        this.empGender = empGender;
        this.empTel = empTel;
        this.empAddress = empAddress;
        this.empAvatar = empAvatar;
        this.roleCode = roleCode;
        this.deptCode = deptCode;
        this.joinDate = joinDate;
        this.leaveDate = leaveDate;
        this.annualLeaveDay = annualLeaveDay;
    }
}
