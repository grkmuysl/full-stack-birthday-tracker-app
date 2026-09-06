package com.gorkemuysal.birthdayTracker.identity;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.gorkemuysal.birthdayTracker.common.exception.DuplicateResourceException;
import com.gorkemuysal.birthdayTracker.identity.dto.LoginRequest;
import com.gorkemuysal.birthdayTracker.identity.dto.RegisterRequest;
import com.gorkemuysal.birthdayTracker.identity.dto.TokenResponse;
import com.gorkemuysal.birthdayTracker.identity.security.CustomUserDetails;
import com.gorkemuysal.birthdayTracker.identity.security.JwtService;
import com.gorkemuysal.birthdayTracker.identity.security.RefreshTokenService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final RefreshTokenService refreshTokenService;

    // Creates the account and logs the user in right away, so the client
    // doesn't need a second call to /login immediately after signup
    @Transactional
    public TokenResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.email())) {
            throw new DuplicateResourceException("This email is already registered: " + request.email());
        }

        User user = new User();
        user.setEmail(request.email());
        user.setPasswordHash(passwordEncoder.encode(request.password()));
        user.setFullName(request.fullName());
        user.setRoleName(RoleName.USER);
        userRepository.save(user);

        return issueTokens(user);
    }

    // Delegates credential checking to Spring Security, which under the hood
    // uses our DaoAuthenticationProvider (UserDetailsService + PasswordEncoder)
    public TokenResponse login(LoginRequest request) {
        var authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.email(), request.password()));

        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        return issueTokens(userDetails.getUser());
    }

    // Exchanges a valid refresh token for a brand new access + refresh token pair
    @Transactional
    public TokenResponse refresh(String rawRefreshToken) {
        RefreshToken newRefreshToken = refreshTokenService.rotate(rawRefreshToken);
        User user = newRefreshToken.getUser();

        String accessToken = jwtService.generateAccessToken(new CustomUserDetails(user));
        return new TokenResponse(accessToken, newRefreshToken.getToken());
    }

    // Revokes every refresh token this user has — logs them out on all devices.
    // The current access token stays valid until it naturally expires (short TTL by design).
    @Transactional
    public void logout(Long userId) {
        refreshTokenService.revokeAllForUser(userId);
    }

    private TokenResponse issueTokens(User user) {
        String accessToken = jwtService.generateAccessToken(new CustomUserDetails(user));
        RefreshToken refreshToken = refreshTokenService.issueToken(user);
        return new TokenResponse(accessToken, refreshToken.getToken());
    }
}