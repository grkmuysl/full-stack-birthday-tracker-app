package com.gorkemuysal.birthdayTracker.identity;

import java.time.Instant;

import com.gorkemuysal.birthdayTracker.common.BaseEntity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "refresh_tokens")
@Getter
@Setter
@NoArgsConstructor
public class RefreshToken extends BaseEntity{

	  @Id
	    @GeneratedValue(strategy = GenerationType.IDENTITY)
	    private Long id;

	    @Column(nullable = false, unique = true)
	    private String token;

	    @ManyToOne(fetch = FetchType.LAZY)
	    @JoinColumn(name = "user_id", nullable = false)
	    private User user;

	    @Column(nullable = false)
	    private Instant expiresAt;

	    @Column(nullable = false)
	    private boolean revoked = false;

	    public RefreshToken(String token, User user, Instant expiresAt) {
	        this.token = token;
	        this.user = user;
	        this.expiresAt = expiresAt;
	    }
}
