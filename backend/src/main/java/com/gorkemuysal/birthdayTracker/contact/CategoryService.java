package com.gorkemuysal.birthdayTracker.contact;

import java.util.List;

import com.gorkemuysal.birthdayTracker.contact.dto.CategoryRequest;
import com.gorkemuysal.birthdayTracker.contact.dto.CategoryResponse;
import com.gorkemuysal.birthdayTracker.identity.User;

public interface CategoryService {
	CategoryResponse create(CategoryRequest request, User currentUser);

	CategoryResponse getById(Long id, User currentUser);

	List<CategoryResponse> getAll(User currentUser);

	CategoryResponse update(Long id, CategoryRequest request, User currentUser);

	void delete(Long id, User currentUser);
}
