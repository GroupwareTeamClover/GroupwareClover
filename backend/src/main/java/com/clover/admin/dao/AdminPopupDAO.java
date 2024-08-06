package com.clover.admin.dao;

import java.util.List;

import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.clover.admin.dto.AdminPopupDTO;
import com.clover.employee.dto.EmployeeDTO;

@Repository
public class AdminPopupDAO {

	@Autowired
	private SqlSession mybatis;
	
	public void createPopup(AdminPopupDTO popupdto) {
		
		System.out.println(popupdto.getSpecificStartDate());

	    mybatis.insert("AdminPopup.insertPop", popupdto);
	    
	    System.out.println("Generated popSeq: " + popupdto.getPopSeq());
	    Integer popSeq = popupdto.getPopSeq();
	    if(popSeq != 0) {
	        popupdto.setPopSeq(popSeq); 
	        System.out.println(popupdto.getPopSeq());
	        mybatis.insert("AdminPopup.insertPopPeriod", popupdto);
	    }
	}
	
	public List<AdminPopupDTO> getAllPop(){
		return mybatis.selectList("AdminPopup.getAllPop");
	}
	
	public AdminPopupDTO getPostInfo(int popSeq) {
		return mybatis.selectOne("AdminPopup.getPostInfo", popSeq);
	}
	
	public List<AdminPopupDTO> getPopWindow(){
		return mybatis.selectList("AdminPopup.getPopWindow");
	}
	
	public void updatePopup(AdminPopupDTO popupdto) {
		mybatis.update("AdminPopup.updatePopup", popupdto);
		mybatis.update("AdminPopup.updatePopPeriod", popupdto);
	}
	
	

}





