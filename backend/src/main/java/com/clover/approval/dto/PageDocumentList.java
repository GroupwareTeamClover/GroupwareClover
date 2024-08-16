package com.clover.approval.dto;

import java.util.List;

public class PageDocumentList {
	  private List<DocumentDTO> documents;
	   private int recordTotalCount;
	public PageDocumentList() {
		super();
		// TODO Auto-generated constructor stub
	}
	public PageDocumentList(List<DocumentDTO> documents, int recordTotalCount) {
		super();
		this.documents = documents;
		this.recordTotalCount = recordTotalCount;
	}
	public List<DocumentDTO> getDocuments() {
		return documents;
	}
	public void setDocuments(List<DocumentDTO> documents) {
		this.documents = documents;
	}
	public int getRecordTotalCount() {
		return recordTotalCount;
	}
	public void setRecordTotalCount(int recordTotalCount) {
		this.recordTotalCount = recordTotalCount;
	}
	   
	   
}
