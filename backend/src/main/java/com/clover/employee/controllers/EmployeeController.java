package com.clover.employee.controllers;

import com.clover.employee.dto.EmployeeDTO;
import com.clover.employee.service.EmployeeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/employee")
public class EmployeeController {

    @Autowired
    private EmployeeService employeeService;

    @GetMapping("/{empSeq}")
    public ResponseEntity<Map<String, Object>> getMyInfo(@PathVariable int empSeq) {
        Map<String, Object> map = employeeService.getMyInfo(empSeq);
        return ResponseEntity.ok(map);
    }

    @PostMapping
    public ResponseEntity<String> signUpEmployee(@RequestBody EmployeeDTO dto) {
        String result = employeeService.signUpEmployee(dto);
        return ResponseEntity.ok(result);
    }

    @PutMapping
    public void updateEmployee(@RequestBody EmployeeDTO dto) {
        employeeService.updateEmployee(dto);
    }

    @DeleteMapping("/{empSeq}")
    public void leaveEmployee(@PathVariable int empSeq) {
        employeeService.leaveEmployee(empSeq);
    }

}
