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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.clover.board.dto.BoardDTO;
import com.clover.board.services.BoardService;

@RestController
@RequestMapping("/board")
public class BoardController {
	@Autowired
	private BoardService bServ;

	@PostMapping
	public ResponseEntity<Void> post(@RequestBody HashMap<String, Object> data){
		int boardlistSeq = (int)data.get("boardlistSeq");
		String title = (String)data.get("title");
		String writer = (String)data.get("writer");
		String content = (String)data.get("content");
		BoardDTO post = new BoardDTO(0, boardlistSeq, title, writer, content, null, 0);
		
		int newPostSeq = bServ.insertPost(post);

//		파일 첨부(미구현)
//		System.out.println(data.get("files"));
		
//		이미지 이동(임시 -> postSeq폴더) [미구현]
		
		return ResponseEntity.ok().build();
	}
	
	@GetMapping("/posts/{boardlistSeq}")
	public ResponseEntity<List<BoardDTO>> getPosts(@PathVariable int boardlistSeq){
		return ResponseEntity.ok(bServ.getPosts(boardlistSeq));
	}
	
	@GetMapping("/search")
	public ResponseEntity<List<BoardDTO>> searchPosts(@RequestParam int boardlistSeq, @RequestParam String searchType, @RequestParam String keyword){
		HashMap<String, Object> data = new HashMap<>();
		data.put("boardlistSeq", boardlistSeq);
		data.put("searchType", searchType);
		data.put("keyword", keyword);
		
		return ResponseEntity.ok(bServ.searchPosts(data));
	}
	
}
