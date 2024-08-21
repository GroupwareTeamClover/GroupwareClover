package com.clover.commons.services;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.net.URI;
import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.CopyObjectRequest;
import com.amazonaws.services.s3.model.ListObjectsRequest;
import com.amazonaws.services.s3.model.ObjectListing;
import com.amazonaws.services.s3.model.PutObjectRequest;
import com.amazonaws.services.s3.model.S3Object;
import com.amazonaws.services.s3.model.S3ObjectInputStream;
import com.amazonaws.services.s3.model.S3ObjectSummary;

@Service
public class S3Service {
	@Autowired
	private AmazonS3 s3Client;

	@Value("${app.awsServices.bucketName}")
	private String bucketName;

	// s3 임시폴더 파일 업로드 함수 (임시폴더 업로드 후 파일 저장 경로 URL을 반환)
	public String uploadFile(MultipartFile file, String folderPath) {
		File fileObj = convertMultiPartFileToFile(file);
		String filePath = folderPath + "/" + UUID.randomUUID() + "_" + file.getOriginalFilename();
		s3Client.putObject(new PutObjectRequest(bucketName, filePath, fileObj));
		fileObj.delete();
		return s3Client.getUrl(bucketName, filePath).toString();
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
	public String moveFile(String newFilePath, String tempFileUrl) {
		String oldFilePath = null;
		try {
			URI uri = new URI(tempFileUrl);
			String path = uri.getPath();
			oldFilePath = path.startsWith("/")? path.substring(1) : path;
		}catch (Exception e) {}

		CopyObjectRequest copyObjectRequest = new CopyObjectRequest(bucketName, oldFilePath, bucketName, newFilePath);
		s3Client.copyObject(copyObjectRequest);

		return s3Client.getUrl(bucketName, newFilePath).toString();
	}
	
	// s3 파일 다운로드 함수
	public byte[] downloadFile(String filePath) {
		S3Object obj = s3Client.getObject(bucketName, filePath);
		S3ObjectInputStream objectInputStream = obj.getObjectContent();
		ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
		
		try {
			int read;
			byte[] buffer = new byte[4096];
			while((read = objectInputStream.read(buffer, 0, buffer.length)) != -1) {
				outputStream.write(buffer, 0, read);
			}
			
			outputStream.flush();
		}catch(IOException e) {}
		finally {
			try {
				objectInputStream.close();
				outputStream.close();
			}catch(IOException e) {}
		}
		return outputStream.toByteArray();
	}
	
	// s3 파일 삭제 함수
	public void deleteFile(String fileUrl) {
		String filePath = null;
		try {
			URI uri = new URI(fileUrl);
			String path = uri.getPath();
			filePath = path.startsWith("/")? path.substring(1) : path;
			s3Client.deleteObject(bucketName, filePath);
		}catch (Exception e) {}
	}
	
	// s3 폴더 안의 모든 파일 삭제 함수 ( folderPath : 폴더 경로 )
	public void deleteFiles(String folderPath) {
		ListObjectsRequest listObjectsRequest = new ListObjectsRequest().withBucketName(bucketName).withPrefix(folderPath);
		
		ObjectListing objectListing;
		
		do {
			objectListing = s3Client.listObjects(listObjectsRequest);
			List<S3ObjectSummary> s3ObjectSummaries = objectListing.getObjectSummaries();
			
			for (S3ObjectSummary s3ObjectSummary : s3ObjectSummaries) {
				s3Client.deleteObject(bucketName, s3ObjectSummary.getKey());
			}
			
			listObjectsRequest.setMarker(objectListing.getNextMarker());
			
		}while(objectListing.isTruncated());
	}
}
