package com.clover.approval.dao;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.clover.approval.dto.BusinessDTO;
import com.clover.approval.dto.DocumentDTO;

@Repository
public class DocumentDAO {
	@Autowired
	private SqlSession mybatis;
	

	//모달에 양식정보 출력
	public List<Map<String, ?>> selectDocCodeInfo(){
		return mybatis.selectList("Document.selectDocCodeInfo");
	}
	
	//document정보 insert
	public void insetDoc(DocumentDTO docdto) {
		mybatis.insert("Document.insertDoc",docdto);
	}
	
	//각 양식 table에 대한 insert
	public void insertBusiness(BusinessDTO business) {
		mybatis.insert("Document.insertBusiness", business);
	}
	
	
	//document정보 select
	public DocumentDTO selectDocBySeq(int seq) {
		return mybatis.selectOne("Document.selectDoc", seq);
	}
	
	
	
	

}
