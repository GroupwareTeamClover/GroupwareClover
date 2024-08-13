package com.clover.admin.dto;

import java.sql.Timestamp;
import java.util.List;

public class AdminPopupDTO {
	private Integer popSeq;
	private String popTitle;
	private String empId;
	private String popContent;
	private Timestamp popWriteDate;
	private Timestamp popUpdatedDate;
	private String popIsActive;
	
	private String empName;
	
	private Integer popPeriodSeq;
	private String periodType; // 'none', 'specific', 'monthly', 'weekly'
    private String specificStartDate; // YYYY-MM-DD
    private String specificEndDate;   // YYYY-MM-DD
    private String monthlyDay;       // 1-31
    private String weeklyDay;         // 'sunday', 'monday', etc.
	
    
    
    private List<String> fileNames;
    private List<String> fileUrls;
    private List<String> images;
    
    
    
	public AdminPopupDTO(Integer popSeq, String popTitle, String empId, String popContent, Timestamp popWriteDate,
			Timestamp popUpdatedDate, String popIsActive, String empName, Integer popPeriodSeq, String periodType,
			String specificStartDate, String specificEndDate, String monthlyDay, String weeklyDay,
			List<String> fileNames, List<String> fileUrls, List<String> images) {
		super();
		this.popSeq = popSeq;
		this.popTitle = popTitle;
		this.empId = empId;
		this.popContent = popContent;
		this.popWriteDate = popWriteDate;
		this.popUpdatedDate = popUpdatedDate;
		this.popIsActive = popIsActive;
		this.empName = empName;
		this.popPeriodSeq = popPeriodSeq;
		this.periodType = periodType;
		this.specificStartDate = specificStartDate;
		this.specificEndDate = specificEndDate;
		this.monthlyDay = monthlyDay;
		this.weeklyDay = weeklyDay;
		this.fileNames = fileNames;
		this.fileUrls = fileUrls;
		this.images = images;
	}

	public List<String> getFileNames() {
		return fileNames;
	}

	public void setFileNames(List<String> fileNames) {
		this.fileNames = fileNames;
	}

	public List<String> getFileUrls() {
		return fileUrls;
	}

	public void setFileUrls(List<String> fileUrls) {
		this.fileUrls = fileUrls;
	}

	public List<String> getImages() {
		return images;
	}

	public void setImages(List<String> images) {
		this.images = images;
	}

	public String getEmpName() {
		return empName;
	}

	public void setEmpName(String empName) {
		this.empName = empName;
	}

	public Integer getPopSeq() {
		return popSeq;
	}

	public void setPopSeq(Integer popSeq) {
		this.popSeq = popSeq;
	}

	public String getPopTitle() {
		return popTitle;
	}

	public void setPopTitle(String popTitle) {
		this.popTitle = popTitle;
	}

	public String getEmpId() {
		return empId;
	}

	public void setEmpId(String empId) {
		this.empId = empId;
	}

	public String getPopContent() {
		return popContent;
	}

	public void setPopContent(String popContent) {
		this.popContent = popContent;
	}

	public Timestamp getPopWriteDate() {
		return popWriteDate;
	}

	public void setPopWriteDate(Timestamp popWriteDate) {
		this.popWriteDate = popWriteDate;
	}

	public Timestamp getPopUpdatedDate() {
		return popUpdatedDate;
	}

	public void setPopUpdatedDate(Timestamp popUpdatedDate) {
		this.popUpdatedDate = popUpdatedDate;
	}

	public String getPopIsActive() {
		return popIsActive;
	}

	public void setPopIsActive(String popIsActive) {
		this.popIsActive = popIsActive;
	}

	public Integer getPopPeriodSeq() {
		return popPeriodSeq;
	}

	public void setPopPeriodSeq(Integer popPeriodSeq) {
		this.popPeriodSeq = popPeriodSeq;
	}

	public String getPeriodType() {
		return periodType;
	}

	public void setPeriodType(String periodType) {
		this.periodType = periodType;
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

	public String getMonthlyDay() {
		return monthlyDay;
	}

	public void setMonthlyDay(String monthlyDay) {
		this.monthlyDay = monthlyDay;
	}

	public String getWeeklyDay() {
		return weeklyDay;
	}

	public void setWeeklyDay(String weeklyDay) {
		this.weeklyDay = weeklyDay;
	}


	public AdminPopupDTO(Integer popSeq, String popTitle, String empId, String popContent, Timestamp popWriteDate,
			Timestamp popUpdatedDate, String popIsActive, String empName, Integer popPeriodSeq, String periodType,
			String specificStartDate, String specificEndDate, String monthlyDay, String weeklyDay) {
		super();
		this.popSeq = popSeq;
		this.popTitle = popTitle;
		this.empId = empId;
		this.popContent = popContent;
		this.popWriteDate = popWriteDate;
		this.popUpdatedDate = popUpdatedDate;
		this.popIsActive = popIsActive;
		this.empName = empName;
		this.popPeriodSeq = popPeriodSeq;
		this.periodType = periodType;
		this.specificStartDate = specificStartDate;
		this.specificEndDate = specificEndDate;
		this.monthlyDay = monthlyDay;
		this.weeklyDay = weeklyDay;
	}

	public AdminPopupDTO() {
		super();
	}

    
}
