package com.clover.employee.controllers;

import com.clover.employee.dto.EmployeeDTO;
import com.clover.employee.service.EmployeeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/employee")
public class EmployeeController {

    @Autowired
    private EmployeeService employeeService;

    @GetMapping("/{empSeq}")
    public EmployeeDTO getMyInfo(@PathVariable int empSeq) {
        return employeeService.getMyInfo(empSeq);
    }

    @PostMapping
    public void signUpEmployee(@RequestBody EmployeeDTO dto) {
        employeeService.signUpEmployee(dto);
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
