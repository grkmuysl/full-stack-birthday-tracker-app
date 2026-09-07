package com.gorkemuysal.birthdayTracker.contact.mapper;

import java.util.List;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

import com.gorkemuysal.birthdayTracker.contact.Person;
import com.gorkemuysal.birthdayTracker.contact.dto.PersonRequest;
import com.gorkemuysal.birthdayTracker.contact.dto.PersonResponse;

@Mapper(componentModel = "spring", uses = CategoryMapper.class)
public interface PersonMapper {

	 PersonResponse toResponse(Person person);

	    List<PersonResponse> toResponseList(List<Person> persons);

	    @Mapping(target = "category", ignore = true)
	    @Mapping(target = "owner", ignore = true)
	    @Mapping(target = "id", ignore = true)
	    Person toEntity(PersonRequest request);

	    @Mapping(target = "category", ignore = true)
	    @Mapping(target = "owner", ignore = true)
	    @Mapping(target = "id", ignore = true)
	    void updateEntityFromRequest(PersonRequest request, @MappingTarget Person person);

}
