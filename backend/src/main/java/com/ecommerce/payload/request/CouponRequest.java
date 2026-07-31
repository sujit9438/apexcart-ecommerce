package com.ecommerce.payload.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class CouponRequest {
    @NotBlank
    private String code;
    private BigDecimal discountPercentage;
    private BigDecimal discountAmount;
    private BigDecimal minSpend;
    private BigDecimal maxDiscount;
    private LocalDateTime validFrom;
    private LocalDateTime validUntil;
    private Integer usageLimit;
    private boolean active = true;
}
