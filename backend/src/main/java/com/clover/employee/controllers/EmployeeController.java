package com.clover.employee.controllers;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.clover.approval.services.LineService;
import com.clover.employee.dto.EmployeeDTO;
import com.clover.employee.service.EmployeeService;

@RestController
@RequestMapping("/employee")
public class EmployeeController {

    @Autowired
    private EmployeeService employeeService;

    @Autowired
	private LineService lineService;

    @GetMapping("/{empSeq}")
    public ResponseEntity<Map<String, Object>> getMyInfo(@PathVariable int empSeq) {
        Map<String, Object> map = employeeService.getMyInfo(empSeq);
        System.out.println(map.get("EMP_AVATAR"));
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

    @PutMapping("/{empSeq}")
    public ResponseEntity<String> updateEmployee(@PathVariable int empSeq, @RequestBody EmployeeDTO dto) {
        String result = employeeService.updatePwEmployee(dto);
        return ResponseEntity.ok(result);
    }

    @DeleteMapping("/{empSeq}")
    public void leaveEmployee(@PathVariable int empSeq) {
        employeeService.leaveEmployee(empSeq);
    }

    /* 전자결재 결재자 라인 선택시 임직원 정보 가져오기 */
    @GetMapping
	public ResponseEntity<List<Map<String,?>>> get(){
		return ResponseEntity.ok(lineService.getMemberInfo());
	}

    @GetMapping("/exists")
    public ResponseEntity<EmployeeDTO> existsEmployee(String empName, String empId, String empEmail) {
        return ResponseEntity.ok(employeeService.existsEmployee(empName, empId, empEmail));
    }

}
