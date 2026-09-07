package com.gorkemuysal.birthdayTracker.contact.dto;

import java.time.Instant;
import java.time.LocalDate;

public record PersonResponse(
		 	Long id,
	        String fullName,
	        LocalDate birthDate,
	        boolean birthYearKnown,
	        String note,
	        String photoUrl,
	        CategoryResponse category,
	        Instant createdAt,
	        Instant updatedAt
		) {

}
