package com.clover.approval.dto;

import java.util.List;
import java.util.Map;

import com.fasterxml.jackson.databind.JsonNode;

public class InsertMappingDTO {
    private DocumentDTO document; 
    private List<ApvLineDTO> apvline;
    private List<ParticipantsLineDTO> pline;
    private String docType;
    private Map<String, Object> docData;
    
	public InsertMappingDTO() {
		super();
		// TODO Auto-generated constructor stub
	}
	
	//insert용
	public InsertMappingDTO(DocumentDTO document, List<ApvLineDTO> apvline, List<ParticipantsLineDTO> pline,
			String docType, Map<String, Object> docData) {
		super();
		this.document = document;
		this.apvline = apvline;
		this.pline = pline;
		this.docType = docType;
		this.docData = docData;
	}
	
	//select용
	public InsertMappingDTO(DocumentDTO document, List<ApvLineDTO> apvline, List<ParticipantsLineDTO> pline) {
		super();
		this.document = document;
		this.apvline = apvline;
		this.pline = pline;
	}
	
	public DocumentDTO getDocument() {
		return document;
	}
	public void setDocument(DocumentDTO document) {
		this.document = document;
	}
	public List<ApvLineDTO> getApvline() {
		return apvline;
	}
	public void setApvline(List<ApvLineDTO> apvline) {
		this.apvline = apvline;
	}
	public List<ParticipantsLineDTO> getPline() {
		return pline;
	}
	public void setPline(List<ParticipantsLineDTO> pline) {
		this.pline = pline;
	}
	public String getDocType() {
		return docType;
	}
	public void setDocType(String docType) {
		this.docType = docType;
	}
	public Map<String, Object> getDocData() {
		return docData;
	}
	public void setDocData(Map<String, Object> docData) {
		this.docData = docData;
	}

}

	

