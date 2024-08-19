package com.clover.messenger.services;

import java.util.HashMap;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.clover.employee.dto.EmployeeDTO;
import com.clover.messenger.dao.ChatProfileDAO;

@Service
public class ChatProfileService {

    @Autowired
    private ChatProfileDAO chatProfileDAO;

    /**
     * 특정 사용자의 프로필 정보를 조회하는 메서드
     * @param empSeq 사용자의 사원 번호
     * @return 사용자의 프로필 정보
     */
    public HashMap<String, Object> getProfile(int empSeq) {
        return chatProfileDAO.getProfile(empSeq);
    }

    /**
     * 사원의 이름을 조회하는 메서드
     * @param empSeq 사원 번호
     * @return 사원의 이름
     */
    public EmployeeDTO getEmployeeName(int empSeq) {
        return chatProfileDAO.getEmployeeName(empSeq);
    }

    /**
     * 조직도 정보를 조회하는 메서드
     * @return 조직도 정보
     */
    public List<HashMap<String, Object>> getOrganization() {
        return chatProfileDAO.getOrganization();
    }
}
