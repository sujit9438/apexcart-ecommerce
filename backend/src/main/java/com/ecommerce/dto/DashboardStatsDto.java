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
public class DashboardStatsDto {
    private BigDecimal totalRevenue;
    private Long totalOrders;
    private Long totalUsers;
    private Long totalProducts;
    private Long lowStockCount;
    private Long pendingOrdersCount;
}
