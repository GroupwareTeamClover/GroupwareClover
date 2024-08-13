package com.clover.admin.controllers;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.HashMap;
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
import com.clover.admin.dto.AdminPopupUpdateDTO;
import com.clover.admin.services.AdminPopupService;
import com.clover.board.dto.BoardDTO;
import com.clover.commons.dto.AttachmentDTO;
import com.clover.commons.services.AttachmentService;
import com.clover.commons.services.S3Service;

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
	public ResponseEntity<Void> updatePopup(@PathVariable Integer popSeq,@RequestBody HashMap<String, Object> data){
		System.out.println(popSeq);
		System.out.println("Request Data: " + data);

		 String popTitle = (String)data.get("popTitle");
		 String empId = (String)data.get("empId");
		 String popContent = (String)data.get("popContent");
		 Boolean isActive = (Boolean) data.get("popIsActive");
	        String popIsActive = isActive.toString(); // 올바른 변환 방법
		
		 String periodType =(String)data.get("periodType"); // 'none', 'specific', 'monthly', 'weekly'
	     String specificStartDate= (String)data.get("specificStartDate"); // YYYY-MM-DD
	     String specificEndDate = (String)data.get("specificEndDate");   // YYYY-MM-DD
	     String monthlyDay = (String)data.get("monthlyDay");       // 1-31
	     String weeklyDay =(String)data.get("weeklyDay");      
		AdminPopupDTO popupdto= new AdminPopupDTO(popSeq, popTitle, empId, popContent, null, null, popIsActive, null, null, periodType, specificStartDate, specificEndDate, monthlyDay, weeklyDay, null, null, null);
		adminpopupService.updatePopup(popupdto); // 글 수정
		
		
		List<String> deleteFileUrls = (List<String>) data.getOrDefault("deleteFileUrls", new ArrayList<>());
		List<String> addFileNames = (List<String>) data.getOrDefault("addFileNames", new ArrayList<>());
	    List<String> addFileUrls = (List<String>) data.getOrDefault("addFileUrls", new ArrayList<>());
	    List<String> deleteImageUrls = (List<String>) data.getOrDefault("deleteImageUrls", new ArrayList<>());
	    List<String> addImageUrls = (List<String>) data.getOrDefault("addImageUrls", new ArrayList<>());
	    
	    System.out.println(deleteImageUrls);
	    System.out.println(addImageUrls);
	    System.out.println(addFileNames);
	    System.out.println(addFileUrls);
	    
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
				String newFilePath = "popups/" + popSeq + "/" + UUID.randomUUID() + "_" + addFileNames.get(i);
				//파일 주소 변환 후 DB에 등록
				String newFileUrl = s3Serv.moveFile(newFilePath, addFileUrls.get(i));
				
				attServ.insertFile(new AttachmentDTO(0, addFileNames.get(i), newFileUrl, "popup", popSeq));
			}
		}
		// 추가된 첨부 이미지가 있을 경우
		if (addImageUrls.size() > 0) {
			for (int i = 0; i < addImageUrls.size(); i ++) {
				String newImagePath = "images/popups/" + popSeq + "/" + UUID.randomUUID() + "_image" + (i+1); 
				//이미지 주소 변환 후 글내용에서 예전 image주소들을 찾아 새로운 주소로 변환
				String newImageUrl = s3Serv.moveFile(newImagePath, addImageUrls.get(i));
				//변환된 주소로 글 내용을 바꾸고 반환
				popContent = attServ.updateImageUrl(addImageUrls.get(i), newImageUrl, popContent);
			}
			// 최종적으로 업데이트된 글내용을 DB에 업데이트
			attServ.updateContent(popContent, popSeq, "Popup");
		}
		
		return ResponseEntity.ok().build();
	}
		
}


