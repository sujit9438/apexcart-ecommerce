package com.ecommerce.service;

import com.ecommerce.entity.Category;
import com.ecommerce.exception.BadRequestException;
import com.ecommerce.exception.ResourceNotFoundException;
import com.ecommerce.payload.request.CategoryRequest;
import com.ecommerce.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CategoryService {

    private final CategoryRepository categoryRepository;

    public List<Category> getAllCategories() {
        return categoryRepository.findAll();
    }

    public List<Category> getFeaturedCategories() {
        return categoryRepository.findByFeaturedTrue();
    }

    public Category getCategoryById(Long id) {
        return categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + id));
    }

    @Transactional
    public Category createCategory(CategoryRequest request) {
        if (categoryRepository.existsByName(request.getName())) {
            throw new BadRequestException("Category name already exists");
        }
        String slug = request.getName().toLowerCase().replaceAll("[^a-z0-9]", "-").replaceAll("-+", "-");

        Category category = Category.builder()
                .name(request.getName())
                .slug(slug)
                .description(request.getDescription())
                .imageUrl(request.getImageUrl())
                .featured(request.isFeatured())
                .build();

        return categoryRepository.save(category);
    }

    @Transactional
    public Category updateCategory(Long id, CategoryRequest request) {
        Category category = getCategoryById(id);
        category.setName(request.getName());
        category.setDescription(request.getDescription());
        category.setImageUrl(request.getImageUrl());
        category.setFeatured(request.isFeatured());
        return categoryRepository.save(category);
    }

    @Transactional
    public void deleteCategory(Long id) {
        Category category = getCategoryById(id);
        categoryRepository.delete(category);
    }
}
