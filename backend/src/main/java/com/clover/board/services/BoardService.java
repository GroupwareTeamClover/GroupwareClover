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
	
	public List<BoardDTO> getPosts(int boardlistSeq){
		return bDao.getPosts(boardlistSeq);
	}
	
	public List<BoardDTO> searchPosts(HashMap<String,Object> data){
		return bDao.searchPosts(data);
	}
	
	public BoardDTO getPostInfo(int boardSeq) {
		return bDao.getPostInfo(boardSeq);
	}
	
	public void deletePost(int boardSeq) {
		bDao.deletePost(boardSeq);
	}
}
