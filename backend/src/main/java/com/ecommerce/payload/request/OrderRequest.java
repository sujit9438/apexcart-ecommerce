package com.ecommerce.payload.request;

import com.ecommerce.entity.PaymentMethod;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class OrderRequest {
    @NotNull
    private Long addressId;

    @NotNull
    private PaymentMethod paymentMethod;

    private String couponCode;
}
