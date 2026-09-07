package com.gorkemuysal.birthdayTracker.contact.dto;

import java.time.LocalDate;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Past;

public record PersonRequest(
		 	@NotBlank(message = "Name cannot be blank")
	        String fullName,

	        @NotNull(message = "The date of birth is required.")
	        @Past(message = "The date of birth must be in the past.")
	        LocalDate birthDate,

	        boolean birthYearKnown,

	        String note,

	        Long categoryId
		) {

}
