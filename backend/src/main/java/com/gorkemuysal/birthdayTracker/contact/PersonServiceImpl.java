package com.gorkemuysal.birthdayTracker.contact;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.gorkemuysal.birthdayTracker.common.PagedResponse;
import com.gorkemuysal.birthdayTracker.common.exception.NotFoundException;
import com.gorkemuysal.birthdayTracker.contact.dto.PersonRequest;
import com.gorkemuysal.birthdayTracker.contact.dto.PersonResponse;
import com.gorkemuysal.birthdayTracker.contact.mapper.PersonMapper;
import com.gorkemuysal.birthdayTracker.identity.User;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

// A main Service for the Persons.
@Service
@RequiredArgsConstructor
public class PersonServiceImpl implements PersonService {

	private final PersonRepository personRepository;
	private final CategoryRepository categoryRepository;
	private final PersonMapper personMapper;

	@Override
	@Transactional
	public PersonResponse create(PersonRequest request, User currentUser) {

		Person person = personMapper.toEntity(request);
		person.setOwner(currentUser);
		person.setCategory(resolveCategory(request.categoryId(), currentUser));

		Person saved = personRepository.save(person);
		return personMapper.toResponse(saved);

	}

	@Override
	public PersonResponse getById(Long id, User currentUser) {
		Person person = personRepository.findByIdAndOwnerId(id, currentUser.getId())
				.orElseThrow(() -> new NotFoundException("User not found"));
	
		return personMapper.toResponse(person);
	}

	@Override
	public PagedResponse<PersonResponse> getAll(Long categoryId, Integer upcomingDays, Pageable pageable,
	        User currentUser) {

	    Page<Person> result;

	    if (upcomingDays != null) {
	        LocalDate today = LocalDate.now();
	        LocalDate until = today.plusDays(upcomingDays);
	        DateTimeFormatter fmt = DateTimeFormatter.ofPattern("MM-dd");
	        String fromMonthDay = today.format(fmt);
	        String toMonthDay = until.format(fmt);

	        result = personRepository.searchWithDateFilter(
	                currentUser.getId(), categoryId, fromMonthDay, toMonthDay, pageable);
	    } else {
	        result = personRepository.searchWithoutDateFilter(
	                currentUser.getId(), categoryId, pageable);
	    }

	    return PagedResponse.from(result.map(personMapper::toResponse));
	}

	@Override
	@Transactional
	public PersonResponse update(Long id, PersonRequest request, User currentUser) {
		Person person = personRepository.findByIdAndOwnerId(id, currentUser.getId())
				.orElseThrow(() -> new NotFoundException("User not found"));
		
		personMapper.updateEntityFromRequest(request, person);
		person.setCategory(resolveCategory(request.categoryId(), currentUser));

		return personMapper.toResponse(person);
	}

	@Override
	@Transactional
	public void delete(Long id, User currentUser) {
		Person person = personRepository.findByIdAndOwnerId(id, currentUser.getId())
				.orElseThrow(() -> new NotFoundException("User not found"));
		
		personRepository.delete(person);

	}

	// A helper function to get category of current user with specific ID nnumber
	private Category resolveCategory(Long categoryId, User currentUser) {
		
		if (categoryId == null) {
			return null;
		}
		return categoryRepository.findByIdAndOwnerId(categoryId, currentUser.getId())
				.orElseThrow(() -> new NotFoundException("Category not found: " + categoryId));
	}
	
}
