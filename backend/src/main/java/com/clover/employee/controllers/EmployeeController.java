package com.clover.employee.controllers;

import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.util.Map;

import com.clover.commons.services.S3Service;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.clover.employee.dto.EmployeeDTO;
import com.clover.employee.services.EmployeeService;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/employee")
public class EmployeeController {
    @Autowired
    private S3Service s3Service;

    @Autowired
    private EmployeeService employeeService;

    @Autowired
    private HttpSession session;


    @GetMapping
    public ResponseEntity<Map<String, Object>> getMyInfo() {
        int empSeq = (int) session.getAttribute("cloverSeq");
        Map<String, Object> map = employeeService.getMyInfo(empSeq);
        return ResponseEntity.ok(map);
    }

    @PostMapping
    public ResponseEntity<String> signUpEmployee(@RequestBody EmployeeDTO dto) {
        String result = employeeService.signUpEmployee(dto);
        return ResponseEntity.ok(result);
    }

    @PutMapping
    public ResponseEntity<String> updateEmployee(@RequestBody EmployeeDTO dto) {
        dto.setEmpSeq((int)session.getAttribute("cloverSeq"));
        String result = employeeService.updateEmployee(dto);
        return ResponseEntity.ok(result);
    }

    @PutMapping("/{empSeq}")
    public ResponseEntity<String> updatePwEmployee(@PathVariable int empSeq, @RequestBody EmployeeDTO dto) {
        String result = employeeService.updatePwEmployee(dto);
        return ResponseEntity.ok(result);
    }

    @PutMapping("/profile")
    public ResponseEntity<String> updateAvatarEmployee(@RequestParam("file") MultipartFile file) {
        String result = "fail";
        try{
            String decodePath = URLDecoder.decode("profile", StandardCharsets.UTF_8);
            String fileUrl = s3Service.uploadFile(file, decodePath);
            if(fileUrl != null) {
                EmployeeDTO dto = new EmployeeDTO();
                dto.setEmpSeq((int)session.getAttribute("cloverSeq"));
                dto.setEmpAvatar(fileUrl);
                result = employeeService.updateAvatarEmployee(dto);
                if(result.equals("ok")) return ResponseEntity.ok(fileUrl);
            }
        } catch (Exception e) {}

        return ResponseEntity.ok(result);
    }


    @DeleteMapping("/{empSeq}")
    public void leaveEmployee(@PathVariable int empSeq) {
        employeeService.leaveEmployee(empSeq);
    }


    @GetMapping("/exists")
    public ResponseEntity<EmployeeDTO> existsEmployee(String empName, String empId, String empEmail) {
        return ResponseEntity.ok(employeeService.existsEmployee(empName, empId, empEmail));
    }

}
