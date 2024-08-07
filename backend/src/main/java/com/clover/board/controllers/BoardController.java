package com.clover.board.controllers;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.clover.board.dto.BoardDTO;
import com.clover.board.services.BoardService;
import com.clover.commons.dto.AttachmentDTO;
import com.clover.commons.services.AttachmentService;
import com.clover.commons.services.S3Service;

@RestController
@RequestMapping("/board")
public class BoardController {
	@Autowired
	private BoardService bServ;
	
	@Autowired
    private S3Service s3Serv;
	
	@Autowired
	private AttachmentService attServ;

	@PostMapping
	public ResponseEntity<Void> post(@RequestBody HashMap<String, Object> data){
		int boardlistSeq = (int)data.get("boardlistSeq");
		String title = (String)data.get("title");
		String writer = (String)data.get("writer");
		String writerInfo = bServ.getWriterInfo(writer);
		String content = (String)data.get("content");
		BoardDTO post = new BoardDTO(0, boardlistSeq, title, writerInfo, content, null, 0);
		
		// 글 등록
		int newPostSeq = bServ.insertPost(post);
		
		//첨부파일명, 첨부파일URL, 이미지URL 데이터 받아오기
		List<String> fileNames = (List<String>) data.getOrDefault("fileNames", new ArrayList<>());
	    List<String> fileUrls = (List<String>) data.getOrDefault("fileUrls", new ArrayList<>());
	    List<String> images = (List<String>) data.getOrDefault("images", new ArrayList<>());
		
	    //첨부파일이 있을 경우 
	    if (fileNames.size() > 0) {
			for (int i = 0; i < fileNames.size(); i ++) {
				//파일 주소 변환 후 DB에 등록
				String newFileUrl = s3Serv.moveFile(newPostSeq, fileNames.get(i), fileUrls.get(i), 1);
				
				attServ.insertFile(new AttachmentDTO(0, fileNames.get(i), newFileUrl, "board", newPostSeq));
			}
		}
		//첨부 이미지가 있을 경우
		if (images.size() > 0) {
			for (int i = 0; i < images.size(); i ++) {
				//이미지 주소 변환 후 글내용에서 예전 image주소들을 찾아 새로운 주소로 변환
				String newImageUrl = s3Serv.moveFile(newPostSeq, "image" + (i+1), images.get(i), 2);
				//변환된 주소로 글 내용을 바꾸고 반환
				content = attServ.updateImageUrl(images.get(i), newImageUrl, content);
			}
			// 최종적으로 업데이트된 글내용을 DB에 업데이트
			attServ.updateContent(content, newPostSeq, "Board");
		}
		
		return ResponseEntity.ok().build();
	}
	
	@GetMapping("/writerInfo/{id}")
	public ResponseEntity<String> getSessionWriter(@PathVariable String id){
		return ResponseEntity.ok(bServ.getWriterInfo(id));
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
	
	@GetMapping("/postInfo/{boardSeq}")
	public ResponseEntity<BoardDTO> getPostInfo(@PathVariable int boardSeq){
		return ResponseEntity.ok(bServ.getPostInfo(boardSeq));
		
		// ++ DB 첨부파일 정보(FileController) , 댓글 목록 (CommentController)
	}
	
	@DeleteMapping("/{boardSeq}")
	public ResponseEntity<Void> deletePost(@PathVariable int boardSeq){
		bServ.deletePost(boardSeq);
		
		//해당 게시글의 첨부파일 삭제 (DB, S3)
		//해당 게시글의 첨부된 이미지 삭제(S3)
		//해당 게시글의 댓글 목록 삭제
		
		return ResponseEntity.ok().build();
	}
	
	
}
