package com.ecommerce.payload.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data
public class ProductRequest {
    @NotBlank
    private String name;
    private String sku;
    private String description;
    
    @NotNull
    private BigDecimal price;
    private BigDecimal discountPrice;
    
    @NotNull
    private Integer stockQuantity;
    
    @NotNull
    private Long categoryId;
    
    private Long brandId;
    private List<String> imageUrls;
    private boolean featured;
    private boolean active = true;
}
