package com.clover.commons.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.clover.commons.dao.AttachmentDAO;
import com.clover.commons.dto.AttachmentDTO;

@Service
public class AttachmentService {
	@Autowired
	private AttachmentDAO attDao;
	
	//[첨부파일] 파일 DB저장
	public void insertFile(AttachmentDTO file) {
		attDao.insertFile(file);
	}
	
	//[이미지]기존 preUrl, S3Service의 moveFile로 변환된 newUrl. 글 내용 content에서 preUrl을 찾아 moveFile로 대체 후 반환 
	public String updateImageUrl(String prevUrl, String newUrl, String content) {
		return content.replace(prevUrl, newUrl);
	}
	
	//[이미지]해당 기능(nameSpace. mybatis mapper파일 namespace명. 첫 글자 대문자 필수) 글번호(seq)의 글내용(content) 업데이트.
	public void updateContent(String content, int seq, String nameSpace) {
		attDao.updateContent(content, seq, nameSpace);
	}
	
	//[첨부파일]DB에서 첨부파일 목록 불러오기
	public List<AttachmentDTO> getList(String from, int seq){
		return attDao.getList(from, seq);
	}
	
	//[첨부파일]DB에서 해당URL을 가진 첨부파일 삭제
	public void deleteFile(String fileUrl) {
		attDao.deleteFile(fileUrl);
	}
	
	//[첨부파일]DB에서 해당 글번호에 딸린 첨부파일 전부 삭제
	public void deleteFiles(int seq, String domain) {
		attDao.deleteFiles(seq, domain);
	}
	
	//[게시판 전용. 첨부파일]DB에서 해당 게시판번호의 모든 글에 대한 첨부파일 전부 삭제
	public void deleteFilesByBoardlistSeq(int seq) {
		attDao.deleteFilesByBoardlistSeq(seq);
	}

}
