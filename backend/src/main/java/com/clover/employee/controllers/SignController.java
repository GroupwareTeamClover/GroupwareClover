package com.clover.employee.controllers;

import com.clover.employee.dto.EmployeeDTO;
import com.clover.employee.service.EmployeeService;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/sign")
public class SignController {

    @Autowired
    private EmployeeService employeeService;

    @Autowired
    private HttpSession session;

    @GetMapping
    public EmployeeDTO signIn(@RequestBody EmployeeDTO dto) {
        EmployeeDTO empInfo = employeeService.SignIn(dto);
        if(empInfo != null) {
            session.setAttribute("cloverSeq", dto.getEmpSeq());
            session.setAttribute("cloverId", dto.getEmpId());
            session.setAttribute("cloverName", dto.getEmpName());
            session.setAttribute("cloverAvatar", dto.getEmpAvatar());
        }
        return empInfo;
    }

    @DeleteMapping
    public void SignOut() {
        session.invalidate();
    }

}
