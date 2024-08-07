package com.clover.commons.services;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.net.URI;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.CopyObjectRequest;
import com.amazonaws.services.s3.model.PutObjectRequest;

@Service
public class S3Service {
	@Autowired
	private AmazonS3 s3Client;

	@Value("${app.awsServices.bucketName}")
	private String bucketName;

	// s3 임시폴더 파일 업로드 함수 (임시폴더 업로드 후 파일 저장 경로 URL을 반환)
	public String uploadFile(MultipartFile file) {
		File fileObj = convertMultiPartFileToFile(file);
		String fileName = "temp/" + System.currentTimeMillis() + "_" + file.getOriginalFilename();
		s3Client.putObject(new PutObjectRequest(bucketName, fileName, fileObj));
		fileObj.delete();
		return s3Client.getUrl(bucketName, fileName).toString();
	}

	// 멀티파트파일 -> 파일 변환 함수 (별도 조작 필요 x)
	private File convertMultiPartFileToFile(MultipartFile file) {
		File convertedFile = new File(file.getOriginalFilename());
		try (FileOutputStream fos = new FileOutputStream(convertedFile)) {
			fos.write(file.getBytes());
		} catch (IOException e) {
			throw new RuntimeException(e);
		}
		return convertedFile;
	}

	// s3 최종폴더 파일 이동 함수 (임시폴더에서 최종폴더로 파일 복사 후 바뀐 저장 경로 URL을 반환). useCase로 파일이동위치 제어.
	public String moveFile(int seq, String fileName, String tempFileUrl, int useCase) {
		String newFileName = null;
		switch (useCase) {
		case 1: newFileName = "posts/" + seq + "/" + System.currentTimeMillis() + "_" + fileName; break;
		case 2: newFileName = "images/posts/" + seq + "/" + System.currentTimeMillis() + "_" + fileName; break;
		}
		
		String oldFileName = null;
		try {
			URI uri = new URI(tempFileUrl);
			String path = uri.getPath();
			oldFileName = path.startsWith("/")? path.substring(1) : path;
		}catch (Exception e) {}

		CopyObjectRequest copyObjectRequest = new CopyObjectRequest(bucketName, oldFileName, bucketName, newFileName);
		s3Client.copyObject(copyObjectRequest);

		return s3Client.getUrl(bucketName, newFileName).toString();
	}
	
	// s3 파일 다운로드 함수
	public void downloadFile(String fileUrl) {
		String downloadFileName = null;
		try {
			URI uri = new URI(fileUrl);
			String path = uri.getPath();
			downloadFileName = path.startsWith("/")? path.substring(1) : path;
		}catch (Exception e) {}
		System.out.println(downloadFileName);
	}
}
