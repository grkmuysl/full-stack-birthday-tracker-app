package com.gorkemuysal.birthdayTracker.contact.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public record CategoryRequest(@NotBlank(message = "Name cannot be blank") String name,

		@NotBlank(message = "Color code cannot be blank") 
		@Pattern(regexp = "^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$", message = "Color must be a valid hex code (e.g. #F4B183)") 
		String color)
{

}
