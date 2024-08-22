package com.clover.admin.dto;

import java.time.LocalDateTime;

public class AdminLogDTO {
	private int logSeq; 
	private int empSeq;
	private String empName;
	private String empId;
	private int deptCode;
	private String clientIp;
	private LocalDateTime localLogTime;
	private String logStatus;
	private String deptName;
	
	public AdminLogDTO() {}

	

	public AdminLogDTO(int logSeq, int empSeq, String empName, String empId, int deptCode, String clientIp,
			LocalDateTime localLogTime, String logStatus, String deptName) {
		super();
		this.logSeq = logSeq;
		this.empSeq = empSeq;
		this.empName = empName;
		this.empId = empId;
		this.deptCode = deptCode;
		this.clientIp = clientIp;
		this.localLogTime = localLogTime;
		this.logStatus = logStatus;
		this.deptName = deptName;
	}



	public String getDeptName() {
		return deptName;
	}



	public void setDeptName(String deptName) {
		this.deptName = deptName;
	}



	public int getLogSeq() {
		return logSeq;
	}

	public void setLogSeq(int logSeq) {
		this.logSeq = logSeq;
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
	
	

	public String getEmpId() {
		return empId;
	}

	public void setEmpId(String empId) {
		this.empId = empId;
	}

	public void setDeptCode(int deptCode) {
		this.deptCode = deptCode;
	}

	public String getClientIp() {
		return clientIp;
	}

	public void setClientIp(String clientIp) {
		this.clientIp = clientIp;
	}

	public LocalDateTime getLocalLogTime() {
		return localLogTime;
	}

	public void setLocalLogTime(LocalDateTime localLogTime) {
		this.localLogTime = localLogTime;
	}

	public String getLogStatus() {
		return logStatus;
	}

	public void setLogStatus(String logStatus) {
		this.logStatus = logStatus;
	}
	
	
	
}
