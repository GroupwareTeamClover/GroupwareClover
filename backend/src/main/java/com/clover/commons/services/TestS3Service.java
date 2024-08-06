package com.clover.commons.services;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.amazonaws.services.s3.AmazonS3;

@Service
public class TestS3Service {
	@Autowired
    private AmazonS3 amazonS3Client;

    @Value("${app.awsServices.bucketName}")
    private String bucketName;
	
//	public String upload(MultipartFile multipartFile, String fileName, String dirName) throws IOException {
//	    File uploadFile = convert(multipartFile).orElseThrow(() -> new IllegalArgumentException("파일변환실패"));
//
//	    fileName = dirName + fileName;
//	    String uploadImageUrl = putS3(uploadFile, fileName);
//	    uploadFile.delete();
//	    return uploadImageUrl;
//	}
	
	private Optional<File> convert(MultipartFile file) throws  IOException {
	    File convertFile = new File(file.getOriginalFilename());
	    if(convertFile.createNewFile()) {
	        try (FileOutputStream fos = new FileOutputStream(convertFile)) {
	            fos.write(file.getBytes());
	        }
	        return Optional.of(convertFile);
	    }
	    return Optional.empty();
	}
}
