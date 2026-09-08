package com.gorkemuysal.birthdayTracker.common;

import java.util.List;

import org.springframework.data.domain.Page;

// a dto file to return paged responses
public record PagedResponse<T>(
		List<T> content,
		int pageNumber,
		int pageSize,
		long totalElements,
		int totalPages,
		boolean last
		) {

	public static <T> PagedResponse<T> from(Page<T> page) {
		return new PagedResponse<>(
				page.getContent(),
				page.getNumber(),
				page.getSize(),
				page.getTotalElements(),
				page.getTotalPages(),
				page.isLast()
		);
	}
}
