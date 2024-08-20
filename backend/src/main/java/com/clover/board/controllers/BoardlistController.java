package com.clover.board.controllers;

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

import com.clover.board.dto.BoardlistDTO;
import com.clover.board.services.BoardlistService;
import com.clover.commons.services.AttachmentService;
import com.clover.commons.services.S3Service;
import com.google.gson.Gson;

@RestController
@RequestMapping("/boardlist")
public class BoardlistController {
	@Autowired
	private BoardlistService blServ;

	@Autowired
	private Gson gson = new Gson();
	
	@Autowired
	private S3Service s3Serv;
	
	@Autowired
	private AttachmentService attServ;

	@GetMapping("members")
	public ResponseEntity<String> getMemberList() {
		String json = gson.toJson(blServ.getMemberList());
		return ResponseEntity.ok(json);
	}
	
	@GetMapping("depts")
	public ResponseEntity<List<String>> getDeptList() {
		return ResponseEntity.ok(blServ.getDeptList());
	}
	
	@GetMapping("title")
	public ResponseEntity<Boolean> validTitle(@RequestParam String title){
		boolean isTitleExist = blServ.validTitle(title);
		
		return ResponseEntity.ok(isTitleExist);
	}
	
	@GetMapping("allBoards")
	public ResponseEntity<List<BoardlistDTO>> getAllBoardList(){
		return ResponseEntity.ok(blServ.getAllBoardList());
	}
	
	@GetMapping("groupBoards")
	public ResponseEntity<List<BoardlistDTO>> getGroupBoardList(){
		return ResponseEntity.ok(blServ.getGroupBoardList());
	}
	
	@GetMapping("entireBoards")
	public ResponseEntity<List<BoardlistDTO>> getEntireBoardList(){
		return ResponseEntity.ok(blServ.getEntireBoardList());
	}
	
	@GetMapping("whitelist/{boardSeq}")
	public ResponseEntity<List<Integer>> getWhitelistMembers(@PathVariable int boardSeq ){
		return ResponseEntity.ok(blServ.getWhitelistMembers(boardSeq));
	}
	
	@PostMapping
	public ResponseEntity<Integer> post(@RequestBody HashMap<String, Object> data) {
		List<Integer> members =  (List<Integer>) data.get("members");
		String title = (String) data.get("title");
		char type = ((String) data.get("type")).charAt(0);
		char active = ((String) data.get("active")).charAt(0);
		BoardlistDTO board = new BoardlistDTO(0, title, type, active);

		int newBoardSeq = blServ.createBoard(board, members);
		
		return ResponseEntity.ok(newBoardSeq);
	}
	
	@DeleteMapping("/{seq}")
	public ResponseEntity<Void> delete(@PathVariable int seq){
		blServ.deleteBoard(seq);
		//DB에서 해당 게시판의 모든 게시글의 첨부파일 삭제
		attServ.deleteFilesByBoardlistSeq(seq);
		//s3에서 해당 게시판의 모든 게시글의 이미지, 첨부파일 삭제
		s3Serv.deleteFiles("posts/" + seq + "/");
		s3Serv.deleteFiles("images/posts/" + seq + "/");
		
		return ResponseEntity.ok().build();
	}
	
	@PutMapping
	public ResponseEntity<Void> put(@RequestBody HashMap<String, Object> data){
		List<Integer> members =  (List<Integer>) data.get("members");
		int seq = (int)data.get("seq");
		String title = (String) data.get("title");
		char type = ((String) data.get("type")).charAt(0);
		char active = ((String) data.get("active")).charAt(0);
		BoardlistDTO board = new BoardlistDTO(seq, title, type, active);
		
		blServ.modifyBoard(board, members);
		
		return ResponseEntity.ok().build();
	}
	
	@GetMapping("/boardInfo")
	public ResponseEntity<BoardlistDTO> getBoardInfo(@RequestParam int boardlistSeq){
		return ResponseEntity.ok(blServ.getBoardInfo(boardlistSeq));
	}
	
	@GetMapping("/categories/{empSeq}")
	public ResponseEntity<List<BoardlistDTO>> getCategories(@PathVariable int empSeq){
		return ResponseEntity.ok(blServ.getCategories(empSeq));
	}
	
}
