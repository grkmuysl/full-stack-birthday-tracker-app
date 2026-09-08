package com.gorkemuysal.birthdayTracker.identity.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

// Dto class to represent register requests
public record RegisterRequest(
		@NotBlank @Email String email,
		@NotBlank @Size(max = 150) String fullName,
		@NotBlank  @Size(min = 3, max = 100) String password
		) {

}
