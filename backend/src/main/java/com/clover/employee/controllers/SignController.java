package com.clover.employee.controllers;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.http.server.ServerHttpRequest;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;

import com.clover.admin.dto.AdminLogDTO;
import com.clover.admin.services.AdminLogService;
import com.clover.employee.dto.EmployeeDTO;
import com.clover.employee.services.EmployeeService;
import com.clover.messenger.services.UserSessionService;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;

@RestController
@RequestMapping("/sign")
public class SignController {

    @Autowired
    private UserSessionService userSessionService;
    @Autowired
    private SimpMessagingTemplate messagingTemplate;    

    @Autowired
    private EmployeeService employeeService;
    
    @Autowired
    private AdminLogService adminlogService;

    @Autowired
    private HttpSession session;

    @PostMapping
    public ResponseEntity<?> signIn(@RequestBody EmployeeDTO dto, HttpServletRequest request) {
        EmployeeDTO empInfo = employeeService.SignIn(dto);
        
        // 정하윤 로그아이피
        String clientIp = getClientIp(request);	// ip주소 가져오기 
        LocalDateTime localLogTime = LocalDateTime.now(); // 접속시간
     
        if(empInfo != null) {
            session.setAttribute("cloverSeq", empInfo.getEmpSeq());
            session.setAttribute("cloverId", empInfo.getEmpId());
            session.setAttribute("cloverName", empInfo.getEmpName());
            session.setAttribute("cloverAvatar", empInfo.getEmpAvatar());
            session.setAttribute("cloverDeptCode", empInfo.getDeptCode());
            session.setAttribute("cloverRoleCode", empInfo.getRoleCode());
            if(empInfo.getEmpStateCode() == 0) session.setAttribute("cloverAdmin", empInfo.getEmpStateCode());
            
            // 조진혁 웹소켓 로그인
            // WebSocket 연결을 위한 고유 식별자 생성
            String wsToken = UUID.randomUUID().toString();
            session.setAttribute("wsToken", wsToken);

            Map<String, Object> response = new HashMap<>();
            response.put("employeeInfo", empInfo);
            response.put("wsToken", wsToken);

            

            // 정하윤 로그 아이피 AdminLogService로 보내기 : 로그 기록 테이블에 insert하게. 
   
            AdminLogDTO adminlogdto = new AdminLogDTO(0, empInfo.getEmpSeq(), empInfo.getEmpName(), dto.getEmpId(),
            		empInfo.getDeptCode(), clientIp, localLogTime, "로그인 성공");
            adminlogService.insertLog(adminlogdto);
           
            
            return ResponseEntity.ok(response);
        }
        // 정하윤 : 로그인 실패한 로그 기록 테이블에 insert. 
        AdminLogDTO adminlogdto = new AdminLogDTO(0, 0, "", dto.getEmpId(), 0, clientIp, localLogTime, "로그인 실패");
        adminlogService.insertLog(adminlogdto);

        return null;
//        return ResponseEntity.badRequest().body("로그인 실패");
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

   
    // 정하윤 - ip주소 가져오는 메서드
    // 네트워크 환경과 설정에 따라 ip주소 헤더가 달라질 수 있기때문에 분리. 보통 x-forwarded-for가 붙어있음. 
    
    private String getClientIp(HttpServletRequest request) {
        String clientIp = request.getHeader("X-Forwarded-For");
        if (clientIp != null && !clientIp.isEmpty() && !"unknown".equalsIgnoreCase(clientIp)) {
            return clientIp.split(",")[0].trim(); // 첫 번째 IP 주소 반환
        }

        clientIp = request.getHeader("X-Real-IP");
        if (clientIp != null && !clientIp.isEmpty() && !"unknown".equalsIgnoreCase(clientIp)) {
            return clientIp;
        }

        clientIp = request.getHeader("Forwarded");
        if (clientIp != null && !clientIp.isEmpty() && clientIp.startsWith("for=")) {
            return clientIp.substring(4).split(";")[0]; // "for=" 뒤의 IP 주소 반환
        }

        clientIp = request.getHeader("X-Cluster-Client-IP");
        if (clientIp != null && !clientIp.isEmpty() && !"unknown".equalsIgnoreCase(clientIp)) {
            return clientIp;
        }

        return request.getRemoteAddr(); // 위의 헤더가 없으면 기본 IP 주소 반환
    }


}
