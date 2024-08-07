package com.clover.approval.dto;

import java.util.List;

public class ListMappingDTO {
    private List<DocumentDTO> document; 
    private List<ApvLineDTO> apvline;
    private List<ParticipantsLineDTO> pline;
	public ListMappingDTO() {
		super();
		// TODO Auto-generated constructor stub
	}
	public ListMappingDTO(List<DocumentDTO> document, List<ApvLineDTO> apvline, List<ParticipantsLineDTO> pline) {
		super();
		this.document = document;
		this.apvline = apvline;
		this.pline = pline;
	}
	public List<DocumentDTO> getDocument() {
		return document;
	}
	public void setDocument(List<DocumentDTO> document) {
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
	

}
