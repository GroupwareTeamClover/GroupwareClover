package com.clover.admin.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.clover.admin.dao.AdminPopupDAO;
import com.clover.admin.dto.AdminPopupDTO;

@Service
public class AdminPopupService {
	
	@Autowired
	private AdminPopupDAO adminpopupDAO;
	
	public void createPopup(AdminPopupDTO popupdto) {
		adminpopupDAO.createPopup(popupdto);
	}
}


