package com.ecommerce.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "coupons")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Coupon {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Column(nullable = false, unique = true)
    private String code;

    private BigDecimal discountPercentage;

    private BigDecimal discountAmount;

    private BigDecimal minSpend;

    private BigDecimal maxDiscount;

    private LocalDateTime validFrom;

    private LocalDateTime validUntil;

    @Builder.Default
    private Integer usageLimit = 100;

    @Builder.Default
    private Integer timesUsed = 0;

    @Builder.Default
    private boolean active = true;
}
