package com.ecommerce.controller;

import com.ecommerce.entity.Product;
import com.ecommerce.payload.request.ProductRequest;
import com.ecommerce.payload.response.ApiResponse;
import com.ecommerce.service.ProductService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/v1/products")
@RequiredArgsConstructor
@Tag(name = "Products", description = "Product catalog, search, filtering, and admin CRUD endpoints")
public class ProductController {

    private final ProductService productService;

    @GetMapping
    @Operation(summary = "Get paginated products with optional filters, search, and sorting")
    public ResponseEntity<ApiResponse<Page<Product>>> getAllProducts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir,
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) Long brandId,
            @RequestParam(required = false) String search) {
        Page<Product> products = productService.getAllProducts(page, size, sortBy, sortDir, categoryId, brandId, search);
        return ResponseEntity.ok(ApiResponse.success(products));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get product by ID")
    public ResponseEntity<ApiResponse<Product>> getProductById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(productService.getProductById(id)));
    }

    @GetMapping("/slug/{slug}")
    @Operation(summary = "Get product by Slug")
    public ResponseEntity<ApiResponse<Product>> getProductBySlug(@PathVariable String slug) {
        return ResponseEntity.ok(ApiResponse.success(productService.getProductBySlug(slug)));
    }

    @GetMapping("/featured")
    @Operation(summary = "Get featured products")
    public ResponseEntity<ApiResponse<List<Product>>> getFeaturedProducts() {
        return ResponseEntity.ok(ApiResponse.success(productService.getFeaturedProducts()));
    }

    @GetMapping("/new-arrivals")
    @Operation(summary = "Get new arrival products")
    public ResponseEntity<ApiResponse<List<Product>>> getNewArrivals() {
        return ResponseEntity.ok(ApiResponse.success(productService.getNewArrivals()));
    }

    @GetMapping("/search")
    @Operation(summary = "Live search products by keyword")
    public ResponseEntity<ApiResponse<List<Product>>> searchProducts(@RequestParam String q) {
        return ResponseEntity.ok(ApiResponse.success(productService.searchProducts(q)));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Create product (Admin only)")
    public ResponseEntity<ApiResponse<Product>> createProduct(@Valid @RequestBody ProductRequest request) {
        return ResponseEntity.ok(ApiResponse.success(productService.createProduct(request), "Product created successfully"));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Update product (Admin only)")
    public ResponseEntity<ApiResponse<Product>> updateProduct(@PathVariable Long id, @Valid @RequestBody ProductRequest request) {
        return ResponseEntity.ok(ApiResponse.success(productService.updateProduct(id, request), "Product updated successfully"));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Delete product (Admin only)")
    public ResponseEntity<ApiResponse<Void>> deleteProduct(@PathVariable Long id) {
        productService.deleteProduct(id);
        return ResponseEntity.ok(ApiResponse.success(null, "Product deleted successfully"));
    }
}
