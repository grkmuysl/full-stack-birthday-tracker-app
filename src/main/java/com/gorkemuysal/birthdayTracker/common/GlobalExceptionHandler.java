package com.gorkemuysal.birthdayTracker.common;

import java.time.Instant;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ProblemDetail;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import com.gorkemuysal.birthdayTracker.common.exception.DuplicateResourceException;
import com.gorkemuysal.birthdayTracker.common.exception.InvalidCredentialsException;
import com.gorkemuysal.birthdayTracker.common.exception.NotFoundException;


/**
 * Main exception handler for all REST controllers Converts exception thrown
 * anywhere in the controller/service layer into a consistent
 * {@link ProblemDetail} response body.
 * 
 * Note: this class NOT handle exceptions thrown from the Spring Security filter
 * chain. Those are handled by {@code CustomAuthenticationEntryPoint} and
 * {@code CustomAccessDeniedHandler}
 */
@RestControllerAdvice
public class GlobalExceptionHandler {

	private static final Logger log = LoggerFactory.getLogger(GlobalExceptionHandler.class);

	/*
	 * Handles cases where a request resource does not exist. Logged at WARN level
	 * because this is an excepted client error, not a server bug.
	 * 
	 * @param ex the thrown exception containing the error message
	 * 
	 * @return 404 NOT_FOUND problem detail response
	 */
	@ExceptionHandler(NotFoundException.class)
	public ProblemDetail handleNotFound(NotFoundException ex) {
		log.warn("Resource not found: {}", ex.getMessage());

		ProblemDetail problem = ProblemDetail.forStatusAndDetail(HttpStatus.NOT_FOUND, ex.getMessage());
		problem.setTitle("Resource not found");
		problem.setProperty("timestamp", Instant.now());

		return problem;
	}

	/**
	 * Handles cases involving attempts to perform operations using with the same
	 * resource.
	 * 
	 * @param ex the duplicate resourse exception contains error message
	 * @return 409 CONFLICT problem detail response
	 */
	@ExceptionHandler(DuplicateResourceException.class)
	public ProblemDetail handleDuplicateResourceError(DuplicateResourceException ex) {
		log.warn("Resource conflict: {}", ex.getMessage());

		ProblemDetail problem = ProblemDetail.forStatusAndDetail(HttpStatus.CONFLICT, ex.getMessage());

		problem.setTitle("Duplicate Resource error");
		problem.setProperty("timestamp", Instant.now());
		return problem;
	}

	/**
	 * Handles authentication failures. When an email and password does not matches
	 * with database
	 * 
	 * @param ex the invalid creaditials exception contains error message
	 * @return 401 UNAUTHORIZED problem detail response
	 * 
	 */
	@ExceptionHandler(com.gorkemuysal.birthdayTracker.common.exception.InvalidCredentialsException.class)
	public ProblemDetail handleInvalidCredentials(InvalidCredentialsException ex) {

		log.warn("Authentication failed: {}", ex.getMessage());

		ProblemDetail problem = ProblemDetail.forStatusAndDetail(HttpStatus.UNAUTHORIZED, ex.getMessage());
		problem.setTitle("Invalid credentials");
		problem.setProperty("timestamp", Instant.now());
		return problem;

	}
	
}
