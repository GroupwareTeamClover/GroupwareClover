package com.clover.admin.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.clover.admin.dto.AdminPopupDTO;
import com.clover.admin.services.AdminPopupService;
import com.clover.board.dto.BoardDTO;
import com.clover.employee.dto.EmployeeDTO;

@RestController
@RequestMapping("/adminpopup")
public class AdminPopupController {

	@Autowired
	private AdminPopupService adminpopupService;
	
	@PostMapping
	public ResponseEntity<Void> createPopup(@RequestBody AdminPopupDTO popupdto){
		adminpopupService.createPopup(popupdto);
		return ResponseEntity.ok().build();
	}
	
	@GetMapping
	public ResponseEntity<List<AdminPopupDTO>> getAllPop(){
		return ResponseEntity.ok(adminpopupService.getAllPop());
	}
	
	@GetMapping("/postInfo/{popSeq}")
	public ResponseEntity<AdminPopupDTO> getPostInfo(@PathVariable int popSeq){
		return ResponseEntity.ok(adminpopupService.getPostInfo(popSeq));
		
		// ++ DB 첨부파일 정보(FileController) , 댓글 목록 (CommentController)
	}
	
	@GetMapping("/today")
	public ResponseEntity<List<AdminPopupDTO>> getPopWindow(){
		return ResponseEntity.ok(adminpopupService.getPopWindow());
	}
}


