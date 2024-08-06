package com.clover.approval.dto;

public class TotalLineEmpInfo {
	private String type;
	private int seq;
	private String name;
	private String dept;
	private String role;
	
	public TotalLineEmpInfo() {
		super();
		// TODO Auto-generated constructor stub
	}
	
	public TotalLineEmpInfo(String type, int seq, String name, String dept, String role) {
		super();
		this.type = type;
		this.seq = seq;
		this.name = name;
		this.dept = dept;
		this.role = role;
	}
	
	public String getType() {
		return type;
	}
	public void setType(String type) {
		this.type = type;
	}
	public int getSeq() {
		return seq;
	}
	public void setSeq(int seq) {
		this.seq = seq;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getDept() {
		return dept;
	}
	public void setDept(String dept) {
		this.dept = dept;
	}
	public String getRole() {
		return role;
	}
	public void setRole(String role) {
		this.role = role;
	}
	
	

}
