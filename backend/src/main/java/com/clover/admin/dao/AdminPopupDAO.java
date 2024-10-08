package com.clover.admin.dao;

import java.util.List;

import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.clover.admin.dto.AdminPopupDTO;
import com.clover.admin.dto.AdminPopupUpdateDTO;

@Repository
public class AdminPopupDAO {

	@Autowired
	private SqlSession mybatis;
	
	public void deletepop(int popSeq) {
		mybatis.delete("AdminPopup.deletepop",popSeq);
		mybatis.delete("AdminPopup.deleteperiod",popSeq);
		mybatis.delete("AdminPopup.deletefile",popSeq);

	}
	
	public void createPopup(AdminPopupDTO popupdto) {
		
	    mybatis.insert("AdminPopup.insertPop", popupdto);
	    
	    Integer popSeq = popupdto.getPopSeq();
	    if(popSeq != 0) {
	        popupdto.setPopSeq(popSeq); 
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
	public void deletePopup(int newPopSeq) {
		mybatis.delete("AdminPopup.deletePopup", newPopSeq);
	}
	
	

}





