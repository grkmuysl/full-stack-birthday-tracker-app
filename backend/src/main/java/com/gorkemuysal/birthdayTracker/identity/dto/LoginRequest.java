package com.gorkemuysal.birthdayTracker.identity.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

//Dto class to represent login requests
public record LoginRequest(
		@NotBlank @Email  String email,
		@NotBlank String password
		) {

}
