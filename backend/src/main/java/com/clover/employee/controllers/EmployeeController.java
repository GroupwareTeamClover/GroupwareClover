package com.clover.employee.controllers;

import com.clover.approval.services.ApvLineService;
import com.clover.employee.dto.EmployeeDTO;
import com.clover.employee.service.EmployeeService;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/employee")
public class EmployeeController {

    @Autowired
    private EmployeeService employeeService;
    
    @Autowired
	private ApvLineService apvLineService;

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
    
    //전자결재 결재자 라인 선택시 임직원 정보 가져오기
    @GetMapping
	public ResponseEntity<List<Map<String,?>>> get(){
		return ResponseEntity.ok(apvLineService.getMemberInfo());
	}

}
