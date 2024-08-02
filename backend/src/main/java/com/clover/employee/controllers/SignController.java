package com.clover.employee.controllers;

import com.clover.employee.dto.EmployeeDTO;
import com.clover.employee.service.EmployeeService;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/sign")
public class SignController {

    @Autowired
    private EmployeeService employeeService;

    @Autowired
    private HttpSession session;

    @GetMapping
    public ResponseEntity<EmployeeDTO> signIn(@RequestParam String id, @RequestParam String pw) {
        EmployeeDTO empInfo = employeeService.SignIn(id, pw);
        if(empInfo != null) {
            session.setAttribute("cloverSeq", empInfo.getEmpSeq());
            session.setAttribute("cloverId", empInfo.getEmpId());
            session.setAttribute("cloverName", empInfo.getEmpName());
            session.setAttribute("cloverAvatar", empInfo.getEmpAvatar());
            session.setAttribute("cloverDeptCode", empInfo.getDeptCode());
            session.setAttribute("cloverRoleCode", empInfo.getRoleCode());
            if(empInfo.getEmpStateCode() == 0) session.setAttribute("cloverAdmin", empInfo.getEmpStateCode());
            return ResponseEntity.ok(empInfo);
        }
        return null;
    }

    @GetMapping("/{empId}")
    public ResponseEntity<String> existsId(@PathVariable(required = false) String empId) {
        String result = employeeService.existsId(empId);
        return ResponseEntity.ok(result);
    }

    @DeleteMapping
    public ResponseEntity<String> SignOut() {
        try {
            session.invalidate();
            return ResponseEntity.ok("ok");
        } catch (Exception e){
            return ResponseEntity.ok("fail");
        }
    }


}
