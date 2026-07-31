package com.ecommerce.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CouponDto {
    private Long id;
    private String code;
    private BigDecimal discountPercentage;
    private BigDecimal discountAmount;
    private BigDecimal minSpend;
    private BigDecimal maxDiscount;
    private LocalDateTime validFrom;
    private LocalDateTime validUntil;
    private Integer usageLimit;
    private Integer timesUsed;
    private boolean active;
}
