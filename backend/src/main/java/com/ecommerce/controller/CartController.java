package com.ecommerce.controller;

import com.ecommerce.entity.Cart;
import com.ecommerce.payload.request.CartItemRequest;
import com.ecommerce.payload.response.ApiResponse;
import com.ecommerce.security.UserDetailsImpl;
import com.ecommerce.service.CartService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/v1/cart")
@RequiredArgsConstructor
@Tag(name = "Cart", description = "Shopping cart operations")
public class CartController {

    private final CartService cartService;

    @GetMapping
    @Operation(summary = "Get user shopping cart")
    public ResponseEntity<ApiResponse<Cart>> getCart(@AuthenticationPrincipal UserDetailsImpl userDetails) {
        return ResponseEntity.ok(ApiResponse.success(cartService.getOrCreateCart(userDetails.getId())));
    }

    @PostMapping("/items")
    @Operation(summary = "Add item to cart")
    public ResponseEntity<ApiResponse<Cart>> addToCart(
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @Valid @RequestBody CartItemRequest request) {
        return ResponseEntity.ok(ApiResponse.success(cartService.addToCart(userDetails.getId(), request), "Item added to cart"));
    }

    @PutMapping("/items/{cartItemId}")
    @Operation(summary = "Update cart item quantity")
    public ResponseEntity<ApiResponse<Cart>> updateCartItemQuantity(
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @PathVariable Long cartItemId,
            @RequestParam Integer quantity) {
        return ResponseEntity.ok(ApiResponse.success(cartService.updateCartItemQuantity(userDetails.getId(), cartItemId, quantity)));
    }

    @DeleteMapping("/items/{cartItemId}")
    @Operation(summary = "Remove item from cart")
    public ResponseEntity<ApiResponse<Cart>> removeFromCart(
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @PathVariable Long cartItemId) {
        return ResponseEntity.ok(ApiResponse.success(cartService.removeFromCart(userDetails.getId(), cartItemId), "Item removed from cart"));
    }

    @DeleteMapping
    @Operation(summary = "Clear shopping cart")
    public ResponseEntity<ApiResponse<Void>> clearCart(@AuthenticationPrincipal UserDetailsImpl userDetails) {
        cartService.clearCart(userDetails.getId());
        return ResponseEntity.ok(ApiResponse.success(null, "Cart cleared successfully"));
    }
}
