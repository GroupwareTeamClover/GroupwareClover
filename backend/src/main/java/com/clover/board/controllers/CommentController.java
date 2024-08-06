package com.clover.board.controllers;

import java.util.HashMap;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.clover.board.dto.CommentDTO;
import com.clover.board.services.CommentService;

@RestController
@RequestMapping("/comment")
public class CommentController {
	@Autowired
	private CommentService cServ;

	// 댓글 등록
	@PostMapping
	public ResponseEntity<CommentDTO> postComment(@RequestBody HashMap<String, Object> data) {
		String writer = (String) data.get("writer");
		String content = (String) data.get("content");
		int boardSeq = (int) data.get("boardSeq");

		int newCommentSeq = cServ.postComment(new CommentDTO(0, writer, content, null, boardSeq, 0));

		return ResponseEntity.ok(cServ.getEachComment(newCommentSeq));
	}

	// 게시글의 모든 댓글과 답글 로딩
	@GetMapping("/{boardSeq}")
	public ResponseEntity<List<CommentDTO>> getComments(@PathVariable int boardSeq){
		return ResponseEntity.ok(cServ.getComments(boardSeq));
	}

	// 답글 등록
	@PostMapping("/reply")
	public ResponseEntity<CommentDTO> postReply(@RequestBody HashMap<String, Object> data){
		String writer = (String)data.get("writer");
		String content = (String)data.get("content");
		int boardSeq = (int)data.get("boardSeq");
		int commentSeq = (int)data.get("commentSeq");
		
		int newReplySeq = cServ.postReply(new CommentDTO(0, writer, content, null, boardSeq, commentSeq));
		
		return ResponseEntity.ok(cServ.getEachReply(newReplySeq));
	}
	
	
	
	
}
