package com.gorkemuysal.birthdayTracker.contact;


import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.gorkemuysal.birthdayTracker.common.PagedResponse;
import com.gorkemuysal.birthdayTracker.contact.dto.PersonRequest;
import com.gorkemuysal.birthdayTracker.contact.dto.PersonResponse;
import com.gorkemuysal.birthdayTracker.identity.User;

import io.swagger.v3.oas.annotations.parameters.RequestBody;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/people")
@RequiredArgsConstructor
public class PersonController {
	private final PersonService personService;
	
	@PostMapping
	public ResponseEntity<PersonResponse> create(@Valid @RequestBody PersonRequest request,
			@AuthenticationPrincipal User currentUser) {
		PersonResponse response = personService.create(request, currentUser);
		return ResponseEntity.status(HttpStatus.CREATED).body(response);
	}

	@GetMapping("/{id}")
	public ResponseEntity<PersonResponse> getById(@PathVariable Long id,
			@AuthenticationPrincipal User currentUser) {
		return ResponseEntity.ok(personService.getById(id, currentUser));
	}

	@GetMapping
	public ResponseEntity<PagedResponse<PersonResponse>> getAll(
			@RequestParam(required = false) Long category,
			@RequestParam(required = false) Integer upcomingDays,
			Pageable pageable,
			@AuthenticationPrincipal User currentUser) {
		return ResponseEntity.ok(personService.getAll(category, upcomingDays, pageable, currentUser));
	}

	@PutMapping("/{id}")
	public ResponseEntity<PersonResponse> update(@PathVariable Long id,
			@Valid @RequestBody PersonRequest request,
			@AuthenticationPrincipal User currentUser) {
		return ResponseEntity.ok(personService.update(id, request, currentUser));
	}

	@DeleteMapping("/{id}")
	public ResponseEntity<Void> delete(@PathVariable Long id, @AuthenticationPrincipal User currentUser) {
		personService.delete(id, currentUser);
		return ResponseEntity.noContent().build();
	}
}
