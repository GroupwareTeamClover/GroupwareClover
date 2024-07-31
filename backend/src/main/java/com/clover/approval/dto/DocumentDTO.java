package com.clover.approval.dto;

import java.sql.Timestamp;

public class DocumentDTO {
	private int docSeq;
	private int docDetailCode;
	private int docStateCode;
	private int drafterSeq;
	private String egcYn;
	private Timestamp writeDate;
	private Timestamp finishDate;
	private int currentApverSeq;
	private int finalApverSeq;
	private String docComSeq;
	public DocumentDTO() {
		super();
		// TODO Auto-generated constructor stub
	}
	public DocumentDTO(int docSeq, int docDetailCode, int docStateCode, int drafterSeq, String egcYn,
			Timestamp writeDate, Timestamp finishDate, int currentApverSeq, int finalApverSeq, String docComSeq) {
		super();
		this.docSeq = docSeq;
		this.docDetailCode = docDetailCode;
		this.docStateCode = docStateCode;
		this.drafterSeq = drafterSeq;
		this.egcYn = egcYn;
		this.writeDate = writeDate;
		this.finishDate = finishDate;
		this.currentApverSeq = currentApverSeq;
		this.finalApverSeq = finalApverSeq;
		this.docComSeq = docComSeq;
	}
	public int getDocSeq() {
		return docSeq;
	}
	public void setDocSeq(int docSeq) {
		this.docSeq = docSeq;
	}
	public int getDocDetailCode() {
		return docDetailCode;
	}
	public void setDocDetailCode(int docDetailCode) {
		this.docDetailCode = docDetailCode;
	}
	public int getDocStateCode() {
		return docStateCode;
	}
	public void setDocStateCode(int docStateCode) {
		this.docStateCode = docStateCode;
	}
	public int getDrafterSeq() {
		return drafterSeq;
	}
	public void setDrafterSeq(int drafterSeq) {
		this.drafterSeq = drafterSeq;
	}
	public String getEgcYn() {
		return egcYn;
	}
	public void setEgcYn(String egcYn) {
		this.egcYn = egcYn;
	}
	public Timestamp getWriteDate() {
		return writeDate;
	}
	public void setWriteDate(Timestamp writeDate) {
		this.writeDate = writeDate;
	}
	public Timestamp getFinishDate() {
		return finishDate;
	}
	public void setFinishDate(Timestamp finishDate) {
		this.finishDate = finishDate;
	}
	public int getCurrentApverSeq() {
		return currentApverSeq;
	}
	public void setCurrentApverSeq(int currentApverSeq) {
		this.currentApverSeq = currentApverSeq;
	}
	public int getFinalApverSeq() {
		return finalApverSeq;
	}
	public void setFinalApverSeq(int finalApverSeq) {
		this.finalApverSeq = finalApverSeq;
	}
	public String getDocComSeq() {
		return docComSeq;
	}
	public void setDocComSeq(String docComSeq) {
		this.docComSeq = docComSeq;
	}
	
	

}
