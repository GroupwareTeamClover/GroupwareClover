package com.clover.admin.dto;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;

public class AdminPopupUpdateDTO {
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
	
    
    
    private List<String> deleteFileUrls; 
    private List<String> addFileNames; 
    private List<String> addFileUrls;
    private List<String> deleteImageUrls; 
    private List<String> addImageUrls;
    
    
    public AdminPopupUpdateDTO() {}
    
    
	public AdminPopupUpdateDTO(Integer popSeq, String popTitle, String empId, String popContent, Timestamp popWriteDate,
			Timestamp popUpdatedDate, String popIsActive, String empName, Integer popPeriodSeq, String periodType,
			String specificStartDate, String specificEndDate, String monthlyDay, String weeklyDay,
			List<String> deleteFileUrls, List<String> addFileNames, List<String> addFileUrls,
			List<String> deleteImageUrls, List<String> addImageUrls) {
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
		this.deleteFileUrls = deleteFileUrls;
		this.addFileNames = addFileNames;
		this.addFileUrls = addFileUrls;
		this.deleteImageUrls = deleteImageUrls;
		this.addImageUrls = addImageUrls;
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
	public String getEmpName() {
		return empName;
	}
	public void setEmpName(String empName) {
		this.empName = empName;
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
	
	public List<String> getDeleteFileUrls() {
		return deleteFileUrls;
	}
	public void setDeleteFileUrls(List<String> deleteFileUrls) {
		this.deleteFileUrls = deleteFileUrls;
	}
	public List<String> getAddFileNames() {
		return addFileNames;
	}
	public void setAddFileNames(List<String> addFileNames) {
		this.addFileNames = addFileNames;
	}
	public List<String> getAddFileUrls() {
		return addFileUrls;
	}
	public void setAddFileUrls(List<String> addFileUrls) {
		this.addFileUrls = addFileUrls;
	}
	public List<String> getDeleteImageUrls() {
		return deleteImageUrls;
	}
	public void setDeleteImageUrls(List<String> deleteImageUrls) {
		this.deleteImageUrls = deleteImageUrls;
	}
	public List<String> getAddImageUrls() {
		return addImageUrls;
	}
	public void setAddImageUrls(List<String> addImageUrls) {
		this.addImageUrls = addImageUrls;
	}
    
}
