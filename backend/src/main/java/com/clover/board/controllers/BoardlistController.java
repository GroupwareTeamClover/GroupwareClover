package com.clover.board.controllers;

import java.util.HashMap;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
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
	
	@PostMapping
	public ResponseEntity<Void> post(@RequestBody HashMap<String, Object> data) {
		System.out.println(data);
		
		return ResponseEntity.ok().build();
	}
}
