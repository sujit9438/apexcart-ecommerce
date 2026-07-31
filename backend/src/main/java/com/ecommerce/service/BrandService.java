package com.ecommerce.service;

import com.ecommerce.entity.Brand;
import com.ecommerce.exception.BadRequestException;
import com.ecommerce.exception.ResourceNotFoundException;
import com.ecommerce.payload.request.BrandRequest;
import com.ecommerce.repository.BrandRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class BrandService {

    private final BrandRepository brandRepository;

    public List<Brand> getAllBrands() {
        return brandRepository.findAll();
    }

    public Brand getBrandById(Long id) {
        return brandRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Brand not found with id: " + id));
    }

    @Transactional
    public Brand createBrand(BrandRequest request) {
        if (brandRepository.existsByName(request.getName())) {
            throw new BadRequestException("Brand name already exists");
        }
        Brand brand = Brand.builder()
                .name(request.getName())
                .logoUrl(request.getLogoUrl())
                .description(request.getDescription())
                .build();
        return brandRepository.save(brand);
    }

    @Transactional
    public Brand updateBrand(Long id, BrandRequest request) {
        Brand brand = getBrandById(id);
        brand.setName(request.getName());
        brand.setLogoUrl(request.getLogoUrl());
        brand.setDescription(request.getDescription());
        return brandRepository.save(brand);
    }

    @Transactional
    public void deleteBrand(Long id) {
        Brand brand = getBrandById(id);
        brandRepository.delete(brand);
    }
}
