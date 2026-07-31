package com.ecommerce.dto;

import com.ecommerce.entity.PaymentMethod;
import com.ecommerce.entity.PaymentStatus;
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
public class PaymentDto {
    private Long id;
    private Long orderId;
    private PaymentMethod paymentMethod;
    private String transactionId;
    private BigDecimal amount;
    private PaymentStatus status;
    private LocalDateTime createdAt;
}
