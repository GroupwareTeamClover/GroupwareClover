package com.clover.admin.dto;

import java.util.List;
import java.util.Map;

public class AdminUpdateMemDTO {
	private Map<String, Object> updateMems;
	private String newValue;
	private List<Integer> empSeqList;
	
	public AdminUpdateMemDTO() {}

	public AdminUpdateMemDTO(Map<String, Object> updateMems, String newValue, List<Integer> empSeqList) {
		super();
		this.updateMems = updateMems;
		this.newValue = newValue;
		this.empSeqList = empSeqList;
	}

	public Map<String, Object> getUpdateMems() {
		return updateMems;
	}

	public void setUpdateMems(Map<String, Object> updateMems) {
		this.updateMems = updateMems;
	}

	public String getNewValue() {
		return newValue;
	}

	public void setNewValue(String newValue) {
		this.newValue = newValue;
	}

	public List<Integer> getEmpSeqList() {
		return empSeqList;
	}

	public void setEmpSeqList(List<Integer> empSeqList) {
		this.empSeqList = empSeqList;
	}
	
	
	
}
