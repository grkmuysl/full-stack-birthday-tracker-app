package com.gorkemuysal.birthdayTracker.identity.security;

import java.io.IOException;

import org.springframework.http.HttpStatus;
import org.springframework.http.ProblemDetail;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;


import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import tools.jackson.databind.ObjectMapper;

/*
 * Custom Authentication Entry Point class implements AuthenticationEntryPoint
 * Checks http reqeust if request is invalid returns Problem details object with 401 STATUS CODE
 * If request is valid then sets status and content type.
 *  
 * **/
@Component
@RequiredArgsConstructor
public class CustomAuthenticationEntryPoint implements AuthenticationEntryPoint {
	
	 private final ObjectMapper objectMapper;
	
	 @Override
	    public void commence(HttpServletRequest request, HttpServletResponse response,
	                          AuthenticationException authException) throws IOException {

	        ProblemDetail problem = ProblemDetail.forStatusAndDetail(
	                HttpStatus.UNAUTHORIZED, "Authentication required or token invalid.");
	        problem.setTitle("Unauthorized");

	        response.setStatus(HttpStatus.UNAUTHORIZED.value());
	        response.setContentType("application/json");
	        response.getWriter().write(objectMapper.writeValueAsString(problem));
	    }

}
