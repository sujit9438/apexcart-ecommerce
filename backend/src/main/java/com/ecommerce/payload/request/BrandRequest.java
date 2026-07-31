package com.ecommerce.payload.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class BrandRequest {
    @NotBlank
    private String name;
    private String logoUrl;
    private String description;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getLogoUrl() {
        return logoUrl;
    }

    public void setLogoUrl(String logoUrl) {
        this.logoUrl = logoUrl;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}
