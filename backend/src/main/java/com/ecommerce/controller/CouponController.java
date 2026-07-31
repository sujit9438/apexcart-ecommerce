package com.ecommerce.controller;

import com.ecommerce.entity.Coupon;
import com.ecommerce.payload.request.CouponRequest;
import com.ecommerce.payload.response.ApiResponse;
import com.ecommerce.service.CouponService;
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
@RequestMapping("/api/v1/coupons")
@RequiredArgsConstructor
@Tag(name = "Coupons", description = "Coupon validation & admin management")
public class CouponController {

    private final CouponService couponService;

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Get all coupons (Admin only)")
    public ResponseEntity<ApiResponse<List<Coupon>>> getAllCoupons() {
        return ResponseEntity.ok(ApiResponse.success(couponService.getAllCoupons()));
    }

    @GetMapping("/code/{code}")
    @Operation(summary = "Verify and fetch coupon by code")
    public ResponseEntity<ApiResponse<Coupon>> getCouponByCode(@PathVariable String code) {
        return ResponseEntity.ok(ApiResponse.success(couponService.getCouponByCode(code)));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Create coupon (Admin only)")
    public ResponseEntity<ApiResponse<Coupon>> createCoupon(@Valid @RequestBody CouponRequest request) {
        return ResponseEntity.ok(ApiResponse.success(couponService.createCoupon(request), "Coupon created successfully"));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Update coupon (Admin only)")
    public ResponseEntity<ApiResponse<Coupon>> updateCoupon(@PathVariable Long id, @Valid @RequestBody CouponRequest request) {
        return ResponseEntity.ok(ApiResponse.success(couponService.updateCoupon(id, request), "Coupon updated successfully"));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Delete coupon (Admin only)")
    public ResponseEntity<ApiResponse<Void>> deleteCoupon(@PathVariable Long id) {
        couponService.deleteCoupon(id);
        return ResponseEntity.ok(ApiResponse.success(null, "Coupon deleted successfully"));
    }
}
