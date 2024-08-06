// DayoffDTO.java
package com.clover.approval.dto;

import java.sql.Timestamp;
import java.util.Date;

public class DayoffDTO extends DocumentDTO {
    private int dayoffSeq;
    private int dayoffCode;
    private Date startDate;
    private Date endDate;
    private String dayoffHalf;
    private String halfType;
    private int parentSeq;
	public DayoffDTO() {
		super();
		// TODO Auto-generated constructor stub
	}
	public DayoffDTO(int docSeq, int docDetailCode, int docStateCode, int drafterSeq, String egcYn, Timestamp writeDate,
			Timestamp finishDate, int currentApverSeq, int finalApverSeq, String docComSeq, String empName,
			String deptName, String roleName) {
		super(docSeq, docDetailCode, docStateCode, drafterSeq, egcYn, writeDate, finishDate, currentApverSeq, finalApverSeq,
				docComSeq, empName, deptName, roleName);
		// TODO Auto-generated constructor stub
	}
	public DayoffDTO(int docSeq, int docDetailCode, int docStateCode, int drafterSeq, String egcYn, Timestamp writeDate,
			Timestamp finishDate, int currentApverSeq, int finalApverSeq, String docComSeq) {
		super(docSeq, docDetailCode, docStateCode, drafterSeq, egcYn, writeDate, finishDate, currentApverSeq, finalApverSeq,
				docComSeq);
		// TODO Auto-generated constructor stub
	}
	public DayoffDTO(int dayoffSeq, int dayoffCode, Date startDate, Date endDate, String dayoffHalf, String halfType,
			int parentSeq) {
		super();
		this.dayoffSeq = dayoffSeq;
		this.dayoffCode = dayoffCode;
		this.startDate = startDate;
		this.endDate = endDate;
		this.dayoffHalf = dayoffHalf;
		this.halfType = halfType;
		this.parentSeq = parentSeq;
	}
	public int getDayoffSeq() {
		return dayoffSeq;
	}
	public void setDayoffSeq(int dayoffSeq) {
		this.dayoffSeq = dayoffSeq;
	}
	public int getDayoffCode() {
		return dayoffCode;
	}
	public void setDayoffCode(int dayoffCode) {
		this.dayoffCode = dayoffCode;
	}
	public Date getStartDate() {
		return startDate;
	}
	public void setStartDate(Date startDate) {
		this.startDate = startDate;
	}
	public Date getEndDate() {
		return endDate;
	}
	public void setEndDate(Date endDate) {
		this.endDate = endDate;
	}
	public String getDayoffHalf() {
		return dayoffHalf;
	}
	public void setDayoffHalf(String dayoffHalf) {
		this.dayoffHalf = dayoffHalf;
	}
	public String getHalfType() {
		return halfType;
	}
	public void setHalfType(String halfType) {
		this.halfType = halfType;
	}
	public int getParentSeq() {
		return parentSeq;
	}
	public void setParentSeq(int parentSeq) {
		this.parentSeq = parentSeq;
	}
    
	
	
    
    

    
}
