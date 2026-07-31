package com.ecommerce.payload.request;

import com.ecommerce.entity.OrderStatus;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class OrderStatusUpdateRequest {
    @NotNull
    private OrderStatus status;
    private String trackingNumber;
}
