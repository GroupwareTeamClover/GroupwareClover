package com.clover.board.services;

import java.util.HashMap;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.clover.board.dao.BoardDAO;
import com.clover.board.dto.BoardDTO;

@Service
public class BoardService {
	@Autowired
	private BoardDAO bDao;

	public int insertPost(BoardDTO post) {
		bDao.insertPost(post);
		int newPostSeq = post.getBoardSeq();

		return newPostSeq;
	}

	public String getWriterInfo(String writer) {
		HashMap<String, String> data = bDao.getWriterInfo(writer);
		return data.get("EMP_NAME") + "/" + data.get("ROLE_NAME") + "/" + data.get("DEPT_NAME");
	}

	public List<BoardDTO> getPosts(int boardlistSeq) {
		return bDao.getPosts(boardlistSeq);
	}

	public List<BoardDTO> searchPosts(HashMap<String, Object> data) {
		return bDao.searchPosts(data);
	}

	public BoardDTO getPostInfo(int boardSeq) {
		return bDao.getPostInfo(boardSeq);
	}

	public void deletePost(int boardSeq) {
		bDao.deletePost(boardSeq);
	}

	public void modifyPost(BoardDTO post) {
		bDao.modifyPost(post);
	}

	public void upView(int boardSeq) {
		bDao.upView(boardSeq);
	}

	public void addImportant(int empSeq, int boardSeq) {
		bDao.addImportant(empSeq, boardSeq);
	}
	
	public void removeImportant(int empSeq, int boardSeq) {
		bDao.removeImportant(empSeq, boardSeq);
	}
	
	public List<BoardDTO> getImportantPosts(int empSeq){
		return bDao.getImportantPosts(empSeq);
	}
	
	public boolean isImportant(int empSeq, int boardSeq) {
		return bDao.isImportant(empSeq, boardSeq);
	}
}
