package com.ecommerce.controller;

import com.ecommerce.dto.DashboardStatsDto;
import com.ecommerce.dto.SalesReportDto;
import com.ecommerce.payload.response.ApiResponse;
import com.ecommerce.service.AdminService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/v1/admin")
@PreAuthorize("hasRole('ADMIN')")
@RequiredArgsConstructor
@Tag(name = "Admin Dashboard", description = "Admin KPIs, analytics, and sales reporting")
public class AdminController {

    private final AdminService adminService;

    @GetMapping("/dashboard/stats")
    @Operation(summary = "Get overall dashboard KPIs and statistics")
    public ResponseEntity<ApiResponse<DashboardStatsDto>> getDashboardStats() {
        return ResponseEntity.ok(ApiResponse.success(adminService.getDashboardStats()));
    }

    @GetMapping("/reports/sales")
    @Operation(summary = "Get monthly sales analytics report")
    public ResponseEntity<ApiResponse<List<SalesReportDto>>> getSalesReport() {
        return ResponseEntity.ok(ApiResponse.success(adminService.getSalesReport()));
    }
}
