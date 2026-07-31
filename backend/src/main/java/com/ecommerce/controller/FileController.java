package com.ecommerce.controller;

import com.ecommerce.payload.response.ApiResponse;
import com.ecommerce.service.FileStorageService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/v1/files")
@RequiredArgsConstructor
@Tag(name = "Files", description = "Product image upload endpoint")
public class FileController {

    private final FileStorageService fileStorageService;

    @PostMapping("/upload")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Upload image file (Admin only)")
    public ResponseEntity<ApiResponse<Map<String, String>>> uploadFile(@RequestParam("file") MultipartFile file) {
        String fileUrl = fileStorageService.storeFile(file);
        return ResponseEntity.ok(ApiResponse.success(Map.of("url", fileUrl), "File uploaded successfully"));
    }
}
