package com.ecommerce.payload.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class JwtResponse {
    private String token;
    @Builder.Default
    private String type = "Bearer";
    private String refreshToken;
    private Long id;
    private String fullName;
    private String email;
    private List<String> roles;
}
