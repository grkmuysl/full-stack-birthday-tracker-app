package com.gorkemuysal.birthdayTracker.identity;

import com.gorkemuysal.birthdayTracker.common.BaseEntity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Email;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Table(name = "users")
@Entity
@Getter
@Setter
@NoArgsConstructor
public class User extends BaseEntity{
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	
	@Email
	@Column(name = "email", nullable = false, unique = true)
	private String email;
	
	@Column(name = "password_hash" , nullable = false)
	private String passwordHash;
	
	@Column(name = "full_name", nullable = false)
	private String fullName;
	

	@Enumerated(EnumType.STRING)
	@Column(nullable = false)
	private RoleName roleName = RoleName.USER;
	
	
}
