package com.clover.admin.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.clover.admin.dao.AdminPopupDAO;
import com.clover.admin.dto.AdminPopupDTO;
import com.clover.employee.dto.EmployeeDTO;

@Service
public class AdminPopupService {
	
	@Autowired
	private AdminPopupDAO adminpopupDAO;
	
	public void createPopup(AdminPopupDTO popupdto) {
		adminpopupDAO.createPopup(popupdto);
	}
	
	public List<AdminPopupDTO> getAllPop(){
		return adminpopupDAO.getAllPop();
	} 
	
	public AdminPopupDTO getPostInfo(int popSeq) {
		return adminpopupDAO.getPostInfo(popSeq);
	}
	
	public List<AdminPopupDTO> getPopWindow(){
		return adminpopupDAO.getPopWindow();
	}
	
	public void updatePopup(AdminPopupDTO popupdto) {
		adminpopupDAO.updatePopup(popupdto);
	}
	
}


