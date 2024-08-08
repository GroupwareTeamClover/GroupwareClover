package com.clover.commons.controllers;

import java.net.URI;
import java.net.URLEncoder;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.clover.commons.dto.AttachmentDTO;
import com.clover.commons.services.AttachmentService;
import com.clover.commons.services.S3Service;

@RestController
@RequestMapping("/attachment")
public class AttachmentController {
	@Autowired
	private S3Service s3Serv;
	
	@Autowired
	private AttachmentService attServ;

	// S3 임시파일 파일 업로드 후 resp.data에 파일URL 반환
	@PostMapping("/upload/{folderName}")
	public ResponseEntity<String> post(@RequestParam("file") MultipartFile file, @PathVariable String folderName){
		 try {
	            String fileUrl = s3Serv.uploadFile(file, folderName);
	            return ResponseEntity.ok(fileUrl);
	        } catch (Exception e) {
	            return ResponseEntity.status(500).body("File upload failed: " + e.getMessage());
	        }
	}
	
	// 첨부파일 목록 로딩 from(출처), seq(글번호)
	@GetMapping("/{from}/{seq}")
	public ResponseEntity<List<AttachmentDTO>> getList(@PathVariable String from ,@PathVariable int seq){
		return ResponseEntity.ok(attServ.getList(from, seq));
	}
	
	// 첨부파일 다운로드
	@GetMapping("/download")
	public ResponseEntity<byte[]> downloadFile(@RequestParam String fileUrl) throws Exception{
		String fileName = null;
		try {
			URI uri = new URI(fileUrl);
			String path = uri.getPath();
			fileName = path.startsWith("/")? path.substring(1) : path;
		}catch (Exception e) {}
		byte[] fileContent = s3Serv.downloadFile(fileName);
		
		HttpHeaders headers = new HttpHeaders();
		String encodedFileName = URLEncoder.encode(fileName, "UTF-8").replaceAll("\\+", "%20");
		headers.add(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=" + encodedFileName);
		headers.add(HttpHeaders.CONTENT_TYPE, "application/octet-stream");
		
		return new ResponseEntity<>(fileContent, headers, HttpStatus.OK);
	}
}

