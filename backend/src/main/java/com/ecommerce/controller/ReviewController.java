package com.ecommerce.controller;

import com.ecommerce.entity.Review;
import com.ecommerce.payload.request.ReviewRequest;
import com.ecommerce.payload.response.ApiResponse;
import com.ecommerce.security.UserDetailsImpl;
import com.ecommerce.service.ReviewService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/v1/reviews")
@RequiredArgsConstructor
@Tag(name = "Reviews", description = "Product review endpoints")
public class ReviewController {

    private final ReviewService reviewService;

    @GetMapping("/product/{productId}")
    @Operation(summary = "Get reviews for a product")
    public ResponseEntity<ApiResponse<List<Review>>> getProductReviews(@PathVariable Long productId) {
        return ResponseEntity.ok(ApiResponse.success(reviewService.getProductReviews(productId)));
    }

    @PostMapping
    @Operation(summary = "Add a product review")
    public ResponseEntity<ApiResponse<Review>> addReview(
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @Valid @RequestBody ReviewRequest request) {
        return ResponseEntity.ok(ApiResponse.success(reviewService.addReview(userDetails.getId(), request), "Review submitted successfully"));
    }
}
