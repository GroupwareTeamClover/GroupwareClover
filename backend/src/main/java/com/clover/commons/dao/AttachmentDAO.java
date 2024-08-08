package com.clover.commons.dao;

import java.util.HashMap;
import java.util.List;

import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.clover.commons.dto.AttachmentDTO;

@Repository
public class AttachmentDAO {
	@Autowired
	private SqlSession mybatis;
	
	public void insertFile(AttachmentDTO file) {
		mybatis.insert("Attachment.insert", file);
	}
	
	public void updateContent(String content, int seq, String nameSpace) {
		HashMap<String, Object> data = new HashMap<>();
		data.put("content", content);
		data.put("seq", seq);
		
		//해당 매퍼 파일에 글 내용 업데이트문 추가 바람 (board-mapper의 updateContentWithUrl 참고.)
		mybatis.update(nameSpace + ".updateContentWithUrl", data);
	}
	
	public List<AttachmentDTO> getList(String from, int seq){
		HashMap<String, Object> data = new HashMap<>();
		data.put("from", from);
		data.put("seq", seq);
		
		return mybatis.selectList("Attachment.selectAllFile", data);
	}
	
	public void deleteFile(String fileUrl) {
		mybatis.delete("Attachment.deleteFile", fileUrl);
	}
	
	public void deleteFiles(int seq) {
		mybatis.delete("Attachment.deleteAllFile", seq);
	}
	
}
