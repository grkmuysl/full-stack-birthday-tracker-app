package com.gorkemuysal.birthdayTracker.identity.security;

import java.util.Date;
import java.util.function.Function;

import javax.crypto.SecretKey;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

// main service class for the JWT 
@Service
public class JwtService {

	@Value("${jwt.secret}")
	private String secret;

	@Value("${jwt.access-token-ttl-minutes:15}")
	private long accessTokenTtlMinutes;
	
	private SecretKey signingKey() {
		return Keys.hmacShaKeyFor(secret.getBytes());
		
	}
	
	/**
	 * Generates access token according to CustomUserDetails object
	 * 
	 * @param userDetails as a @CustomUserDetails object
	 * @return access token as string object. Contains userId, role, key etc.
	 * */
	public String generateAccessToken(CustomUserDetails userDetails) {
		Date now = new Date();
        Date expiry = new Date(now.getTime() + accessTokenTtlMinutes * 60_000);
        
        return Jwts.builder()
                .subject(userDetails.getUsername())
                .claim("userId", userDetails.getId())
                .claim("role", userDetails.getUser().getRoleName().name())
                .issuedAt(now)
                .expiration(expiry)
                .signWith(signingKey())
                .compact();
	}
	
	// extracts email from token
	public String extractEmail(String token) {
        return extractClaim(token, Claims::getSubject);
    }

	// checks token is valid or not.
    public boolean isTokenValid(String token, CustomUserDetails userDetails) {
        try {
            String email = extractEmail(token);
            return email.equals(userDetails.getUsername()) && !isExpired(token);
        } catch (Exception e) {
            return false;
        }
    }

    // checks token expires
    private boolean isExpired(String token) {
        return extractClaim(token, Claims::getExpiration).before(new Date());
    }

    // helper function to extract claim
    private <T> T extractClaim(String token, Function<Claims, T> resolver) {
        Claims claims = Jwts.parser()
                .verifyWith(signingKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
        return resolver.apply(claims);
    }
}
