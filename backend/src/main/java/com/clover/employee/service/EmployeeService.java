package com.clover.employee.service;

import com.clover.employee.dao.EmployeeDAO;
import com.clover.employee.dto.EmployeeDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class EmployeeService {

    @Autowired
    private EmployeeDAO employeeDAO;

    /** 로그인 **/
    public EmployeeDTO SignIn(EmployeeDTO dto) {
        return employeeDAO.SignIn(dto);
    }

    /** 회원 가입 **/
    public void signUpEmployee(EmployeeDTO dto) {
        employeeDAO.signUpEmployee(dto);
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
