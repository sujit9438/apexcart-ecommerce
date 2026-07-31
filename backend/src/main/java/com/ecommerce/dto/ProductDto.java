package com.ecommerce.dto;

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
public class ProductDto {
    private Long id;
    private String name;
    private String slug;
    private String sku;
    private String description;
    private BigDecimal price;
    private BigDecimal discountPrice;
    private Integer stockQuantity;
    private CategoryDto category;
    private BrandDto brand;
    private List<String> imageUrls;
    private Double rating;
    private Integer reviewCount;
    private boolean featured;
    private boolean active;
    private LocalDateTime createdAt;
}
