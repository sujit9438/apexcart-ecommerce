package com.ecommerce.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class OrderItemDto {
    private Long id;
    private ProductDto product;
    private String productName;
    private String variantName;
    private Integer quantity;
    private BigDecimal price;
    private BigDecimal totalPrice;
}
