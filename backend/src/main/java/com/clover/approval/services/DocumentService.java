package com.clover.approval.services;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.clover.approval.dao.DocumentDAO;

@Service
public class DocumentService {
	
	@Autowired
	private DocumentDAO documentdao;
	
	public List<Map<String,?>> getDocCodeInfo(){
		List<Map<String,?>> list = documentdao.selectDocCodeInfo();
		return list;
	}

}
