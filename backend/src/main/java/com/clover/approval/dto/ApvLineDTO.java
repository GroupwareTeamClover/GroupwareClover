package com.clover.approval.dto;

import java.sql.Timestamp;

public class ApvLineDTO {
	private int line_seq;
	private int apv_status_code;
	private int apver_id;
	private String line_apver_cmt;
	private int line_order;
	private Timestamp line_apv_date;
	private int doc_seq;
	
	public ApvLineDTO() {
		super();
		// TODO Auto-generated constructor stub
	}
	public ApvLineDTO(int line_seq, int apv_status_code, int apver_id, String line_apver_cmt, int line_order,
			Timestamp line_apv_date, int doc_seq) {
		super();
		this.line_seq = line_seq;
		this.apv_status_code = apv_status_code;
		this.apver_id = apver_id;
		this.line_apver_cmt = line_apver_cmt;
		this.line_order = line_order;
		this.line_apv_date = line_apv_date;
		this.doc_seq = doc_seq;
	}
	public int getLine_seq() {
		return line_seq;
	}
	public void setLine_seq(int line_seq) {
		this.line_seq = line_seq;
	}
	public int getApv_status_code() {
		return apv_status_code;
	}
	public void setApv_status_code(int apv_status_code) {
		this.apv_status_code = apv_status_code;
	}
	public int getApver_id() {
		return apver_id;
	}
	public void setApver_id(int apver_id) {
		this.apver_id = apver_id;
	}
	public String getLine_apver_cmt() {
		return line_apver_cmt;
	}
	public void setLine_apver_cmt(String line_apver_cmt) {
		this.line_apver_cmt = line_apver_cmt;
	}
	public int getLine_order() {
		return line_order;
	}
	public void setLine_order(int line_order) {
		this.line_order = line_order;
	}
	public Timestamp getLine_apv_date() {
		return line_apv_date;
	}
	public void setLine_apv_date(Timestamp line_apv_date) {
		this.line_apv_date = line_apv_date;
	}
	public int getDoc_seq() {
		return doc_seq;
	}
	public void setDoc_seq(int doc_seq) {
		this.doc_seq = doc_seq;
	}
	
	
	

}
