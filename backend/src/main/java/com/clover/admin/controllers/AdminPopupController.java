package com.clover.admin.controllers;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.clover.admin.dto.AdminPopupDTO;
import com.clover.admin.dto.AdminUpdateMemDTO;
import com.clover.admin.services.AdminPopupService;
import com.clover.board.dto.BoardDTO;
import com.clover.commons.dto.AttachmentDTO;
import com.clover.commons.services.AttachmentService;
import com.clover.commons.services.S3Service;
import com.clover.employee.dto.EmployeeDTO;

@RestController
@RequestMapping("/adminpopup")
public class AdminPopupController {

	@Autowired
	private AdminPopupService adminpopupService;
	
	@Autowired
    private S3Service s3Serv;
	
	@Autowired
	private AttachmentService attServ;

	
	@PostMapping
	public ResponseEntity<Void> createPopup(@RequestBody AdminPopupDTO popupdto){
		String content = popupdto.getPopContent();
		int newPopSeq = adminpopupService.createPopup(popupdto);
		
		//첨부파일명, 첨부파일URL, 이미지URL 데이터 받아오기
		List<String> fileNames = (List<String>) popupdto.getFileNames();
	    List<String> fileUrls = (List<String>) popupdto.getFileUrls();
	    List<String> images = (List<String>) popupdto.getImages();
	 // 파일 리스트가 null인 경우 빈 리스트로 초기화
        if (fileNames == null) {
            fileNames = new ArrayList<>();
        }
        if (fileUrls == null) {
            fileUrls = new ArrayList<>();
        }
        if (images == null) {
            images = new ArrayList<>();
        }
	    //첨부파일이 있을 경우
	    if (fileNames.size() > 0) {
			for (int i = 0; i < fileNames.size(); i ++) {
				//파일 주소 변환 후 DB에 등록
				String newFilePath = "popups/" + newPopSeq + "/" + UUID.randomUUID() + "_" + fileNames.get(i);
				String newFileUrl = s3Serv.moveFile(newFilePath, fileUrls.get(i));
				
				attServ.insertFile(new AttachmentDTO(0, fileNames.get(i), newFileUrl, "popup", newPopSeq));
			}
		}
		//첨부 이미지가 있을 경우
		if (images.size() > 0) {
			for (int i = 0; i < images.size(); i ++) {
				String newImagePath = "images/popups/" + newPopSeq + "/" + UUID.randomUUID() + "_image" + (i+1); 
				//이미지 주소 변환 후 글내용에서 예전 image주소들을 찾아 새로운 주소로 변환
				String newImageUrl = s3Serv.moveFile(newImagePath, images.get(i));
				//변환된 주소로 글 내용을 바꾸고 반환
				content = attServ.updateImageUrl(images.get(i), newImageUrl, content);
			}
			// 최종적으로 업데이트된 글내용을 DB에 업데이트
			attServ.updateContent(content, newPopSeq, "Popup");
		}	    
		
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
	
	@PutMapping("/{popSeq}")
	public ResponseEntity<Void> updatePopup(@PathVariable Integer popSeq, @RequestBody AdminPopupDTO popupdto){
		System.out.println(popSeq);
		popupdto.setPopSeq(popSeq);
		System.out.println(popupdto.getPopSeq());
		adminpopupService.updatePopup(popupdto);
		return ResponseEntity.ok().build();
	}
}


