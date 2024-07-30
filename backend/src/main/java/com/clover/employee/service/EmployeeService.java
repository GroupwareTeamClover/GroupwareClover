package com.clover.employee.service;

import com.clover.commons.Sha512;
import com.clover.employee.dao.EmployeeDAO;
import com.clover.employee.dto.EmployeeDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

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
    public EmployeeDTO getMyInfo(int empSeq) {
        return employeeDAO.getMyInfo(empSeq);
    }

    /** 사원 정보 업데이트 **/
    public void updateEmployee(EmployeeDTO dto) {
        employeeDAO.updateEmployee(dto);
    }

    /** 직원 삭제 **/
    public void leaveEmployee(int empSeq) {
        employeeDAO.leaveEmployee(empSeq);
    }
}
