package com.gorkemuysal.birthdayTracker.contact;

import java.util.List;

import org.springframework.stereotype.Service;

import com.gorkemuysal.birthdayTracker.common.exception.DuplicateResourceException;
import com.gorkemuysal.birthdayTracker.common.exception.NotFoundException;
import com.gorkemuysal.birthdayTracker.contact.dto.CategoryRequest;
import com.gorkemuysal.birthdayTracker.contact.dto.CategoryResponse;
import com.gorkemuysal.birthdayTracker.contact.mapper.CategoryMapper;
import com.gorkemuysal.birthdayTracker.identity.User;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

// A main service class to handle category CRUD operations 
@Service
@RequiredArgsConstructor
public class CategoryServiceImpl implements CategoryService {

	private final CategoryRepository categoryRepository;
	private final CategoryMapper categoryMapper;

	/**
	 * Handles create new category. Checks is any category exists with same name.
	 * If it exists thrown an exception. Otherwise the category is saved.
	 * 
	 * @throws @DuplicateResourceException
	 * @return @CategoryResponse DTO object.
	 * */
	@Override
	@Transactional
	public CategoryResponse create(CategoryRequest request, User currentUser) {

		if (categoryRepository.existsByNameIgnoreCaseAndOwnerId(request.name(), currentUser.getId())) {
			throw new DuplicateResourceException("A category is already exists Witht this name: " + request.name());
		}
		Category category = categoryMapper.toEntity(request);
		category.setOwner(currentUser);

		Category saved = categoryRepository.save(category);
		return categoryMapper.toResponse(saved);
	}

	/**
	 * Finds category with entered id, which belongs to a current user.
	 * Again checks if category is exists or not
	 * 
	 * @throws @DuplicateResourceException
	 * @return @CategoryResponse DTO object.
	 * */
	@Override
	public CategoryResponse getById(Long id, User currentUser) {
		Category category = categoryRepository.findByIdAndOwnerId(id, currentUser.getId())
				.orElseThrow(() -> new NotFoundException("category not found with this id: " + id));
		return categoryMapper.toResponse(category);
	}

	/**
	 * Finds and return all categories which belongs to current user.
	 * 
	 * @return List of @CategoryResponse objects
	 * */
	@Override
	public List<CategoryResponse> getAll(User currentUser) {
		List<Category> categories = categoryRepository.findAllByOwnerId(currentUser.getId());
		return categoryMapper.toResponseList(categories);
	}

	/**
	 * Handles update a category.
	 * Checks is there any category with same name. 
	 * 
	 * @return @CategoryResponse dto object.
	 * */
	@Override
	@Transactional
	public CategoryResponse update(Long id, CategoryRequest request, User currentUser) {
		Category category = categoryRepository.findByIdAndOwnerId(id, currentUser.getId())
				.orElseThrow(() -> new NotFoundException("category not found with this id: " + id));

		boolean nameChanged = !category.getName().equalsIgnoreCase(request.name());

		if (nameChanged && categoryRepository.existsByNameIgnoreCaseAndOwnerId(request.name(), currentUser.getId())) {
			throw new DuplicateResourceException("A category is already exists Witht this name: " + request.name());
		}

		category.setName(request.name());
		category.setColor(request.color());

		return categoryMapper.toResponse(category);
	}

	/**
	 * handles delete category
	 * */
	@Override
	public void delete(Long id, User currentUser) {
		Category category = categoryRepository.findByIdAndOwnerId(id, currentUser.getId())
				.orElseThrow(() -> new NotFoundException("category not found with this id: " + id));

		categoryRepository.delete(category);

	}
}
