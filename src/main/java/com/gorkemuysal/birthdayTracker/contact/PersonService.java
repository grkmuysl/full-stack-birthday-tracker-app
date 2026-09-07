package com.gorkemuysal.birthdayTracker.contact;

import org.springframework.data.domain.Pageable;

import com.gorkemuysal.birthdayTracker.common.PagedResponse;
import com.gorkemuysal.birthdayTracker.contact.dto.PersonRequest;
import com.gorkemuysal.birthdayTracker.contact.dto.PersonResponse;
import com.gorkemuysal.birthdayTracker.identity.User;

public interface PersonService {

	PersonResponse create(PersonRequest request, User currentUser);
	
	PersonResponse getById(Long id, User currentUser);

	PagedResponse<PersonResponse> getAll(Long categoryId, Integer upcomingDays, Pageable pageable, User currentUser);

	PersonResponse update(Long id, PersonRequest request, User currentUser);

	void delete(Long id, User currentUser);
}
