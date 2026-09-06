package com.gorkemuysal.birthdayTracker.identity.security;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.gorkemuysal.birthdayTracker.identity.User;
import com.gorkemuysal.birthdayTracker.identity.UserRepository;

import lombok.RequiredArgsConstructor;

// Custom user details service 
@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService{
	
	private final UserRepository userRepository;
	
	/*
	 * Find Users with entered email. Throws exception if user not found with entered email
	 * Then return found user as a UserDetails object
	 * 
	 * @param email as a string
	 * @throws UsernameNotFoundException
	 * @return @UserDetails object
	 * **/
	@Override
	public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {

		User user = userRepository.findByEmail(email)
				.orElseThrow(() -> new UsernameNotFoundException("User not found with this email: " + email));
				
		return new CustomUserDetails(user);
	}

}
