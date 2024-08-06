package com.clover.approval.dto;

import java.sql.Timestamp;
import java.util.HashMap;
import java.util.Map;

public class DocumentDTO {
    protected int docSeq;
    protected int docDetailCode;
    protected int docStateCode;
    protected int drafterSeq;
    protected String egcYn;
    protected Timestamp writeDate;
    protected Timestamp finishDate;
    protected int currentApverSeq;
    protected int finalApverSeq;
    protected String docComSeq;
    private String empName;
    private String deptName;
    private String roleName;


    public DocumentDTO() {
        super();
        this.empName = "";
        this.deptName="";
        this.roleName="";
    }

    // insert용 생성자
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

    // select용 생성자
  	public DocumentDTO(int docSeq, int docDetailCode, int docStateCode, int drafterSeq, String egcYn,
  			Timestamp writeDate, Timestamp finishDate, int currentApverSeq, int finalApverSeq, String docComSeq,
  			String empName, String deptName, String roleName) {
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
  		this.empName=empName;
  		this.deptName=deptName;
  		this.roleName=roleName;
  	}

    // Getters and Setters
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
