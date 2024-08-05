package com.clover.admin.dto;

import java.sql.Timestamp;

public class AdminPopupDTO {
	private int popSeq;
	private String popTitle;
	private String popWriter;
	private String popContent;
	private Timestamp popWriteDate;
	private Timestamp popUpdatedDate;
	private char popIsActive;
	
	private String periodType; // 'none', 'specific', 'monthly', 'weekly'
    private Timestamp specificStartDate; // YYYY-MM-DD
    private Timestamp specificEndDate;   // YYYY-MM-DD
    private int monthlyDay;       // 1-31
    private String weeklyDay;         // 'sunday', 'monday', etc.
	public int getPopSeq() {
		return popSeq;
	}
	public void setPopSeq(int popSeq) {
		this.popSeq = popSeq;
	}
	public String getPopTitle() {
		return popTitle;
	}
	public void setPopTitle(String popTitle) {
		this.popTitle = popTitle;
	}
	public String getPopWriter() {
		return popWriter;
	}
	public void setPopWriter(String popWriter) {
		this.popWriter = popWriter;
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
	public char getPopIsActive() {
		return popIsActive;
	}
	public void setPopIsActive(char popIsActive) {
		this.popIsActive = popIsActive;
	}
	public String getPeriodType() {
		return periodType;
	}
	public void setPeriodType(String periodType) {
		this.periodType = periodType;
	}
	public Timestamp getSpecificStartDate() {
		return specificStartDate;
	}
	public void setSpecificStartDate(Timestamp specificStartDate) {
		this.specificStartDate = specificStartDate;
	}
	public Timestamp getSpecificEndDate() {
		return specificEndDate;
	}
	public void setSpecificEndDate(Timestamp specificEndDate) {
		this.specificEndDate = specificEndDate;
	}
	public int getMonthlyDay() {
		return monthlyDay;
	}
	public void setMonthlyDay(int monthlyDay) {
		this.monthlyDay = monthlyDay;
	}
	public String getWeeklyDay() {
		return weeklyDay;
	}
	public void setWeeklyDay(String weeklyDay) {
		this.weeklyDay = weeklyDay;
	}
	public AdminPopupDTO(int popSeq, String popTitle, String popWriter, String popContent, Timestamp popWriteDate,
			Timestamp popUpdatedDate, char popIsActive, String periodType, Timestamp specificStartDate,
			Timestamp specificEndDate, int monthlyDay, String weeklyDay) {
		super();
		this.popSeq = popSeq;
		this.popTitle = popTitle;
		this.popWriter = popWriter;
		this.popContent = popContent;
		this.popWriteDate = popWriteDate;
		this.popUpdatedDate = popUpdatedDate;
		this.popIsActive = popIsActive;
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
