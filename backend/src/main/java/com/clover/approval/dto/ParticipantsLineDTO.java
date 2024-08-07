package com.clover.approval.dto;

import java.sql.Timestamp;

public class ParticipantsLineDTO {
	private int lineSeq;
	private int empSeq;
	private String pcpDivision;
	private String readYN;
	private Timestamp readDate;
	private int docSeq;
	private String empName;
	private String deptName;
	private String roleName;
	
	public ParticipantsLineDTO() {
		super();
		// TODO Auto-generated constructor stub
	}
	
	//insert용
	public ParticipantsLineDTO(int lineSeq, int empSeq, String pcpDivision, String readYN, Timestamp readDate,
			int docSeq) {
		super();
		this.lineSeq = lineSeq;
		this.empSeq = empSeq;
		this.pcpDivision = pcpDivision;
		this.readYN = readYN;
		this.readDate = readDate;
		this.docSeq = docSeq;
	}
	
	//select용
	public ParticipantsLineDTO(int lineSeq, int empSeq, String pcpDivision, String readYN, Timestamp readDate,
			int docSeq, String empName, String deptName, String roleName) {
		super();
		this.lineSeq = lineSeq;
		this.empSeq = empSeq;
		this.pcpDivision = pcpDivision;
		this.readYN = readYN;
		this.readDate = readDate;
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
	public int getEmpSeq() {
		return empSeq;
	}
	public void setEmpSeq(int empSeq) {
		this.empSeq = empSeq;
	}
	public String getPcpDivision() {
		return pcpDivision;
	}
	public void setPcpDivision(String pcpDivision) {
		this.pcpDivision = pcpDivision;
	}
	public String getReadYN() {
		return readYN;
	}
	public void setReadYN(String readYN) {
		this.readYN = readYN;
	}
	public Timestamp getReadDate() {
		return readDate;
	}
	public void setReadDate(Timestamp readDate) {
		this.readDate = readDate;
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
