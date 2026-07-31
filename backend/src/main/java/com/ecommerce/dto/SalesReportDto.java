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
public class SalesReportDto {
    private String period; // e.g. "Jan", "Feb", etc.
    private BigDecimal revenue;
    private Long orderCount;
}
