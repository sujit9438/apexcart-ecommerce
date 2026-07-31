package com.ecommerce.controller;

import com.ecommerce.payload.request.*;
import com.ecommerce.payload.response.ApiResponse;
import com.ecommerce.payload.response.JwtResponse;
import com.ecommerce.payload.response.MessageResponse;
import com.ecommerce.payload.response.TokenRefreshResponse;
import com.ecommerce.security.UserDetailsImpl;
import com.ecommerce.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
@Tag(name = "Authentication", description = "Endpoints for user registration, login, token refresh, and password recovery")
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    @Operation(summary = "User Login")
    public ResponseEntity<ApiResponse<JwtResponse>> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        JwtResponse response = authService.authenticateUser(loginRequest);
        return ResponseEntity.ok(ApiResponse.success(response, "Login successful"));
    }

    @PostMapping("/register")
    @Operation(summary = "User Registration")
    public ResponseEntity<ApiResponse<MessageResponse>> registerUser(@Valid @RequestBody RegisterRequest registerRequest) {
        MessageResponse response = authService.registerUser(registerRequest);
        return ResponseEntity.ok(ApiResponse.success(response, "Registration successful"));
    }

    @PostMapping("/refresh-token")
    @Operation(summary = "Refresh JWT Token")
    public ResponseEntity<ApiResponse<TokenRefreshResponse>> refreshToken(@Valid @RequestBody TokenRefreshRequest request) {
        TokenRefreshResponse response = authService.refreshToken(request);
        return ResponseEntity.ok(ApiResponse.success(response, "Token refreshed successfully"));
    }

    @PostMapping("/forgot-password")
    @Operation(summary = "Request Password Reset Token")
    public ResponseEntity<ApiResponse<MessageResponse>> forgotPassword(@Valid @RequestBody ForgotPasswordRequest request) {
        MessageResponse response = authService.forgotPassword(request);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @PostMapping("/reset-password")
    @Operation(summary = "Reset Password With Token")
    public ResponseEntity<ApiResponse<MessageResponse>> resetPassword(@Valid @RequestBody ResetPasswordRequest request) {
        MessageResponse response = authService.resetPassword(request);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @PostMapping("/logout")
    @Operation(summary = "User Logout")
    public ResponseEntity<ApiResponse<MessageResponse>> logoutUser(@AuthenticationPrincipal UserDetailsImpl userDetails) {
        if (userDetails != null) {
            authService.logoutUser(userDetails.getId());
        }
        return ResponseEntity.ok(ApiResponse.success(new MessageResponse("Log out successful!")));
    }
}
