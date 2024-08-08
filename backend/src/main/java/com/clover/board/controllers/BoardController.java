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
import org.springframework.web.bind.annotation.PutMapping;
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
		int newBoardSeq = bServ.insertPost(post);
		
		//첨부파일명, 첨부파일URL, 이미지URL 데이터 받아오기
		List<String> fileNames = (List<String>) data.getOrDefault("fileNames", new ArrayList<>());
	    List<String> fileUrls = (List<String>) data.getOrDefault("fileUrls", new ArrayList<>());
	    List<String> images = (List<String>) data.getOrDefault("images", new ArrayList<>());
		
	    //첨부파일이 있을 경우 
	    if (fileNames.size() > 0) {
			for (int i = 0; i < fileNames.size(); i ++) {
				//파일 주소 변환 후 DB에 등록
				String newFileUrl = s3Serv.moveFile(newBoardSeq, fileNames.get(i), fileUrls.get(i), 1);
				
				attServ.insertFile(new AttachmentDTO(0, fileNames.get(i), newFileUrl, "board", newBoardSeq));
			}
		}
		//첨부 이미지가 있을 경우
		if (images.size() > 0) {
			for (int i = 0; i < images.size(); i ++) {
				//이미지 주소 변환 후 글내용에서 예전 image주소들을 찾아 새로운 주소로 변환
				String newImageUrl = s3Serv.moveFile(newBoardSeq, "image" + (i+1), images.get(i), 2);
				//변환된 주소로 글 내용을 바꾸고 반환
				content = attServ.updateImageUrl(images.get(i), newImageUrl, content);
			}
			// 최종적으로 업데이트된 글내용을 DB에 업데이트
			attServ.updateContent(content, newBoardSeq, "Board");
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
	}
	
	@DeleteMapping("/{boardSeq}")
	public ResponseEntity<Void> deletePost(@PathVariable int boardSeq){
		bServ.deletePost(boardSeq);
		//해당 게시글의 첨부파일 삭제 (DB)
		attServ.deleteFiles(boardSeq);
		//해당 게시글의 첨부된 이미지, 파일 삭제(S3)
		s3Serv.deleteFiles("board/" + boardSeq + "/");
		s3Serv.deleteFiles("images/posts/" + boardSeq + "/");
		//해당 게시글의 댓글 목록 삭제 (외래키 걸 예정)
		return ResponseEntity.ok().build();
	}
	
	@PutMapping
	public ResponseEntity<Void> modifyPost(@RequestBody HashMap<String, Object> data){
		int boardlistSeq = (int)data.get("boardlistSeq");
		String title = (String)data.get("title");
		String content = (String)data.get("content");
		int boardSeq = (int)data.get("boardSeq");
		BoardDTO post = new BoardDTO(boardSeq, boardlistSeq, title, null, content, null, 0);
		
		// 글 수정
		bServ.modifyPost(post);
		
		List<String> deleteFileUrls = (List<String>) data.getOrDefault("deleteFileUrls", new ArrayList<>());
		List<String> addFileNames = (List<String>) data.getOrDefault("addFileNames", new ArrayList<>());
	    List<String> addFileUrls = (List<String>) data.getOrDefault("addFileUrls", new ArrayList<>());
	    List<String> deleteImageUrls = (List<String>) data.getOrDefault("deleteImageUrls", new ArrayList<>());
	    List<String> addImageUrls = (List<String>) data.getOrDefault("addImageUrls", new ArrayList<>());
	    
	    System.out.println(deleteImageUrls);
	    System.out.println(addImageUrls);
	    
	    // 삭제할 기존 파일 제거(DB, S3)
	    if (deleteFileUrls.size() > 0) {
			for (String deleteFileUrl : deleteFileUrls) {
				attServ.deleteFile(deleteFileUrl);
				s3Serv.deleteFile(deleteFileUrl);
			}
		}
	    // 삭제할 기존 이미지 제거 (S3)
	    if (deleteImageUrls.size() > 0) {
			for (String deleteImageUrl : deleteImageUrls) {
				s3Serv.deleteFile(deleteImageUrl);
			}
		}
	    // 추가된 첨부파일이 있을 경우 
	    if (addFileNames.size() > 0) {
			for (int i = 0; i < addFileNames.size(); i ++) {
				//파일 주소 변환 후 DB에 등록
				String newFileUrl = s3Serv.moveFile(boardSeq, addFileNames.get(i), addFileUrls.get(i), 1);
				
				attServ.insertFile(new AttachmentDTO(0, addFileNames.get(i), newFileUrl, "board", boardSeq));
			}
		}
		// 추가된 첨부 이미지가 있을 경우
		if (addImageUrls.size() > 0) {
			for (int i = 0; i < addImageUrls.size(); i ++) {
				//이미지 주소 변환 후 글내용에서 예전 image주소들을 찾아 새로운 주소로 변환
				String newImageUrl = s3Serv.moveFile(boardSeq, "image" + (i+1), addImageUrls.get(i), 2);
				//변환된 주소로 글 내용을 바꾸고 반환
				content = attServ.updateImageUrl(addImageUrls.get(i), newImageUrl, content);
			}
			// 최종적으로 업데이트된 글내용을 DB에 업데이트
			attServ.updateContent(content, boardSeq, "Board");
		}
		
		return ResponseEntity.ok().build();
	}
	
	@PutMapping("/viewCount")
	public ResponseEntity<Void> upView(@RequestParam int boardSeq){
		bServ.upView(boardSeq);
		return ResponseEntity.ok().build();
	}
	
	
	
}
