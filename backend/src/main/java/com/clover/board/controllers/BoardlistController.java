package com.clover.board.controllers;

import java.util.HashMap;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.clover.board.dto.BoardlistDTO;
import com.clover.board.services.BoardlistService;
import com.google.gson.Gson;

@RestController
@RequestMapping("/boardlist")
public class BoardlistController {
	@Autowired
	private BoardlistService blServ;

	@Autowired
	Gson gson = new Gson();

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
		System.out.println(blServ.getAllBoardList());
		return ResponseEntity.ok(blServ.getAllBoardList());
	}
	
	@GetMapping("groupBoards")
	public ResponseEntity<List<BoardlistDTO>> getGroupBoardList(){
		System.out.println(blServ.getAllBoardList());
		return ResponseEntity.ok(blServ.getAllBoardList());
	}
	
	@PostMapping
	public ResponseEntity<Void> post(@RequestBody HashMap<String, Object> data) {
		List<Integer> members =  (List<Integer>) data.get("members");
		String title = (String) data.get("title");
		char type = ((String) data.get("type")).charAt(0);
		char active = ((String) data.get("active")).charAt(0);
		BoardlistDTO board = new BoardlistDTO(0, title, type, active);

		System.out.println(members.isEmpty());
		blServ.createBoard(board, members);
		
		return ResponseEntity.ok().build();
	}
}
