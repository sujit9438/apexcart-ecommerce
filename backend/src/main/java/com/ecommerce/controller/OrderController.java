package com.ecommerce.controller;

import com.ecommerce.entity.Order;
import com.ecommerce.entity.OrderStatus;
import com.ecommerce.payload.request.OrderRequest;
import com.ecommerce.payload.request.OrderStatusUpdateRequest;
import com.ecommerce.payload.response.ApiResponse;
import com.ecommerce.security.UserDetailsImpl;
import com.ecommerce.service.OrderService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/v1/orders")
@RequiredArgsConstructor
@Tag(name = "Orders", description = "Order placement, tracking, history, and status management endpoints")
public class OrderController {

    private final OrderService orderService;

    @PostMapping
    @Operation(summary = "Place a new order")
    public ResponseEntity<ApiResponse<Order>> placeOrder(
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @Valid @RequestBody OrderRequest request) {
        return ResponseEntity.ok(ApiResponse.success(orderService.placeOrder(userDetails.getId(), request), "Order placed successfully"));
    }

    @GetMapping("/my-orders")
    @Operation(summary = "Get user order history")
    public ResponseEntity<ApiResponse<List<Order>>> getUserOrders(@AuthenticationPrincipal UserDetailsImpl userDetails) {
        return ResponseEntity.ok(ApiResponse.success(orderService.getUserOrders(userDetails.getId())));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get order by ID")
    public ResponseEntity<ApiResponse<Order>> getOrderById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(orderService.getOrderById(id)));
    }

    @GetMapping("/track/{orderNumber}")
    @Operation(summary = "Track order by Order Number")
    public ResponseEntity<ApiResponse<Order>> trackOrder(@PathVariable String orderNumber) {
        return ResponseEntity.ok(ApiResponse.success(orderService.getOrderByNumber(orderNumber)));
    }

    @PostMapping("/{id}/cancel")
    @Operation(summary = "Cancel an order")
    public ResponseEntity<ApiResponse<Order>> cancelOrder(
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(orderService.cancelOrder(userDetails.getId(), id), "Order cancelled successfully"));
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Get all orders (Admin only)")
    public ResponseEntity<ApiResponse<Page<Order>>> getAllOrders(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) OrderStatus status) {
        return ResponseEntity.ok(ApiResponse.success(orderService.getAllOrders(page, size, status)));
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Update order status (Admin only)")
    public ResponseEntity<ApiResponse<Order>> updateOrderStatus(
            @PathVariable Long id,
            @Valid @RequestBody OrderStatusUpdateRequest request) {
        return ResponseEntity.ok(ApiResponse.success(orderService.updateOrderStatus(id, request), "Order status updated successfully"));
    }
}
