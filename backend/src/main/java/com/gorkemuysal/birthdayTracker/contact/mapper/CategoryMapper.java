package com.gorkemuysal.birthdayTracker.contact.mapper;

import java.util.List;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.gorkemuysal.birthdayTracker.contact.Category;
import com.gorkemuysal.birthdayTracker.contact.dto.CategoryRequest;
import com.gorkemuysal.birthdayTracker.contact.dto.CategoryResponse;

@Mapper(componentModel = "spring")
public interface CategoryMapper {

    CategoryResponse toResponse(Category category);

    List<CategoryResponse> toResponseList(List<Category> categories);

    @Mapping(target = "owner", ignore = true)
    @Mapping(target = "id", ignore = true)
    Category toEntity(CategoryRequest request);
}
