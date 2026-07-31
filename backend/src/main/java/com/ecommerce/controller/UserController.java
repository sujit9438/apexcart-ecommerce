package com.ecommerce.controller;

import com.ecommerce.entity.User;
import com.ecommerce.exception.ResourceNotFoundException;
import com.ecommerce.payload.response.ApiResponse;
import com.ecommerce.repository.UserRepository;
import com.ecommerce.security.UserDetailsImpl;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
@Tag(name = "Users", description = "User profile and user management APIs")
public class UserController {

    private final UserRepository userRepository;

    @GetMapping("/me")
    @Operation(summary = "Get current logged-in user profile")
    public ResponseEntity<ApiResponse<User>> getCurrentUser(@AuthenticationPrincipal UserDetailsImpl userDetails) {
        User user = userRepository.findById(userDetails.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return ResponseEntity.ok(ApiResponse.success(user));
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Get all users (Admin only)")
    public ResponseEntity<ApiResponse<List<User>>> getAllUsers() {
        return ResponseEntity.ok(ApiResponse.success(userRepository.findAll()));
    }
}
