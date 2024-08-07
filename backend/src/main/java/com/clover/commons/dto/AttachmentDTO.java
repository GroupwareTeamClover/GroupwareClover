package com.clover.commons.dto;

public class AttachmentDTO {
	private int attachmentSeq;
	private String attachmentOriname;
	private String attachmentSysname;
	private String attachmentFrom;
	private int attachmentParentSeq;
	
	public AttachmentDTO() {
		super();
	}
	public AttachmentDTO(int attachmentSeq, String attachmentOriname, String attachmentSysname, String attachmentFrom,
			int attachmentParentSeq) {
		super();
		this.attachmentSeq = attachmentSeq;
		this.attachmentOriname = attachmentOriname;
		this.attachmentSysname = attachmentSysname;
		this.attachmentFrom = attachmentFrom;
		this.attachmentParentSeq = attachmentParentSeq;
	}
	public int getAttachmentSeq() {
		return attachmentSeq;
	}
	public void setAttachmentSeq(int attachmentSeq) {
		this.attachmentSeq = attachmentSeq;
	}
	public String getAttachmentOriname() {
		return attachmentOriname;
	}
	public void setAttachmentOriname(String attachmentOriname) {
		this.attachmentOriname = attachmentOriname;
	}
	public String getAttachmentSysname() {
		return attachmentSysname;
	}
	public void setAttachmentSysname(String attachmentSysname) {
		this.attachmentSysname = attachmentSysname;
	}
	public String getAttachmentFrom() {
		return attachmentFrom;
	}
	public void setAttachmentFrom(String attachmentFrom) {
		this.attachmentFrom = attachmentFrom;
	}
	public int getAttachmentParentSeq() {
		return attachmentParentSeq;
	}
	public void setAttachmentParentSeq(int attachmentParentSeq) {
		this.attachmentParentSeq = attachmentParentSeq;
	}
}
