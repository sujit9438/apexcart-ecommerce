package com.ecommerce.controller;

import com.ecommerce.entity.Category;
import com.ecommerce.payload.request.CategoryRequest;
import com.ecommerce.payload.response.ApiResponse;
import com.ecommerce.service.CategoryService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/v1/categories")
@RequiredArgsConstructor
@Tag(name = "Categories", description = "Category management APIs")
public class CategoryController {

    private final CategoryService categoryService;

    @GetMapping
    @Operation(summary = "Get all categories")
    public ResponseEntity<ApiResponse<List<Category>>> getAllCategories() {
        return ResponseEntity.ok(ApiResponse.success(categoryService.getAllCategories()));
    }

    @GetMapping("/featured")
    @Operation(summary = "Get featured categories")
    public ResponseEntity<ApiResponse<List<Category>>> getFeaturedCategories() {
        return ResponseEntity.ok(ApiResponse.success(categoryService.getFeaturedCategories()));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get category by ID")
    public ResponseEntity<ApiResponse<Category>> getCategoryById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(categoryService.getCategoryById(id)));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Create category (Admin only)")
    public ResponseEntity<ApiResponse<Category>> createCategory(@Valid @RequestBody CategoryRequest request) {
        return ResponseEntity.ok(ApiResponse.success(categoryService.createCategory(request), "Category created successfully"));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Update category (Admin only)")
    public ResponseEntity<ApiResponse<Category>> updateCategory(@PathVariable Long id, @Valid @RequestBody CategoryRequest request) {
        return ResponseEntity.ok(ApiResponse.success(categoryService.updateCategory(id, request), "Category updated successfully"));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Delete category (Admin only)")
    public ResponseEntity<ApiResponse<Void>> deleteCategory(@PathVariable Long id) {
        categoryService.deleteCategory(id);
        return ResponseEntity.ok(ApiResponse.success(null, "Category deleted successfully"));
    }
}
