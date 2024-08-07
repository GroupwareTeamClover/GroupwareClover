package com.clover.admin.dto;

import java.util.List;
import java.util.Map;

public class AdminAddMemDTO {
	private int dept;
	private int role;
	private int worker_state;
	private List<Integer> empSeqList;
	
	public int getDept() {
		return dept;
	}

	public void setDept(int dept) {
		this.dept = dept;
	}

	public int getRole() {
		return role;
	}

	public void setRole(int role) {
		this.role = role;
	}

	public int getWorker_state() {
		return worker_state;
	}

	public void setWorker_state(int worker_state) {
		this.worker_state = worker_state;
	}

	public List<Integer> getEmpSeqList() {
		return empSeqList;
	}

	public void setEmpSeqList(List<Integer> empSeqList) {
		this.empSeqList = empSeqList;
	}

	
	public AdminAddMemDTO(int dept, int role, int worker_state, List<Integer> empSeqList) {
		super();
		this.dept = dept;
		this.role = role;
		this.worker_state = worker_state;
		this.empSeqList = empSeqList;
	}

	public AdminAddMemDTO() {}
}
