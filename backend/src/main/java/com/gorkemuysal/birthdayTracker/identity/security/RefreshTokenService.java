package com.gorkemuysal.birthdayTracker.identity.security;

import java.time.Instant;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.gorkemuysal.birthdayTracker.common.exception.InvalidTokenException;
import com.gorkemuysal.birthdayTracker.identity.RefreshToken;
import com.gorkemuysal.birthdayTracker.identity.RefreshTokenRepository;
import com.gorkemuysal.birthdayTracker.identity.User;

import lombok.RequiredArgsConstructor;

// main service class for handle the refresh token operations
@Service
@RequiredArgsConstructor
public class RefreshTokenService {

	private final RefreshTokenRepository refreshTokenRepository;

	@Value("${jwt.refresh-token-ttl-days:7}")
	private long refreshTokenTtlDays;

	// Issues a brand new refresh token, e.g. right after register/login
	public RefreshToken issueToken(User user) {
		RefreshToken refreshToken = new RefreshToken(UUID.randomUUID().toString(), user,
				Instant.now().plusSeconds(refreshTokenTtlDays * 24 * 60 * 60));
		return refreshTokenRepository.save(refreshToken);
	}

	// Validates the incoming token, then rotates it: the old one is revoked
	// and a fresh one is issued for the same user (rotation pattern)
	public RefreshToken rotate(String rawToken) {
		RefreshToken existing = refreshTokenRepository.findByToken(rawToken)
				.orElseThrow(() -> new InvalidTokenException("Refresh token is not found"));

		if (existing.isRevoked() || existing.getExpiresAt().isBefore(Instant.now())) {
			throw new InvalidTokenException("Refresh token is invalid or it has expired");
		}

		existing.setRevoked(true);
		refreshTokenRepository.save(existing);

		return issueToken(existing.getUser());
	}

	public void revokeAllForUser(Long userId) {
		refreshTokenRepository.revokeAllForUser(userId);
	}
}
