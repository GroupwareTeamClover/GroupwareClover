package com.clover.messenger.controllers;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.clover.messenger.services.ChatProfileService;
import com.clover.messenger.services.UserSessionService;

import jakarta.servlet.http.HttpSession;

@RestController
@RequestMapping("/chat")
public class ProfileController {
    @Autowired
    private ChatProfileService chatProfileService; 

    @Autowired
    private UserSessionService userSessionService;

    @Autowired
    private HttpSession session;

    /**
     * 회사 내 조직도를 조회하는 API 엔드포인트
     * @return 회사 내 조직도
     */
    @GetMapping("/organization")
    public ResponseEntity<List<HashMap<String, Object>>> getAllData() {
        return ResponseEntity.ok(chatProfileService.getOrganization());  
    }

    /**
     * 프로필 정보를 조회하는 API 엔드포인트
     * @param empSeq 조회할 사용자의 사원 번호 (옵션)
     * @param session HTTP 세션
     * @return 프로필 정보
     */
    @GetMapping("/profile")
    public ResponseEntity<HashMap<String, Object>> getProfile(@RequestParam(required = false) Integer empSeq, HttpSession session) {
        if (empSeq == null) {
            empSeq = (Integer) session.getAttribute("cloverSeq");
            System.out.println("Session에서 가져온 empSeq: " + empSeq);
        }
        if (empSeq == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        HashMap<String, Object> profile = chatProfileService.getProfile(empSeq);  
        System.out.println("가져온 프로필 정보: " + profile);
        return ResponseEntity.ok(profile);
    }

    /**
     * 온라인 사용자 목록을 조회하는 API 엔드포인트
     * @param session HTTP 세션
     * @return 온라인 사용자 목록
     */
    @GetMapping("/online-users")
    public ResponseEntity<List<Map<String, Object>>> getOnlineUsers(HttpSession session) {
        Integer deptCode = (Integer) session.getAttribute("cloverDeptCode");
        if (deptCode == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        List<Map<String, Object>> onlineUsers = userSessionService.getOnlineUsersByDeptCode(deptCode);
        return ResponseEntity.ok(onlineUsers);
    }
}
