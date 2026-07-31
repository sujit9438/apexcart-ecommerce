package com.ecommerce.controller;

import com.ecommerce.entity.Wishlist;
import com.ecommerce.payload.response.ApiResponse;
import com.ecommerce.security.UserDetailsImpl;
import com.ecommerce.service.WishlistService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/v1/wishlist")
@RequiredArgsConstructor
@Tag(name = "Wishlist", description = "Wishlist management endpoints")
public class WishlistController {

    private final WishlistService wishlistService;

    @GetMapping
    @Operation(summary = "Get user wishlist")
    public ResponseEntity<ApiResponse<Wishlist>> getWishlist(@AuthenticationPrincipal UserDetailsImpl userDetails) {
        return ResponseEntity.ok(ApiResponse.success(wishlistService.getOrCreateWishlist(userDetails.getId())));
    }

    @PostMapping("/{productId}")
    @Operation(summary = "Add product to wishlist")
    public ResponseEntity<ApiResponse<Wishlist>> addToWishlist(
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @PathVariable Long productId) {
        return ResponseEntity.ok(ApiResponse.success(wishlistService.addToWishlist(userDetails.getId(), productId), "Added to wishlist"));
    }

    @DeleteMapping("/{productId}")
    @Operation(summary = "Remove product from wishlist")
    public ResponseEntity<ApiResponse<Wishlist>> removeFromWishlist(
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @PathVariable Long productId) {
        return ResponseEntity.ok(ApiResponse.success(wishlistService.removeFromWishlist(userDetails.getId(), productId), "Removed from wishlist"));
    }
}
