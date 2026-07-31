package com.ecommerce.controller;

import com.ecommerce.entity.Brand;
import com.ecommerce.payload.request.BrandRequest;
import com.ecommerce.payload.response.ApiResponse;
import com.ecommerce.service.BrandService;
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
@RequestMapping("/api/v1/brands")
@RequiredArgsConstructor
@Tag(name = "Brands", description = "Brand management APIs")
public class BrandController {

    private final BrandService brandService;

    @GetMapping
    @Operation(summary = "Get all brands")
    public ResponseEntity<ApiResponse<List<Brand>>> getAllBrands() {
        return ResponseEntity.ok(ApiResponse.success(brandService.getAllBrands()));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get brand by ID")
    public ResponseEntity<ApiResponse<Brand>> getBrandById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(brandService.getBrandById(id)));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Create brand (Admin only)")
    public ResponseEntity<ApiResponse<Brand>> createBrand(@Valid @RequestBody BrandRequest request) {
        return ResponseEntity.ok(ApiResponse.success(brandService.createBrand(request), "Brand created successfully"));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Update brand (Admin only)")
    public ResponseEntity<ApiResponse<Brand>> updateBrand(@PathVariable Long id, @Valid @RequestBody BrandRequest request) {
        return ResponseEntity.ok(ApiResponse.success(brandService.updateBrand(id, request), "Brand updated successfully"));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Delete brand (Admin only)")
    public ResponseEntity<ApiResponse<Void>> deleteBrand(@PathVariable Long id) {
        brandService.deleteBrand(id);
        return ResponseEntity.ok(ApiResponse.success(null, "Brand deleted successfully"));
    }
}
