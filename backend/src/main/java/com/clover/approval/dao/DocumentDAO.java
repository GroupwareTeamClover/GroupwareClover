package com.clover.approval.dao;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.clover.approval.dto.ApvLineDTO;
import com.clover.approval.dto.DocumentDTO;

@Repository
public class DocumentDAO {
	@Autowired
	private SqlSession mybatis;
	

	//모달에 양식정보 출력
	public List<Map<String, ?>> selectDocCodeInfo(){
		return mybatis.selectList("Document.selectDocCodeInfo");
	}
	
	//모달정보로 insert
	public void modalInsetDoc(DocumentDTO docdto) {
		mybatis.insert("Document.modalInsertDoc",docdto);
	}
	
	
	
	

}
