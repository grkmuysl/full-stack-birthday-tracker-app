package com.gorkemuysal.birthdayTracker.identity;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

// main Repository for the User entities
public interface UserRepository extends JpaRepository<User, Long>{

	public Optional<User> findByEmail(String email);
}
