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
	private String empName;
	private String deptName;
	private String roleName;
	
	public ApvLineDTO() {
		super();
		// TODO Auto-generated constructor stub
	}
	
	//insert용
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
	
	
	//select용
	public ApvLineDTO(int lineSeq, int apvStatusCode, int apverId, String lineApverCmt, int lineOrder,
			Timestamp lineApvDate, int docSeq, String empName, String deptName, String roleName) {
		super();
		this.lineSeq = lineSeq;
		this.apvStatusCode = apvStatusCode;
		this.apverId = apverId;
		this.lineApverCmt = lineApverCmt;
		this.lineOrder = lineOrder;
		this.lineApvDate = lineApvDate;
		this.docSeq = docSeq;
		this.empName = empName;
		this.deptName = deptName;
		this.roleName = roleName;
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

	public String getEmpName() {
		return empName;
	}

	public void setEmpName(String empName) {
		this.empName = empName;
	}

	public String getDeptName() {
		return deptName;
	}

	public void setDeptName(String deptName) {
		this.deptName = deptName;
	}

	public String getRoleName() {
		return roleName;
	}

	public void setRoleName(String roleName) {
		this.roleName = roleName;
	}
	


}
