package com.clover.approval.services;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.clover.approval.dao.ApvLineDAO;

@Service
public class ApvLineService {
	@Autowired
	private ApvLineDAO apvLineDAO;
	
	//임시
	public List<Map<String,?>> getMemberInfo(){
		return apvLineDAO.selectMemberInfo();
	}

}
