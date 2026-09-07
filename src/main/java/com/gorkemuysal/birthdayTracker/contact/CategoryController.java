package com.gorkemuysal.birthdayTracker.contact;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.gorkemuysal.birthdayTracker.contact.dto.CategoryRequest;
import com.gorkemuysal.birthdayTracker.contact.dto.CategoryResponse;
import com.gorkemuysal.birthdayTracker.identity.User;

import io.swagger.v3.oas.annotations.parameters.RequestBody;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

// A main controller class to handle CRUD operations of categories
@RestController
@RequestMapping("/api/v1/categories")
@RequiredArgsConstructor
public class CategoryController {

	private final CategoryService categoryService;
	
	@PostMapping
	public ResponseEntity<CategoryResponse> create(@Valid @RequestBody CategoryRequest request,
			@AuthenticationPrincipal User currentUser) {
		CategoryResponse response = categoryService.create(request, currentUser);
		return ResponseEntity.status(HttpStatus.CREATED).body(response);
	}

	@GetMapping("/{id}")
	public ResponseEntity<CategoryResponse> getById(@PathVariable Long id,
			@AuthenticationPrincipal User currentUser) {
		return ResponseEntity.ok(categoryService.getById(id, currentUser));
	}

	@GetMapping
	public ResponseEntity<List<CategoryResponse>> getAll(@AuthenticationPrincipal User currentUser) {
		return ResponseEntity.ok(categoryService.getAll(currentUser));
	}

	@PutMapping("/{id}")
	public ResponseEntity<CategoryResponse> update(@PathVariable Long id,
			@Valid @RequestBody CategoryRequest request,
			@AuthenticationPrincipal User currentUser) {
		return ResponseEntity.ok(categoryService.update(id, request, currentUser));
	}

	@DeleteMapping("/{id}")
	public ResponseEntity<Void> delete(@PathVariable Long id, @AuthenticationPrincipal User currentUser) {
		categoryService.delete(id, currentUser);
		return ResponseEntity.noContent().build();
	}
}
