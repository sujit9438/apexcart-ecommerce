package com.ecommerce.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class AddressDto {
    private Long id;
    private String fullName;
    private String phone;
    private String street;
    private String city;
    private String state;
    private String zipCode;
    private String country;
    private boolean isDefault;
}
