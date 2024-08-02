package com.clover.employee.service;

import com.clover.commons.Sha512;
import com.clover.employee.dao.EmployeeDAO;
import com.clover.employee.dto.EmployeeDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class EmployeeService {

    @Autowired
    private EmployeeDAO employeeDAO;

    @Autowired
    private Sha512 sha512;

    /** 로그인 **/
    public EmployeeDTO SignIn(String id, String pw) {
        return employeeDAO.SignIn(new EmployeeDTO(id, sha512.getSHA512(pw)));
    }

    /** 회원 가입 **/
    public String signUpEmployee(EmployeeDTO dto) {
        if(dto.getEmpGender().equals("M")) dto.setEmpAvatar("https://groupwareteamclover.s3.ap-northeast-2.amazonaws.com/profile/man.png");
        else dto.setEmpAvatar("https://groupwareteamclover.s3.ap-northeast-2.amazonaws.com/profile/woman.png");
        dto.setEmpPw(sha512.getSHA512(dto.getEmpPw()));
        int result = employeeDAO.signUpEmployee(dto);
        if(result > 0) return "ok";
        else return "fail";
    }

    /** 회원 가입 (ID 중복확인) **/
    public String existsId(String empId) {
        int result = employeeDAO.existsId(empId);
        if(result > 0) return "fail";
        else return "ok";
    }

    /** 사원 정보 조회 **/
    public Map<String, Object> getMyInfo(int empSeq) {
        Map<String, Object> map = employeeDAO.getMyInfo(empSeq);
        return map;
    }

    /** 사원 정보 업데이트 **/
    public void updateEmployee(EmployeeDTO dto) {
        employeeDAO.updateEmployee(dto);
    }

    /** 사원 비밀번호 변경 **/
    public String updatePwEmployee(EmployeeDTO dto) {
        dto.setEmpPw(sha512.getSHA512(dto.getEmpPw()));
        int result = employeeDAO.updatePwEmployee(dto);
        if(result > 0) return "ok";
        else return "fail";
    }

    /** 직원 삭제 **/
    public void leaveEmployee(int empSeq) {
        employeeDAO.leaveEmployee(empSeq);
    }

    /** 직원 여부 확인 **/
    public EmployeeDTO existsEmployee(String empName, String empId, String empEmail) {

        Map<String, String> map = new HashMap<String, String>();
        map.put("empName", empName);
        map.put("empId", empId);
        map.put("empEmail", empEmail);
        EmployeeDTO dto = employeeDAO.existsEmployee(map);
        if(dto.getEmpSeq() > 0) return dto;
        else return null;
    }
}
