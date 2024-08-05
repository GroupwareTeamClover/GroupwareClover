package com.clover.board.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/file")
public class FileController {
	@PostMapping
	public ResponseEntity<Void> post(@RequestParam("files") MultipartFile[] files){
		System.out.println(files);
		
		return ResponseEntity.ok(null);
	}
}
