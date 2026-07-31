package com.ecommerce.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.Set;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UserDto {
    private Long id;
    private String fullName;
    private String email;
    private String phone;
    private String avatarUrl;
    private boolean enabled;
    private boolean emailVerified;
    private Set<String> roles;
    private LocalDateTime createdAt;
}
