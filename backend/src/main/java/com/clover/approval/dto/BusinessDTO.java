// BusinessDTO.java
package com.clover.approval.dto;

import java.sql.Timestamp;

import com.fasterxml.jackson.annotation.JsonIgnore;

public class BusinessDTO extends DocumentDTO {
    private int bsSeq;
    private String bsTitle;
    private String bsContent;
    private Timestamp bsWriteDate;
    private int parentSeq;
	public BusinessDTO() {
		super();
		// TODO Auto-generated constructor stub
	}
	public BusinessDTO(int docSeq, int docDetailCode, int docStateCode, int drafterSeq, String egcYn,
			Timestamp writeTimestamp, Timestamp finishTimestamp, int currentApverSeq, int finalApverSeq, String docComSeq,
			String empName, String deptName, String roleName) {
		super(docSeq, docDetailCode, docStateCode, drafterSeq, egcYn, writeTimestamp, finishTimestamp, currentApverSeq, finalApverSeq,
				docComSeq, empName, deptName, roleName);
		// TODO Auto-generated constructor stub
	}
	public BusinessDTO(int docSeq, int docDetailCode, int docStateCode, int drafterSeq, String egcYn,
			Timestamp writeTimestamp, Timestamp finishTimestamp, int currentApverSeq, int finalApverSeq, String docComSeq) {
		super(docSeq, docDetailCode, docStateCode, drafterSeq, egcYn, writeTimestamp, finishTimestamp, currentApverSeq, finalApverSeq,
				docComSeq);
		// TODO Auto-generated constructor stub
	}
	public BusinessDTO(int bsSeq, String bsTitle, String bsContent, Timestamp bsWriteDate, int parentSeq) {
		super();
		this.bsSeq = bsSeq;
		this.bsTitle = bsTitle;
		this.bsContent = bsContent;
		this.bsWriteDate = bsWriteDate;
		this.parentSeq = parentSeq;
	}
	public int getBsSeq() {
		return bsSeq;
	}
	public void setBsSeq(int bsSeq) {
		this.bsSeq = bsSeq;
	}
	public String getBsTitle() {
		return bsTitle;
	}
	public void setBsTitle(String bsTitle) {
		this.bsTitle = bsTitle;
	}
	public String getBsContent() {
		return bsContent;
	}
	public void setBsContent(String bsContent) {
		this.bsContent = bsContent;
	}
	public Timestamp getBsWriteDate() {
		return bsWriteDate;
	}
	public void setBsWriteDate(Timestamp bsWriteDate) {
		this.bsWriteDate = bsWriteDate;
	}
	public int getParentSeq() {
		return parentSeq;
	}
	public void setParentSeq(int parentSeq) {
		this.parentSeq = parentSeq;
	}

    
	

    
}
