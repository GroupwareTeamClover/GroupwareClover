package com.clover.interceptors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

import com.clover.admin.services.AdminMemberService;
import com.clover.employee.dto.EmployeeDTO;
import com.clover.messenger.services.UserSessionService;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

@Component
public class CustomHandleAdminInterceptor implements HandlerInterceptor{
	
	@Autowired
    private UserSessionService userSessionService;

	@Override
	public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {

        HttpSession session = request.getSession(false); // false를 사용하여 세션이 없으면 새로 생성하지 않음

        if (session == null || session.getAttribute("cloverSeq") == null) {
            System.out.println("세션이 없음.");
            return false; // 로그인되지 않은 경우 연결 거부
        }


        else if (session.getAttribute("cloverAdmin") == null) {
            System.out.println("관리자가 아님.");
            return false; // 관리자가 아니면 연결 거부
        }
        else {

        System.out.println("사용자임");
       return true;
        }
	}


}



















