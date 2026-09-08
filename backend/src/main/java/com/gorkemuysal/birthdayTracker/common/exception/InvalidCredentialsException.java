package com.gorkemuysal.birthdayTracker.common.exception;

public class InvalidCredentialsException extends RuntimeException {
	 public InvalidCredentialsException() {
	        super("Invalid email or password.");
	    }
}
