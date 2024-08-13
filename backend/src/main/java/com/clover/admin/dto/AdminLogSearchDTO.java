package com.clover.admin.dto;

public class AdminLogSearchDTO {
	private String empName; 
	private String empId;
	private String logStatus; 
	private String specificStartDate; 
	private String specificEndDate;
	
	public AdminLogSearchDTO() {}
	
	public AdminLogSearchDTO(String empName, String empId, String logStatus, String specificStartDate,
			String specificEndDate) {
		super();
		this.empName = empName;
		this.empId = empId;
		this.logStatus = logStatus;
		this.specificStartDate = specificStartDate;
		this.specificEndDate = specificEndDate;
	}

	public String getEmpName() {
		return empName;
	}

	public void setEmpName(String empName) {
		this.empName = empName;
	}

	public String getEmpId() {
		return empId;
	}

	public void setEmpId(String empId) {
		this.empId = empId;
	}

	public String getLogStatus() {
		return logStatus;
	}

	public void setLogStatus(String logStatus) {
		this.logStatus = logStatus;
	}

	public String getSpecificStartDate() {
		return specificStartDate;
	}

	public void setSpecificStartDate(String specificStartDate) {
		this.specificStartDate = specificStartDate;
	}

	public String getSpecificEndDate() {
		return specificEndDate;
	}

	public void setSpecificEndDate(String specificEndDate) {
		this.specificEndDate = specificEndDate;
	}
	
	
	
}
