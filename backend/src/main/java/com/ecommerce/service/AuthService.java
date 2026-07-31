package com.ecommerce.service;

import com.ecommerce.entity.ERole;
import com.ecommerce.entity.PasswordResetToken;
import com.ecommerce.entity.RefreshToken;
import com.ecommerce.entity.Role;
import com.ecommerce.entity.User;
import com.ecommerce.exception.BadRequestException;
import com.ecommerce.exception.ResourceNotFoundException;
import com.ecommerce.exception.TokenRefreshException;
import com.ecommerce.payload.request.*;
import com.ecommerce.payload.response.JwtResponse;
import com.ecommerce.payload.response.MessageResponse;
import com.ecommerce.payload.response.TokenRefreshResponse;
import com.ecommerce.repository.PasswordResetTokenRepository;
import com.ecommerce.repository.RoleRepository;
import com.ecommerce.repository.UserRepository;
import com.ecommerce.security.JwtUtils;
import com.ecommerce.security.UserDetailsImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder encoder;
    private final JwtUtils jwtUtils;
    private final RefreshTokenService refreshTokenService;
    private final PasswordResetTokenRepository passwordResetTokenRepository;

    public JwtResponse authenticateUser(LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        String jwt = jwtUtils.generateJwtToken(userDetails);

        List<String> roles = userDetails.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.toList());

        RefreshToken refreshToken = refreshTokenService.createRefreshToken(userDetails.getId());

        return JwtResponse.builder()
                .token(jwt)
                .refreshToken(refreshToken.getToken())
                .id(userDetails.getId())
                .fullName(userDetails.getFullName())
                .email(userDetails.getEmail())
                .roles(roles)
                .build();
    }

    @Transactional
    public MessageResponse registerUser(RegisterRequest registerRequest) {
        if (userRepository.existsByEmail(registerRequest.getEmail())) {
            throw new BadRequestException("Error: Email is already in use!");
        }

        User user = User.builder()
                .fullName(registerRequest.getFullName())
                .email(registerRequest.getEmail())
                .password(encoder.encode(registerRequest.getPassword()))
                .phone(registerRequest.getPhone())
                .enabled(true)
                .emailVerified(true)
                .build();

        Set<Role> roles = new HashSet<>();
        Role customerRole = roleRepository.findByName(ERole.ROLE_CUSTOMER)
                .orElseGet(() -> roleRepository.save(new Role(ERole.ROLE_CUSTOMER)));
        roles.add(customerRole);
        user.setRoles(roles);

        userRepository.save(user);
        return new MessageResponse("User registered successfully!");
    }

    public TokenRefreshResponse refreshToken(TokenRefreshRequest request) {
        String requestRefreshToken = request.getRefreshToken();

        return refreshTokenService.findByToken(requestRefreshToken)
                .map(refreshTokenService::verifyExpiration)
                .map(RefreshToken::getUser)
                .map(user -> {
                    String token = jwtUtils.generateTokenFromUsername(user.getEmail());
                    return new TokenRefreshResponse(token, requestRefreshToken, "Bearer");
                })
                .orElseThrow(() -> new TokenRefreshException(requestRefreshToken, "Refresh token is not in database!"));
    }

    public MessageResponse forgotPassword(ForgotPasswordRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("User with email " + request.getEmail() + " not found"));

        String token = UUID.randomUUID().toString();
        PasswordResetToken resetToken = passwordResetTokenRepository.findByUser(user)
                .orElseGet(() -> PasswordResetToken.builder().user(user).build());

        resetToken.setToken(token);
        resetToken.setExpiryDate(LocalDateTime.now().plusHours(2));
        passwordResetTokenRepository.save(resetToken);

        // Simulated email sending structure ready
        return new MessageResponse("Password reset token generated successfully: " + token);
    }

    @Transactional
    public MessageResponse resetPassword(ResetPasswordRequest request) {
        PasswordResetToken resetToken = passwordResetTokenRepository.findByToken(request.getToken())
                .orElseThrow(() -> new BadRequestException("Invalid reset token"));

        if (resetToken.getExpiryDate().isBefore(LocalDateTime.now())) {
            throw new BadRequestException("Reset token has expired");
        }

        User user = resetToken.getUser();
        user.setPassword(encoder.encode(request.getNewPassword()));
        userRepository.save(user);
        passwordResetTokenRepository.delete(resetToken);

        return new MessageResponse("Password reset successful!");
    }

    @Transactional
    public MessageResponse logoutUser(Long userId) {
        refreshTokenService.deleteByUserId(userId);
        return new MessageResponse("Log out successful!");
    }
}
