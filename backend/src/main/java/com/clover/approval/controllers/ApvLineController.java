package com.clover.approval.controllers;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.clover.approval.services.ApvLineService;

@RestController
@RequestMapping("/apvLine")
public class ApvLineController {
	
	@Autowired
	private ApvLineService apvLineService;
	
	//임시위치 -> 추루 컨트롤러 변경해야함
	//멤버의 부서이름, 직원이름, 직급이름을 받아오는 코드
	

}
