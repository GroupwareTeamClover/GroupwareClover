package com.clover.admin.dao;

import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.clover.admin.dto.AdminPopupDTO;

@Repository
public class AdminPopupDAO {

	@Autowired
	private SqlSession mybatis;
	
	public void createPopup(AdminPopupDTO popupdto) {
		mybatis.insert("AdminPopup.insertPop", popupdto);
		int popSeq = popupdto.getPopSeq(); // popboard에서 생성된 popseq 가져오는거. 
		if(popSeq != 0) {
			popupdto.setPopSeq(popSeq);	// dto에 다시 설정...
			mybatis.insert("AdminPopup.insertPopPeriod", popupdto);
		}
	}
}





