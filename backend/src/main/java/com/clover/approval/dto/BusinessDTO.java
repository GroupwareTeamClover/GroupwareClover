// BusinessDTO.java
package com.clover.approval.dto;

import java.sql.Timestamp;
import java.util.Date;

public class BusinessDTO extends DocumentDTO {
    private int bsSeq;
    private String bsTitle;
    private String bsContent;
    private Date bsWriteDate;
    private int parentSeq;
	public BusinessDTO() {
		super();
		// TODO Auto-generated constructor stub
	}
	public BusinessDTO(int docSeq, int docDetailCode, int docStateCode, int drafterSeq, String egcYn,
			Timestamp writeDate, Timestamp finishDate, int currentApverSeq, int finalApverSeq, String docComSeq,
			String empName, String deptName, String roleName) {
		super(docSeq, docDetailCode, docStateCode, drafterSeq, egcYn, writeDate, finishDate, currentApverSeq, finalApverSeq,
				docComSeq, empName, deptName, roleName);
		// TODO Auto-generated constructor stub
	}
	public BusinessDTO(int docSeq, int docDetailCode, int docStateCode, int drafterSeq, String egcYn,
			Timestamp writeDate, Timestamp finishDate, int currentApverSeq, int finalApverSeq, String docComSeq) {
		super(docSeq, docDetailCode, docStateCode, drafterSeq, egcYn, writeDate, finishDate, currentApverSeq, finalApverSeq,
				docComSeq);
		// TODO Auto-generated constructor stub
	}
	public BusinessDTO(int bsSeq, String bsTitle, String bsContent, Date bsWriteDate, int parentSeq) {
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
	public Date getBsWriteDate() {
		return bsWriteDate;
	}
	public void setBsWriteDate(Date bsWriteDate) {
		this.bsWriteDate = bsWriteDate;
	}
	public int getParentSeq() {
		return parentSeq;
	}
	public void setParentSeq(int parentSeq) {
		this.parentSeq = parentSeq;
	}

    
	

    
}
