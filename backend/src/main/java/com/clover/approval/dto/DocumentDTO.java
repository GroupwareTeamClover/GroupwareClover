package com.clover.approval.dto;

import java.sql.Timestamp;

public class DocumentDTO {
	private int doc_seq;
	private int doc_detail_code;
	private int doc_state_code;
	private int drafter_seq;
	private String egc_yn;
	private Timestamp write_date;
	private Timestamp finish_date;
	private int current_apver_seq;
	private int final_apver_seq;
	private String doc_com_seq;
	
	public DocumentDTO() {
		super();
		// TODO Auto-generated constructor stub
	}
	
	public DocumentDTO(int doc_seq, int doc_detail_code, int doc_state_code, int drafter_seq, String egc_yn,
			Timestamp write_date, Timestamp finish_date, int current_apver_seq, int final_apver_seq,
			String doc_com_seq) {
		super();
		this.doc_seq = doc_seq;
		this.doc_detail_code = doc_detail_code;
		this.doc_state_code = doc_state_code;
		this.drafter_seq = drafter_seq;
		this.egc_yn = egc_yn;
		this.write_date = write_date;
		this.finish_date = finish_date;
		this.current_apver_seq = current_apver_seq;
		this.final_apver_seq = final_apver_seq;
		this.doc_com_seq = doc_com_seq;
	}
	public int getDoc_seq() {
		return doc_seq;
	}
	public void setDoc_seq(int doc_seq) {
		this.doc_seq = doc_seq;
	}
	public int getDoc_detail_code() {
		return doc_detail_code;
	}
	public void setDoc_detail_code(int doc_detail_code) {
		this.doc_detail_code = doc_detail_code;
	}
	public int getDoc_state_code() {
		return doc_state_code;
	}
	public void setDoc_state_code(int doc_state_code) {
		this.doc_state_code = doc_state_code;
	}
	public int getDrafter_seq() {
		return drafter_seq;
	}
	public void setDrafter_seq(int drafter_seq) {
		this.drafter_seq = drafter_seq;
	}
	public String getEgc_yn() {
		return egc_yn;
	}
	public void setEgc_yn(String egc_yn) {
		this.egc_yn = egc_yn;
	}
	public Timestamp getWrite_date() {
		return write_date;
	}
	public void setWrite_date(Timestamp write_date) {
		this.write_date = write_date;
	}
	public Timestamp getFinish_date() {
		return finish_date;
	}
	public void setFinish_date(Timestamp finish_date) {
		this.finish_date = finish_date;
	}
	public int getCurrent_apver_seq() {
		return current_apver_seq;
	}
	public void setCurrent_apver_seq(int current_apver_seq) {
		this.current_apver_seq = current_apver_seq;
	}
	public int getFinal_apver_seq() {
		return final_apver_seq;
	}
	public void setFinal_apver_seq(int final_apver_seq) {
		this.final_apver_seq = final_apver_seq;
	}
	public String getDoc_com_seq() {
		return doc_com_seq;
	}
	public void setDoc_com_seq(String doc_com_seq) {
		this.doc_com_seq = doc_com_seq;
	}
	
	

}
