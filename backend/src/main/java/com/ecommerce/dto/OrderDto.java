package com.ecommerce.dto;

import com.ecommerce.entity.OrderStatus;
import com.ecommerce.entity.PaymentMethod;
import com.ecommerce.entity.PaymentStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class OrderDto {
    private Long id;
    private String orderNumber;
    private UserDto user;
    private List<OrderItemDto> orderItems;
    private OrderStatus status;
    private AddressDto shippingAddress;
    private PaymentMethod paymentMethod;
    private PaymentStatus paymentStatus;
    private BigDecimal subtotal;
    private BigDecimal taxAmount;
    private BigDecimal shippingFee;
    private BigDecimal discountAmount;
    private BigDecimal totalAmount;
    private String couponCode;
    private String trackingNumber;
    private LocalDateTime createdAt;
}
