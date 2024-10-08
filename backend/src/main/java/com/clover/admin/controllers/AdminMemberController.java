package com.clover.admin.controllers;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.clover.admin.dto.AdminUpdateMemDTO;
import com.clover.admin.services.AdminMemberService;
import com.clover.employee.dto.EmployeeDTO;

@RestController
@RequestMapping("/adminmember")
public class AdminMemberController {

	@Autowired
	private AdminMemberService adminmemberService;
	
	
	@GetMapping
	public ResponseEntity<List<HashMap<String, Object>>> getAllData(){
		return ResponseEntity.ok(adminmemberService.getAllData());
	}
	@GetMapping("/deptName")
	public ResponseEntity<List<HashMap<String, Object>>> getAllDept(){
		return ResponseEntity.ok(adminmemberService.getAllDept());
	}
	@GetMapping("/roleName")
	public ResponseEntity<List<HashMap<String, Object>>> getAllRole(){
		return ResponseEntity.ok(adminmemberService.getAllRole());
	}
	@GetMapping("/workName")
	public ResponseEntity<List<HashMap<String, Object>>> getAllWork(){
		return ResponseEntity.ok(adminmemberService.getAllWork());
	}
	@GetMapping("/empState")
	public ResponseEntity<List<HashMap<String, Object>>> getAllEmp(){
		return ResponseEntity.ok(adminmemberService.getAllEmp());
	}
	
	@GetMapping("/countmem")
	public ResponseEntity<List<HashMap<String,Object>>> getCountMem(){
		return ResponseEntity.ok(adminmemberService.getCountMem());
	}
	
	@GetMapping("/gender")
	public ResponseEntity<List<HashMap<String,Object>>> getGender(){
		return ResponseEntity.ok(adminmemberService.getGender());
	}
	@GetMapping("/worker")
	public ResponseEntity<List<HashMap<String,Object>>> getWorker(){
		return ResponseEntity.ok(adminmemberService.getWorker());
	}
	@GetMapping("/countNewMonth")
	public ResponseEntity<List<HashMap<String,Object>>> getNewMonth(){
		return ResponseEntity.ok(adminmemberService.getNewMonth());
	}
	@GetMapping("/exit")
	public ResponseEntity<List<EmployeeDTO>> getExit(){
		return ResponseEntity.ok(adminmemberService.getExit());
	}
	@GetMapping("/deptCount")
	public ResponseEntity<List<HashMap<String,Object>>> getDept(){
		return ResponseEntity.ok(adminmemberService.getDept());
	}
	
	@PutMapping
	public ResponseEntity<Void> updateMultiMemState(@RequestBody AdminUpdateMemDTO updto){
		adminmemberService.updateMemState(updto);
		return ResponseEntity.ok().build();
	}
	
	@PostMapping("/addDept")
    public ResponseEntity<Void> addDepartment(@RequestBody Map<String, String> deptData) {
        try {
        	String deptName = deptData.get("deptName");
        	String deptCode = deptData.get("minDeptCode");
            adminmemberService.addDepartment(deptName, deptCode);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
	
	 @GetMapping("/organization")
	    public ResponseEntity<List<HashMap<String, Object>>> getOrganization() {
	        return ResponseEntity.ok(adminmemberService.getOrganization());  
	    }
	
	
}
