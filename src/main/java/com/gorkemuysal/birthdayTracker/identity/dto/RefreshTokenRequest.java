package com.gorkemuysal.birthdayTracker.identity.dto;

import jakarta.validation.constraints.NotBlank;

public record RefreshTokenRequest(@NotBlank String refreshToken) {

}
