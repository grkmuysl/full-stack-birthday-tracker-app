package com.gorkemuysal.birthdayTracker.contact;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface PersonRepository extends JpaRepository<Person, Long>{
	Optional<Person> findByIdAndOwnerId(Long id, Long ownerId);

	boolean existsByIdAndOwnerId(Long id, Long ownerId);

	Page<Person> findAllByOwnerId(Long ownerId, Pageable pageable);
	
	
	@Query("""
			SELECT p FROM Person p
			WHERE p.owner.id = :ownerId
			AND (:categoryId IS NULL OR p.category.id = :categoryId)
			AND (
				:upcomingDays IS NULL
				OR FUNCTION('to_char', p.birthDate, 'MM-DD')
					BETWEEN FUNCTION('to_char', CURRENT_DATE, 'MM-DD')
					AND FUNCTION('to_char', CURRENT_DATE + :upcomingDays, 'MM-DD')
			)
			""")
	Page<Person> search(@Param("ownerId") Long ownerId,
			@Param("categoryId") Long categoryId,
			@Param("upcomingDays") Integer upcomingDays,
			Pageable pageable);
}
