package com.ecommerce.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ReviewDto {
    private Long id;
    private ProductDto product;
    private UserDto user;
    private Integer rating;
    private String comment;
    private LocalDateTime createdAt;
}
