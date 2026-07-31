package com.ecommerce.controller;

import com.ecommerce.entity.Address;
import com.ecommerce.payload.response.ApiResponse;
import com.ecommerce.security.UserDetailsImpl;
import com.ecommerce.service.AddressService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/v1/addresses")
@RequiredArgsConstructor
@Tag(name = "Addresses", description = "User delivery address management")
public class AddressController {

    private final AddressService addressService;

    @GetMapping
    @Operation(summary = "Get user saved addresses")
    public ResponseEntity<ApiResponse<List<Address>>> getUserAddresses(@AuthenticationPrincipal UserDetailsImpl userDetails) {
        return ResponseEntity.ok(ApiResponse.success(addressService.getUserAddresses(userDetails.getId())));
    }

    @PostMapping
    @Operation(summary = "Create new address")
    public ResponseEntity<ApiResponse<Address>> createAddress(
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @Valid @RequestBody Address address) {
        return ResponseEntity.ok(ApiResponse.success(addressService.createAddress(userDetails.getId(), address), "Address added successfully"));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update address")
    public ResponseEntity<ApiResponse<Address>> updateAddress(
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @PathVariable Long id,
            @Valid @RequestBody Address address) {
        return ResponseEntity.ok(ApiResponse.success(addressService.updateAddress(userDetails.getId(), id, address), "Address updated successfully"));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete address")
    public ResponseEntity<ApiResponse<Void>> deleteAddress(@PathVariable Long id) {
        addressService.deleteAddress(id);
        return ResponseEntity.ok(ApiResponse.success(null, "Address deleted successfully"));
    }
}
