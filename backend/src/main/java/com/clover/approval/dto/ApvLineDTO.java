package com.clover.approval.dto;

import java.sql.Timestamp;

public class ApvLineDTO {
	private int lineSeq;
	private int apvStatusCode;
	private int apverId;
	private String lineApverCmt;
	private int lineOrder;
	private Timestamp lineApvDate;
	private int docSeq;
	
	public ApvLineDTO() {
		super();
		// TODO Auto-generated constructor stub
	}
	public ApvLineDTO(int lineSeq, int apvStatusCode, int apverId, String lineApverCmt, int lineOrder,
			Timestamp lineApvDate, int docSeq) {
		super();
		this.lineSeq = lineSeq;
		this.apvStatusCode = apvStatusCode;
		this.apverId = apverId;
		this.lineApverCmt = lineApverCmt;
		this.lineOrder = lineOrder;
		this.lineApvDate = lineApvDate;
		this.docSeq = docSeq;
	}
	public int getLineSeq() {
		return lineSeq;
	}
	public void setLineSeq(int lineSeq) {
		this.lineSeq = lineSeq;
	}
	public int getApvStatusCode() {
		return apvStatusCode;
	}
	public void setApvStatusCode(int apvStatusCode) {
		this.apvStatusCode = apvStatusCode;
	}
	public int getApverId() {
		return apverId;
	}
	public void setApverId(int apverId) {
		this.apverId = apverId;
	}
	public String getLineApverCmt() {
		return lineApverCmt;
	}
	public void setLineApverCmt(String lineApverCmt) {
		this.lineApverCmt = lineApverCmt;
	}
	public int getLineOrder() {
		return lineOrder;
	}
	public void setLineOrder(int lineOrder) {
		this.lineOrder = lineOrder;
	}
	public Timestamp getLineApvDate() {
		return lineApvDate;
	}
	public void setLineApvDate(Timestamp lineApvDate) {
		this.lineApvDate = lineApvDate;
	}
	public int getDocSeq() {
		return docSeq;
	}
	public void setDocSeq(int docSeq) {
		this.docSeq = docSeq;
	}
	
	

}
